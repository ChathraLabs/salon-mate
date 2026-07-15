"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Clock, Filter, GripVertical, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { salonServices, type SalonServiceOption } from "@/app/config/services";
import { AdminShell } from "../components/AdminShell";
import { AdminPageLoader } from "../components/AdminPageLoader";

type AdminService = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  durationMinutes: number;
  active: boolean;
  sortOrder: number;
  options: Array<{ id: string; name: string; durationMinutes: number; priceCents: number; sortOrder: number; active: boolean }>;
};

type ServiceDraft = {
  id?: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  active: boolean;
  sortOrder: number;
};

const emptyDraft: ServiceDraft = { name: "", description: "", price: "", duration: "", active: true, sortOrder: 0 };

async function readJsonResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try { return JSON.parse(text) as Record<string, any>; }
  catch { return { error: `Server returned an invalid response (${response.status}).` }; }
}

function configuredService(id: string) {
  return salonServices.find((service) => service.id === id) ?? null;
}

function money(priceCents: number) {
  return `LKR ${new Intl.NumberFormat("en-LK").format(priceCents / 100)}`;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<AdminService[]>([]);
  const [query, setQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [draft, setDraft] = useState<ServiceDraft | null>(null);
  const [options, setOptions] = useState<SalonServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadServices() {
    setLoading(true);
    const response = await fetch("/api/admin/services");
    if (response.status === 401) { router.push("/admin/login"); return; }
    const data = await readJsonResponse(response);
    if (!response.ok) setError(data.error ?? "Unable to load services.");
    else { setServices(Array.isArray(data.services) ? data.services : []); setError(null); }
    setLoading(false);
  }

  useEffect(() => { loadServices(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => services.filter((service) => {
    const matchesQuery = !query.trim() || service.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (!showActiveOnly || service.active);
  }), [query, services, showActiveOnly]);

  function editService(service: AdminService) {
    setDraft({ id: service.id, name: service.name, description: service.description ?? "", price: String(service.priceCents / 100), duration: String(service.durationMinutes), active: service.active, sortOrder: service.sortOrder });
    setOptions(service.options.length
      ? service.options.map((option) => ({ id: option.id, name: option.name, duration: option.durationMinutes, price: option.priceCents / 100 }))
      : configuredService(service.id)?.options.map((option) => ({ ...option })) ?? []);
  }

  function startAdd() { setDraft({ ...emptyDraft, sortOrder: services.length }); setOptions([]); }

  async function persist(serviceDraft: ServiceDraft) {
    const response = await fetch("/api/admin/services", {
      method: serviceDraft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(serviceDraft.id ? { id: serviceDraft.id } : {}), name: serviceDraft.name, description: serviceDraft.description || null,
        priceCents: Math.round(Number(serviceDraft.price) * 100), durationMinutes: Number(serviceDraft.duration), active: serviceDraft.active, sortOrder: serviceDraft.sortOrder,
        options: options.map((option, index) => ({ id: option.id, name: option.name, durationMinutes: option.duration, priceCents: Math.round(option.price * 100), sortOrder: index, active: true })),
      }),
    });
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error ?? "Unable to save service.");
    return data.service as AdminService;
  }

  async function saveDraft() {
    if (!draft) return;
    setSaving(true); setError(null);
    try { const saved = await persist(draft); setServices((current) => draft.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]); setDraft(null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save service."); }
    finally { setSaving(false); }
  }

  async function disableService() {
    if (!draft?.id) { setDraft(null); return; }
    setSaving(true);
    try { const saved = await persist({ ...draft, active: false }); setServices((current) => current.map((item) => item.id === saved.id ? saved : item)); setDraft(null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to disable service."); }
    finally { setSaving(false); }
  }

  function updateOption(index: number, field: "name" | "duration" | "price", value: string) {
    setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? { ...option, [field]: field === "name" ? value : Number(value) } : option));
  }

  function addOption() {
    setOptions((current) => [...current, { id: `option-${Date.now()}`, name: "New Option", duration: 30, price: 0 }]);
  }

  if (loading) {
    return <AdminShell active="services"><AdminPageLoader label="Loading services..." /></AdminShell>;
  }

  return (
    <AdminShell active="services">
      <div className="admin-services-mobile">
        {!draft ? <div className="admin-services-list">
          <header><div><h1>Services</h1><p>Manage your salon services and options.</p></div></header>
          <div className="admin-services-toolbar">
            <label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services..." /></label>
            <button type="button" className={showActiveOnly ? "is-active" : ""} onClick={() => setShowActiveOnly((value) => !value)}><Filter />Filter</button>
            <button type="button" className="admin-services-add" onClick={startAdd}><Plus />Add</button>
          </div>
          {error && <p className="admin-services-error">{error}</p>}
          <div className="admin-services-cards">
            {loading ? <p>Loading services...</p> : filtered.map((service) => {
              const configured = configuredService(service.id);
              return <article key={service.id} className="admin-service-card">
                <div className="admin-service-card__image">{configured?.image ? <img src={configured.image} alt="" /> : <SlidersHorizontal />}</div>
                <div className="admin-service-card__body">
                  <div className="admin-service-card__title"><strong>{service.name}</strong><span className={service.active ? "is-active" : ""}>{service.active ? "Active" : "Disabled"}</span></div>
                  <p><SlidersHorizontal />{service.options.length || configured?.options.length || 0} options <i /> From <b>{money(service.priceCents)}</b></p>
                  <p><Clock />Total time <b>{service.durationMinutes} min</b></p>
                  <button type="button" onClick={() => editService(service)}><Pencil />Edit</button>
                </div>
                <button type="button" className="admin-service-card__open" onClick={() => editService(service)} aria-label={`Edit ${service.name}`}><ChevronRight /></button>
              </article>;
            })}
          </div>
        </div> : <div className="admin-service-editor">
          <header><button type="button" onClick={() => setDraft(null)} aria-label="Back"><ArrowLeft /></button><h1>{draft.id ? "Edit Service" : "Add Service"}</h1><button type="button" className="is-delete" onClick={disableService} aria-label="Disable service"><Trash2 /></button></header>
          {error && <p className="admin-services-error">{error}</p>}
          <section className="admin-service-form-card">
            <label>Service Title<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label>Description<textarea maxLength={150} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /><small>{draft.description.length}/150</small></label>
            <div><label>Base Time (min)<input type="number" value={draft.duration} onChange={(event) => setDraft({ ...draft, duration: event.target.value })} /></label><label>Base Price (LKR)<input type="number" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label></div>
          </section>
          <section className="admin-service-options-card"><h2>Service Options</h2>{options.map((option, index) => <div key={option.id} className="admin-service-option-row"><GripVertical /><input value={option.name} onChange={(event) => updateOption(index, "name", event.target.value)} /><label><input type="number" value={option.duration} onChange={(event) => updateOption(index, "duration", event.target.value)} /><span>min</span></label><input type="number" value={option.price} onChange={(event) => updateOption(index, "price", event.target.value)} /><button type="button" onClick={() => setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index))}><Trash2 /></button></div>)}<button type="button" className="admin-service-new-option" onClick={addOption}><Plus />Add New Option</button></section>
          <footer><button type="button" onClick={() => setDraft(null)}>Cancel</button><button type="button" onClick={saveDraft} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button></footer>
        </div>}
      </div>
    </AdminShell>
  );
}
