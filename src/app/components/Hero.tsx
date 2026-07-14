import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarCheck,
  CalendarDays,
  Clock,
  Heart,
  Images,
  Leaf,
  MessageCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { formatServiceDuration, formatServicePrice, salonServices, salonStaffProfiles } from '../config/services';

type HeroProps = {
  useStateNavigation?: boolean;
  onBookAppointment?: () => void;
  onViewServices?: () => void;
  onViewGallery?: () => void;
  onContact?: () => void;
  onBookService?: (serviceId: string) => void;
};

const featureTabs = [
  { label: 'Services', icon: Scissors, action: 'services' },
  { label: 'Book', icon: CalendarCheck, action: 'booking' },
  { label: 'Gallery', icon: Images, action: 'gallery' },
  { label: 'Contact', icon: MessageCircle, action: 'contact' },
] as const;

const popularServiceIds = ['hair-cutting', 'bridal-dressing'];
const popularServices = popularServiceIds
  .map((id) => salonServices.find((service) => service.id === id))
  .filter(Boolean)
  .map((service) => service!);

const todayStaffAvailability = [
  { staff: salonStaffProfiles.dimuthu, time: '10:30 AM' },
  { staff: salonStaffProfiles.sanju, time: '11:00 AM' },
  { staff: salonStaffProfiles.salindee, time: '12:30 PM' },
  { staff: salonStaffProfiles.vinu, time: '2:00 PM' },
];

export function Hero({
  useStateNavigation = false,
  onBookAppointment,
  onViewServices,
  onViewGallery,
  onContact,
  onBookService,
}: HeroProps) {
  const handleBookingClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (useStateNavigation) {
      event.preventDefault();
    }
    onBookAppointment?.();
  };

  const handleServicesClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (useStateNavigation) {
      event.preventDefault();
    }
    onViewServices?.();
  };

  const handleFeatureTabClick = (event: React.MouseEvent<HTMLAnchorElement>, action: (typeof featureTabs)[number]['action']) => {
    if (action === 'booking') {
      handleBookingClick(event);
      return;
    }

    if (action === 'services') {
      handleServicesClick(event);
      return;
    }

    if (useStateNavigation) {
      event.preventDefault();
    }

    if (action === 'gallery') {
      onViewGallery?.();
      return;
    }

    if (action === 'contact') {
      onContact?.();
    }
  };

  const handlePopularServiceClick = (event: React.MouseEvent<HTMLAnchorElement>, serviceId: string) => {
    if (useStateNavigation) {
      event.preventDefault();
    }
    onBookService?.(serviceId);
  };

  return (
    <section
      id="home"
      className="salon-hero relative min-h-screen flex items-center pt-20 overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, var(--cream) 0%, #fffaf4 48%, var(--cream-warm) 100%)',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(6,68,55,0.08), transparent)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(138,95,34,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(138,95,34,0.08) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'linear-gradient(to bottom, transparent, rgba(255,255,255,1) 18%, rgba(255,255,255,1) 68%, transparent)',
        }}
      />

      <div className="salon-section-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full relative">
        <nav className="salon-hero__feature-tabs lg:hidden" aria-label="Home shortcuts">
          {featureTabs.map(({ label, icon: Icon, action }, index) => (
            <a
              key={label}
              href={action === 'booking' ? '#booking' : `#${action}`}
              onClick={(event) => handleFeatureTabClick(event, action)}
              className="salon-hero__feature-tab"
              aria-label={label}
              style={{
                background: index === 0 ? 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))' : 'var(--surface)',
                color: index === 0 ? 'var(--primary-foreground)' : 'var(--foreground)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <Icon className="w-4 h-4" style={{ color: index === 0 ? 'var(--gold-light)' : 'currentColor' }} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="salon-hero__grid grid lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-center">
          <div className="salon-hero__content space-y-7 sm:space-y-9">
            <div
              className="salon-hero__eyebrow inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-soft)',
                fontFamily: 'var(--font-body)',
                color: 'var(--gold-dark)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              <Scissors className="w-3.5 h-3.5" />
              Sri Lanka's Premier Beauty Salon
            </div>

            <div className="space-y-5">
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--emerald)',
                  fontSize: 'clamp(3.25rem, 12vw, 5rem)',
                  lineHeight: '0.96',
                }}
              >
                <span className="block">Look</span>
                <span className="block">Beautiful.</span>
                <span className="salon-hero__confidence block italic" style={{ color: 'var(--gold-dark)' }}>
                  Feel Confident.
                </span>
              </h1>
              <p
                className="max-w-xl leading-relaxed"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--muted-foreground)',
                  fontSize: '1.05rem',
                }}
              >
                Book your next salon visit in minutes.
              </p>
            </div>

            <div className="salon-hero__actions flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#booking"
                onClick={handleBookingClick}
                className="hidden lg:inline-flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))',
                  color: 'var(--primary-foreground)',
                  padding: '1rem 2.25rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-button)',
                }}
              >
                <CalendarDays className="w-4 h-4" />
                Book Appointment
              </a>
              <a
                href="#services"
                onClick={handleServicesClick}
                className="inline-flex w-full sm:w-auto items-center justify-center transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-body)',
                  border: '1px solid var(--border)',
                  color: 'var(--emerald)',
                  padding: '1rem 2.25rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  background: 'var(--surface)',
                  boxShadow: 'var(--shadow-soft)',
                }}
              >
                View Services
              </a>
            </div>

            <div
              className="salon-hero__trust grid grid-cols-3 gap-3 sm:gap-4 pt-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <div className="rounded-2xl p-3 sm:p-4 text-center" style={{ background: 'rgba(255,250,244,0.72)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3" style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
                  ))}
                </div>
                <p className="mt-2" style={{ color: 'var(--muted-foreground)', fontSize: '0.76rem' }}>
                  4.8 Rating
                </p>
              </div>
              <div className="rounded-2xl p-3 sm:p-4 text-center" style={{ background: 'rgba(255,250,244,0.72)', border: '1px solid var(--border)' }}>
                <Users className="w-5 h-5 mx-auto" style={{ color: 'var(--emerald)' }} />
                <p className="mt-2" style={{ color: 'var(--muted-foreground)', fontSize: '0.76rem' }}>
                  500+ Clients
                </p>
              </div>
              <div className="rounded-2xl p-3 sm:p-4 text-center" style={{ background: 'rgba(255,250,244,0.72)', border: '1px solid var(--border)' }}>
                <Award className="w-5 h-5 mx-auto" style={{ color: 'var(--gold-dark)' }} />
                <p className="mt-2" style={{ color: 'var(--muted-foreground)', fontSize: '0.76rem' }}>
                  Pro Stylists
                </p>
              </div>
            </div>
          </div>

            <div className="salon-hero__image relative h-[28rem] sm:h-[34rem] lg:h-[620px]">
            <div
              className="absolute -inset-3 rounded-[2.4rem] pointer-events-none"
              style={{ border: '1px solid rgba(189,135,48,0.22)' }}
            />
            <div
              className="relative h-full rounded-[2rem] overflow-hidden"
              style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
            >
              <img
                src="/unsplash.com/services/Bridal%20Dressing.png"
                alt="Scissor King Dimma bridal styling"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 p-5 sm:p-6"
                style={{ background: 'linear-gradient(to top, rgba(16,33,29,0.74), transparent)' }}
              >
                <div
                  className="inline-flex flex-col rounded-2xl px-4 py-3"
                  style={{
                    background: 'rgba(255,250,244,0.92)',
                    border: '1px solid rgba(255,250,244,0.64)',
                    boxShadow: 'var(--shadow-soft)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--emerald)', fontSize: '1rem' }}>
                    Scissor King Dimma
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem' }}>
                    Est. 2020 · Urubokka, Sri Lanka
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="salon-home-features lg:hidden">
          <div
            className="salon-next-card"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{ background: 'rgba(189,135,48,0.1)', color: 'var(--emerald)', fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 800 }}
            >
              <Star className="w-3.5 h-3.5" style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
              TODAY BOOKINGS
            </div>
            <div className="mt-4 flex items-start gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))', color: 'var(--primary-foreground)' }}
              >
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontWeight: 800, fontSize: '1.02rem' }}>
                  Today Bookings
                </p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.94rem' }}>
                  Member availability at a glance
                </p>
              </div>
            </div>
            <div className="my-4 h-px" style={{ background: 'var(--border)' }} />
            <div className="salon-today-availability">
              {todayStaffAvailability.map(({ staff, time }) => (
                <div key={staff.name} className="salon-today-availability__item">
                  <img
                    src={staff.avatarUrl}
                    alt={staff.name}
                    className="h-8 w-8 rounded-full object-cover"
                    style={{ border: '2px solid var(--surface)' }}
                  />
                  <div className="min-w-0">
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.78rem', fontWeight: 800 }}>
                      {staff.name.split(' ')[0]}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.72rem', lineHeight: 1.1 }}>
                      {time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="#booking"
              onClick={handleBookingClick}
              className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-3"
              style={{
                background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))',
                color: 'var(--primary-foreground)',
                boxShadow: 'var(--shadow-button)',
                fontFamily: 'var(--font-body)',
                textDecoration: 'none',
                fontWeight: 800,
              }}
            >
              <CalendarDays className="w-4 h-4" />
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div
            className="salon-offer-banner"
            style={{ background: 'linear-gradient(135deg, var(--emerald-dark), var(--emerald))', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-center gap-3">
              <Scissors className="h-10 w-10 shrink-0" style={{ color: 'var(--gold-light)' }} />
              <div>
                <p style={{ color: '#fffaf4', fontFamily: 'var(--font-body)', fontSize: '0.78rem' }}>New Client Offer</p>
                <p style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-body)', fontSize: '1.35rem', fontWeight: 900, lineHeight: 1 }}>
                  20% OFF
                </p>
                <p style={{ color: '#fffaf4', fontFamily: 'var(--font-body)', fontSize: '0.86rem' }}>On Your First Visit</p>
              </div>
            </div>
            <a
              href="#booking"
              onClick={handleBookingClick}
              className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5"
              style={{ background: 'linear-gradient(135deg, #ffe0a4, var(--gold-light))', color: '#161009', fontFamily: 'var(--font-body)', fontWeight: 800, textDecoration: 'none' }}
            >
              Claim
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="salon-popular-services">
            <div className="mb-4 flex items-center justify-between">
              <h2 style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '1.35rem', fontWeight: 900 }}>
                Popular Services
              </h2>
              <a
                href="#services"
                onClick={handleServicesClick}
                className="inline-flex items-center gap-1"
                style={{ color: 'var(--destructive)', fontFamily: 'var(--font-body)', textDecoration: 'none', fontSize: '0.88rem' }}
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {popularServices.map((service) => (
                <a
                  key={service.id}
                  href="#booking"
                  onClick={(event) => handlePopularServiceClick(event, service.id)}
                  className="salon-popular-service-card"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)', textDecoration: 'none' }}
                >
                  <img src={service.image} alt={service.title} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p style={{ color: 'var(--foreground)', fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: '0.98rem' }}>
                        {service.title}
                      </p>
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ background: '#ffe8df', color: 'var(--destructive)' }}
                      >
                        <Heart className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
                      {service.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem' }}>
                      <span className="inline-flex items-center gap-1" style={{ color: 'var(--foreground)' }}>
                        <Clock className="w-3.5 h-3.5" />
                        {formatServiceDuration(service.baseDuration)}
                      </span>
                      <span style={{ width: 1, height: 16, background: 'var(--border)' }} />
                      <span style={{ color: 'var(--destructive)', fontWeight: 800 }}>{formatServicePrice(service.basePrice)}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div
            className="salon-trust-strip"
            style={{ background: 'rgba(255,250,244,0.9)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}
          >
            {[
              { title: 'Expert Stylists', body: 'Trained & Certified', icon: BadgeCheck },
              { title: 'Premium Products', body: 'Quality You Trust', icon: Leaf },
              { title: 'Hygiene First', body: 'Clean & Safe', icon: ShieldCheck },
            ].map(({ title, body, icon: Icon }) => (
              <div key={title} className="salon-trust-strip__item">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: '#ffe9df', color: 'var(--emerald)' }}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="min-w-0">
                  <span className="block" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-body)', fontWeight: 900, fontSize: '0.78rem' }}>
                    {title}
                  </span>
                  <span className="block" style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '0.72rem' }}>
                    {body}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
