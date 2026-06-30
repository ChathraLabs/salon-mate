import { Scissors, Heart, Sparkles, Hand, Palette, Droplet, Crown, Wind } from 'lucide-react';

const services = [
  {
    id: 'hair-cutting',
    icon: Scissors,
    name: 'Hair Cutting',
    description: 'Clean, precise haircuts and trims tailored to your face shape and style.',
    price: 'From LKR 2,500',
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1654097801176-cb1795fd0c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'hair-styling',
    icon: Sparkles,
    name: 'Hair Styling',
    description: 'Blow dry, hair setting, color, and finishing for polished everyday or event looks.',
    price: 'From LKR 2,500',
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1762745103094-6760fab8eb50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'manicure-pedicure',
    icon: Hand,
    name: 'Manicure & Pedicure',
    description: 'Hand and foot care with shaping, cuticle care, polish, and optional gel finish.',
    price: 'From LKR 1,500',
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1772322586754-34c9e6f5be6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxuYWlsJTIwY2FyZSUyMG1hbmljdXJlfGVufDF8fHx8MTc3ODUxODE3NXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'waxing-threading',
    icon: Wind,
    name: 'Waxing & Threading',
    description: 'Full body waxing, eyebrow threading, and facial hair removal.',
    price: 'From LKR 500',
    duration: '20 min',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'fire-cut-dreadlocks',
    icon: Droplet,
    name: 'Fire Cut & Dreadlocks',
    description: 'Specialized fire-cut styling, dreadlock creation, and dreadlock maintenance.',
    price: 'From LKR 4,000',
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'tattoo-piercing',
    icon: Heart,
    name: 'Tattoo & Piercing',
    description: 'Tattoo consultation, tattoo sessions, and piercing services.',
    price: 'Contact for pricing',
    duration: 'Varies',
    image: 'https://images.unsplash.com/photo-1696835196034-cf22e2b72736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'makeup',
    icon: Palette,
    name: 'Makeup',
    description: 'Party makeup, event makeup, lashes, and special occasion finishing.',
    price: 'From LKR 5,000',
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxicmlkYWwlMjBtYWtldXAlMjBiZWF1dHl8ZW58MXx8fHwxNzc4NTE4MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'bridal-dressing',
    icon: Crown,
    name: 'Bridal Dressing',
    description: 'Complete bridal makeup, hair styling, and saree draping services.',
    price: 'From LKR 15,000',
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1588842867976-fd084ca2c87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkYWwlMjBtYWtldXAlMjBiZWF1dHl8ZW58MXx8fHwxNzc4NTE4MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'groom-dressing',
    icon: Crown,
    name: 'Groom Dressing',
    description: 'Groom makeup, hair styling, and beard styling for wedding and formal looks.',
    price: 'From LKR 8,000',
    duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1654097801176-cb1795fd0c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 'facial-cleanup',
    icon: Sparkles,
    name: 'Facial & Cleanup',
    description: 'Refreshing cleanup, facial treatments, masks, and skin-brightening care.',
    price: 'From LKR 3,500',
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1599387737838-660b75526801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function Services({ onBookService }: { onBookService?: (serviceId: string) => void }) {
  return (
    <section id="services" className="py-24 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,32,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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
          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--gold-dark))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--gold-dark))' }} />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
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
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(6,4,2,0.6) 0%, transparent 50%)' }}
                  />
                  {/* Icon badge */}
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

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.05rem' }}>
                    {service.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {service.description}
                  </p>
                  <div
                    className="flex items-center justify-between pt-2"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.82rem' }}>
                      {service.price}
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
                      {service.duration}
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
