import { Award, Users, Briefcase } from 'lucide-react';

const stats = [
  { icon: Award, value: '5+', label: 'Years Experience', color: 'var(--gold)' },
  { icon: Users, value: '1,000+', label: 'Happy Customers', color: 'var(--gold-light)' },
  { icon: Briefcase, value: '20+', label: 'Services Offered', color: 'var(--gold-dark)' },
];

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,32,0.3), transparent)' }}
      />
      {/* Ambient glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,165,32,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left Image ── */}
          <div className="relative">
            {/* Glow frame */}
            <div
              className="absolute rounded-3xl pointer-events-none"
              style={{
                inset: '0.5rem -0.75rem -0.75rem 0.5rem',
                border: '1px solid rgba(212,165,32,0.15)',
                borderRadius: '1.5rem',
              }}
            />
            <div
              className="absolute rounded-3xl pointer-events-none"
              style={{
                inset: '-0.5rem 0.75rem 0.75rem -0.75rem',
                background: 'rgba(212,165,32,0.04)',
                borderRadius: '1.5rem',
              }}
            />
            <div
              className="relative h-[520px] rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(212,165,32,0.2)', boxShadow: '0 8px 48px rgba(0,0,0,0.5)' }}
            >
              <img
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc3ODUxODE3NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Salon Interior"
                className="w-full h-full object-cover"
              />
              {/* Subtle dark overlay at bottom */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(6,4,2,0.4) 0%, transparent 60%)' }}
              />
            </div>
          </div>

          {/* ── Right Content ── */}
          <div className="space-y-10">
            <div className="space-y-5">
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--gold)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                ✦ Our Story ✦
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--foreground)',
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  lineHeight: '1.2',
                }}
              >
                About <em style={{ color: 'var(--gold)' }}>Us</em>
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--muted-foreground)',
                  fontSize: '1rem',
                  lineHeight: '1.8',
                }}
              >
                We are a professional beauty salon offering high-quality hair, beauty, bridal, and skincare services.
                Our team focuses on comfort, hygiene, and personalized care for every customer.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--muted-foreground)',
                  fontSize: '1rem',
                  lineHeight: '1.8',
                }}
              >
                At Scissor King Dimma Academy, we combine traditional craftsmanship with modern techniques to deliver
                exceptional results. Whether you're looking for a fresh haircut, bridal makeup, or professional tattoo
                training, our experienced team is here to make you look and feel your best.
              </p>
            </div>

            {/* Ornamental divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--gold-dark))' }} />
              <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>✦</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, var(--gold-dark))' }} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(({ icon: Icon, value, label, color }, i) => (
                <div
                  key={i}
                  className="text-center p-5 rounded-2xl transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(212,165,32,0.35)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(212,165,32,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--border)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.3)';
                  }}
                >
                  <Icon className="w-7 h-7 mx-auto mb-3" style={{ color }} />
                  <p
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--foreground)',
                      fontSize: '1.6rem',
                      lineHeight: '1',
                    }}
                  >
                    {value}
                  </p>
                  <p
                    className="mt-1.5"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--muted-foreground)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
