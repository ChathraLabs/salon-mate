import { Award, Users, Briefcase } from 'lucide-react';
import { is_visible_cilent_review } from '../config/visibility';

const stats = [
  { icon: Award, value: '5+', label: 'Years Experience', color: 'var(--gold-dark)' },
  { icon: Users, value: '1,000+', label: 'Happy Customers', color: 'var(--emerald)' },
  { icon: Briefcase, value: '20+', label: 'Services Offered', color: 'var(--gold)' },
];

export function About() {
  return (
    <section
      id="about"
      className="salon-about py-20 sm:py-24 relative overflow-hidden"
      style={{ background: is_visible_cilent_review ? 'var(--section-dark-green)' : 'var(--background)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(138,95,34,0.18), transparent)' }}
      />

      <div className="salon-section-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="salon-about__grid grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="salon-about__media relative order-2 lg:order-1">
            <div
              className="absolute -inset-3 rounded-[2rem] pointer-events-none"
              style={{ border: '1px solid rgba(189,135,48,0.2)' }}
            />
            <div
              className="salon-about__image relative h-[24rem] sm:h-[34rem] rounded-[1.75rem] overflow-hidden"
              style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
            >
              <img
                src="/unsplash.com/about-us.png"
                alt="Scissor King Dimma salon interior"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 p-5"
                style={{ background: 'linear-gradient(to top, rgba(16,33,29,0.62), transparent)' }}
              >
                <div
                  className="inline-flex rounded-full px-4 py-2"
                  style={{
                    background: 'rgba(255,250,244,0.92)',
                    color: 'var(--emerald)',
                    border: '1px solid rgba(255,250,244,0.64)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  Comfort, hygiene, and personalized care
                </div>
              </div>
            </div>
          </div>

          <div className="salon-about__content space-y-8 order-1 lg:order-2">
            <div className="space-y-5">
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--gold-dark)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Our Story
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--emerald)',
                  fontSize: 'clamp(2.2rem, 8vw, 3.25rem)',
                  lineHeight: '1.08',
                }}
              >
                About <em style={{ color: 'var(--gold-dark)' }}>Us</em>
              </h2>
              <div
                className="rounded-2xl p-5 sm:p-6 space-y-4"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}
              >
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
            </div>

            <div className="salon-about__stats grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {stats.map(({ icon: Icon, value, label, color }, i) => (
                <div
                  key={i}
                  className="salon-about__stat p-5 rounded-2xl transition-transform hover:-translate-y-0.5"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <Icon className="w-7 h-7 mb-4" style={{ color }} />
                  <p
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--emerald)',
                      fontSize: '1.75rem',
                      lineHeight: '1',
                    }}
                  >
                    {value}
                  </p>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--muted-foreground)',
                      fontSize: '0.78rem',
                      lineHeight: '1.4',
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
