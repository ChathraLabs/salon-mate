import { Star, Users, Award } from 'lucide-react';

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      style={{ background: 'var(--background)' }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-20 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(242,200,58,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,165,32,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      {/* Subtle diagonal lines texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left Content ── */}
          <div className="space-y-10">
            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(212,165,32,0.1)',
                border: '1px solid rgba(212,165,32,0.3)',
                fontFamily: 'var(--font-body)',
                color: 'var(--gold)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold-light)' }} />
              Sri Lanka's Premier Beauty Salon
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--foreground)',
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  lineHeight: '1.05',
                  letterSpacing: '-0.01em',
                }}
              >
                <span className="block">Look</span>
                <span
                  className="block italic"
                  style={{
                    color: 'var(--gold)',
                    textShadow: '0 0 40px rgba(212,165,32,0.3)',
                  }}
                >
                  Beautiful.
                </span>
                <span className="block">Feel</span>
                <span
                  className="block italic"
                  style={{
                    color: 'var(--gold-light)',
                    textShadow: '0 0 40px rgba(242,200,58,0.25)',
                  }}
                >
                  Confident.
                </span>
              </h1>
            </div>

            <p
              className="max-w-lg leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--muted-foreground)',
                fontSize: '1.05rem',
              }}
            >
              Experience professional salon services, bridal styling, hair care, beauty treatments,
              and tattoo training at Sri Lanka's premier grooming academy.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#booking"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, var(--gold-dark) 0%, var(--gold) 50%, var(--gold-light) 100%)',
                  color: 'var(--primary-foreground)',
                  padding: '1rem 2.25rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  letterSpacing: '0.04em',
                  boxShadow: '0 4px 24px rgba(212,165,32,0.3)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,165,32,0.5)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(212,165,32,0.3)')}
              >
                Book Appointment
              </a>
              <a
                href="#services"
                style={{
                  fontFamily: 'var(--font-body)',
                  border: '1px solid rgba(212,165,32,0.35)',
                  color: 'var(--foreground)',
                  padding: '1rem 2.25rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  letterSpacing: '0.04em',
                  transition: 'all 0.2s',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gold)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212,165,32,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,165,32,0.35)';
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }}
              >
                View Services
              </a>
            </div>

            {/* Trust Indicators */}
            <div
              className="grid grid-cols-3 gap-6 pt-6"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5" style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem' }}>
                  4.8 Rating
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Users className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem' }}>
                  500+ Clients
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Award className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem' }}>
                  Pro Stylists
                </p>
              </div>
            </div>
          </div>

          {/* ── Right Image ── */}
          <div className="relative lg:h-[620px] h-96">
            {/* Gold glow behind image */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(212,165,32,0.18) 0%, transparent 70%)',
                transform: 'scale(1.1)',
              }}
            />
            {/* Decorative offset border */}
            <div
              className="absolute rounded-3xl"
              style={{
                inset: '1rem -1rem -1rem 1rem',
                border: '1px solid rgba(212,165,32,0.2)',
                borderRadius: '1.5rem',
              }}
            />
            {/* Main image */}
            <div className="relative h-full rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(212,165,32,0.15)' }}>
              <img
                src="https://images.unsplash.com/photo-1776850476481-2bccba2e35c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional Salon Service"
                className="w-full h-full object-cover"
              />
              {/* Dark-to-transparent overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(6,4,2,0.7) 0%, rgba(6,4,2,0.1) 55%, transparent 100%)' }}
              />
              {/* Floating badge */}
              <div
                className="absolute bottom-6 left-6 px-5 py-3 rounded-2xl"
                style={{
                  background: 'rgba(12,9,8,0.88)',
                  border: '1px solid rgba(212,165,32,0.3)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.9rem' }}>
                  Scissor King Dimma
                </p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>
                  Est. 2020 · Colombo, Sri Lanka
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
