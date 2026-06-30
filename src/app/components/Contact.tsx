import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from 'lucide-react';
import { is_visible_cilent_review } from '../config/visibility';

const contactItems = [
  {
    icon: MapPin,
    title: 'Address',
    content: (
      <>
        Scissor King Dimma Academy<br />
        No 29 Salon Scissor<br />
        Bus Stand, Urubokka
      </>
    ),
  },
  {
    icon: Phone,
    title: 'Phone',
    content: (
      <a href="tel:+94715729660" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)', transition: 'color 0.2s', textDecoration: 'none' }}>
        071 57 29 660
      </a>
    ),
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: (
      <a href="https://wa.me/94715729660" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)', transition: 'color 0.2s', textDecoration: 'none' }}>
        071 57 29 660
      </a>
    ),
  },
  {
    icon: Mail,
    title: 'Email',
    content: (
      <a href="mailto:info@scissorkingdimma.lk" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)', transition: 'color 0.2s', textDecoration: 'none' }}>
        info@scissorkingdimma.lk
      </a>
    ),
  },
  {
    icon: Clock,
    title: 'Opening Hours',
    content: (
      <>
        Monday – Saturday: 9:00 AM – 7:00 PM<br />
        Sunday: Closed
      </>
    ),
  },
];

const quickLinks = [
  { icon: Phone, label: 'Call Now', href: 'tel:+94715729660' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/94715729660' },
  { icon: Navigation, label: 'Directions', href: 'https://maps.google.com/?q=No%2029%20Salon%20Scissor%20Bus%20Stand%20Urubokka', external: true },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      style={{ background: is_visible_cilent_review ? 'var(--background)' : 'var(--section-dark-green)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,32,0.3), transparent)' }}
      />
      <div
        className="absolute right-0 bottom-0 w-64 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,165,32,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            ✦ Get In Touch ✦
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            Contact Us
          </h2>
          <p className="max-w-xl mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '1rem', lineHeight: '1.7' }}>
            Get in touch with us for appointments or inquiries
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--gold-dark))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--gold-dark))' }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left – Contact Info */}
          <div className="space-y-5">
            <div
              className="p-8 rounded-2xl space-y-6"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 24px rgba(0,0,0,0.35)',
              }}
            >
              {contactItems.map(({ icon: Icon, title, content }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className="p-2.5 rounded-xl flex-shrink-0"
                    style={{
                      background: 'rgba(212,165,32,0.1)',
                      border: '1px solid rgba(212,165,32,0.2)',
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '0.975rem', marginBottom: '0.3rem' }}>
                      {title}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: '1.65' }}>
                      {content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-3 gap-3">
              {quickLinks.map(({ icon: Icon, label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,165,32,0.4)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(212,165,32,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(212,165,32,0.1)', border: '1px solid rgba(212,165,32,0.2)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.78rem' }}>
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right – Map */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid var(--border)',
              boxShadow: '0 2px 24px rgba(0,0,0,0.4)',
              minHeight: '480px',
            }}
          >
            <iframe
              src="https://www.google.com/maps?q=No%2029%20Salon%20Scissor%20Bus%20Stand%20Urubokka&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: '480px' }}
              allowFullScreen
              loading="lazy"
              title="Salon Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
