import { Scissors, Heart, Sparkles, Hand, Palette, Droplet, Crown, Wind, Gem, Flower2 } from 'lucide-react';
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

const specialtyChips = [
  { label: 'All', icon: Sparkles },
  { label: 'Hair', icon: Scissors },
  { label: 'Beauty', icon: Gem },
  { label: 'Bridal', icon: Crown },
  { label: 'Skin', icon: Flower2 },
  { label: 'Tattoo', icon: Heart },
];

export function Services({
  onBookService,
  useStateNavigation = false,
}: {
  onBookService?: (serviceId: string) => void;
  useStateNavigation?: boolean;
}) {
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
          <div className="salon-services__category-strip" aria-label="Salon service categories">
            {specialtyChips.map(({ label, icon: Icon }, index) => (
              <span
                key={label}
                className="salon-services__category-pill"
                style={{
                  background: index === 0 ? 'var(--emerald)' : 'var(--surface)',
                  color: index === 0 ? 'var(--primary-foreground)' : 'var(--foreground)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-soft)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                }}
              >
                <Icon aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="salon-services__grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {salonServices.map((service) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons] ?? Sparkles;
            return (
              <div
                key={service.id}
                className="salon-service-card group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)',
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
