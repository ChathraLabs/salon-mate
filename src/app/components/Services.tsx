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

export function Services({ onBookService }: { onBookService?: (serviceId: string) => void }) {
  return (
    <section id="services" className="py-24 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,32,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--gold)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            ✦ What We Offer ✦
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--foreground)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            }}
          >
            Our Services
          </h2>
          <p
            className="max-w-xl mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--muted-foreground)',
              fontSize: '1rem',
              lineHeight: '1.7',
            }}
          >
            Discover our comprehensive range of beauty and grooming services tailored to your needs
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--gold-dark))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--gold-dark))' }} />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {salonServices.map((service) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons] ?? Sparkles;
            return (
              <div
                key={service.id}
                className="group w-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] xl:w-[calc((100%-3.75rem)/4)]"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,165,32,0.4)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(212,165,32,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--border)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.4)';
                }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(6,4,2,0.6) 0%, transparent 50%)' }}
                  />
                  <div
                    className="absolute top-3 left-3 p-2.5 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                      boxShadow: '0 2px 12px rgba(212,165,32,0.4)',
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: 'var(--primary-foreground)' }} />
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.05rem' }}>
                    {service.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {service.description}
                  </p>
                  <div
                    className="flex items-center justify-between pt-2"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.82rem' }}>
                      From {formatServicePrice(service.basePrice)}
                    </span>
                    <span
                      className="px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--muted-foreground)',
                        fontSize: '0.72rem',
                        background: 'rgba(212,165,32,0.08)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {formatServiceDuration(service.baseDuration)}
                    </span>
                  </div>
                  <a
                    href="#booking"
                    onClick={() => onBookService?.(service.id)}
                    className="block text-center transition-all duration-200"
                    style={{
                      fontFamily: 'var(--font-body)',
                      background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                      color: 'var(--primary-foreground)',
                      borderRadius: '9999px',
                      padding: '0.6rem 1rem',
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      letterSpacing: '0.03em',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,32,0.35)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
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
