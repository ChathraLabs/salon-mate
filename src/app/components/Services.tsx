import { useRef, useState } from 'react';
import { Scissors, Heart, Sparkles, Hand, Palette, Droplet, Crown, Wind } from 'lucide-react';
import { formatServiceDuration, formatServicePrice, salonServices } from '../config/services';

const serviceIcons = {
  'hair-cutting': Scissors,
  'hair-styling': Sparkles,
  'manicure-pedicure': Hand,
  'waxing-threading': Wind,
  'fire-cut-dreadlocks': Droplet,
  'tattoo-piercing': Heart,
  makeup: Palette,
  'bridal-dressing': Crown,
  'groom-dressing': Crown,
  'facial-cleanup': Sparkles,
};

const servicePillLabels: Record<string, string> = {
  'hair-cutting': 'Cut',
  'hair-styling': 'Styling',
  'manicure-pedicure': 'Nails',
  'waxing-threading': 'Waxing',
  'fire-cut-dreadlocks': 'Fire Cut',
  'tattoo-piercing': 'Tattoo',
  makeup: 'Makeup',
  'bridal-dressing': 'Bridal',
  'groom-dressing': 'Groom',
  'facial-cleanup': 'Facial',
};

export function Services({
  onBookService,
  useStateNavigation = false,
}: {
  onBookService?: (serviceId: string) => void;
  useStateNavigation?: boolean;
}) {
  const [selectedServiceId, setSelectedServiceId] = useState(salonServices[0]?.id ?? '');
  const serviceCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleServicePillClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    serviceCardRefs.current[serviceId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  };

  return (
    <section id="services" className="salon-services py-20 sm:py-24 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(138,95,34,0.18), transparent)' }}
      />

      <div className="salon-section-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="salon-section-header salon-services__header mb-10 sm:mb-14">
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--emerald)',
              fontSize: 'clamp(2.2rem, 8vw, 3.25rem)',
              lineHeight: '1.05',
            }}
          >
            Services
            <Sparkles aria-hidden="true" />
          </h2>
          <p
            className="max-w-2xl"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--muted-foreground)',
              fontSize: '1rem',
              lineHeight: '1.7',
            }}
          >
            Choose the perfect treatment for your next visit.
          </p>
          <div className="salon-services__category-strip" aria-label="Salon services">
            {salonServices.map((service) => {
              const Icon = serviceIcons[service.id as keyof typeof serviceIcons] ?? Sparkles;
              const isSelected = selectedServiceId === service.id;

              return (
                <button
                  key={service.id}
                  type="button"
                  className="salon-services__category-pill"
                  onClick={() => handleServicePillClick(service.id)}
                  aria-pressed={isSelected}
                  style={{
                    background: isSelected ? 'var(--emerald)' : 'var(--surface)',
                    color: isSelected ? 'var(--primary-foreground)' : 'var(--foreground)',
                    border: isSelected ? '1px solid var(--emerald)' : '1px solid var(--border)',
                    boxShadow: isSelected ? 'var(--shadow-button)' : 'var(--shadow-soft)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                  }}
                >
                  <Icon aria-hidden="true" />
                  {servicePillLabels[service.id] ?? service.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="salon-services__grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {salonServices.map((service) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons] ?? Sparkles;
            return (
              <div
                key={service.id}
                ref={(node) => {
                  serviceCardRefs.current[service.id] = node;
                }}
                className="salon-service-card group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--surface)',
                  border: selectedServiceId === service.id ? '1px solid var(--emerald)' : '1px solid var(--border)',
                  boxShadow: selectedServiceId === service.id ? '0 14px 34px rgba(6, 68, 55, 0.22)' : 'var(--shadow-card)',
                }}
              >
                <div className="salon-service-card__image relative h-44 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(16,33,29,0.52) 0%, transparent 56%)' }}
                  />
                  <div
                    className="absolute top-3 left-3 p-2.5 rounded-xl"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid rgba(255,250,244,0.75)',
                      boxShadow: 'var(--shadow-soft)',
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: 'var(--gold-dark)' }} />
                  </div>
                </div>

                <div className="salon-service-card__body p-5 space-y-3.5">
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--emerald)', fontSize: '1.12rem', lineHeight: '1.2' }}>
                    {service.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.86rem', lineHeight: '1.6' }}>
                    {service.description}
                  </p>
                  <div
                    className="flex items-center justify-between gap-3 pt-2"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)', fontSize: '0.84rem', fontWeight: 700 }}>
                      From {formatServicePrice(service.basePrice)}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--emerald)',
                        fontSize: '0.72rem',
                        background: 'var(--emerald-soft)',
                        border: '1px solid rgba(6,68,55,0.12)',
                      }}
                    >
                      {formatServiceDuration(service.baseDuration)}
                    </span>
                  </div>
                  <a
                    href="#booking"
                    onClick={(event) => {
                      if (useStateNavigation) {
                        event.preventDefault();
                      }
                      onBookService?.(service.id);
                    }}
                    className="salon-service-card__action block text-center transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      fontFamily: 'var(--font-body)',
                      background: 'var(--emerald)',
                      color: 'var(--primary-foreground)',
                      borderRadius: '9999px',
                      padding: '0.65rem 1rem',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-button)',
                    }}
                  >
                    Book Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
