import { Award, CalendarDays, Scissors, Star, Users } from 'lucide-react';

type HeroProps = {
  useStateNavigation?: boolean;
  onBookAppointment?: () => void;
  onViewServices?: () => void;
};

export function Hero({ useStateNavigation = false, onBookAppointment, onViewServices }: HeroProps) {
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
        <div className="salon-hero__grid grid lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-center">
          <div className="salon-hero__content space-y-7 sm:space-y-9">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full"
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
                <span className="block italic" style={{ color: 'var(--gold-dark)' }}>
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
                Experience professional salon services, bridal styling, hair care, beauty treatments,
                and tattoo training at Sri Lanka's premier grooming academy.
              </p>
            </div>

            <div
              className="lg:hidden rounded-2xl p-5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
            >
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)', fontSize: '0.78rem', fontWeight: 700 }}>
                NEXT AVAILABLE
              </p>
              <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.35rem', marginTop: '0.4rem' }}>
                Book your next salon visit
              </p>
              <a
                href="#booking"
                onClick={handleBookingClick}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))',
                  color: 'var(--primary-foreground)',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-button)',
                }}
              >
                <CalendarDays className="w-4 h-4" />
                Book Appointment
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#booking"
                onClick={handleBookingClick}
                className="inline-flex items-center justify-center gap-2 transition-transform duration-200 hover:-translate-y-0.5"
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
                className="inline-flex items-center justify-center transition-colors duration-200"
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
                src="/unsplash.com/salon-reciption.png"
                alt="Scissor King Dimma salon reception"
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
      </div>
    </section>
  );
}
