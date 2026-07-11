import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import logoImage from '../../imports/image-1.png';
import { is_visible_cilent_review } from '../config/visibility';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Book Appointment', href: '#booking' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  ...(is_visible_cilent_review ? [{ label: 'Reviews', href: '#reviews' }] : []),
  { label: 'About Us', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 2c.4 3.2 2.2 5.1 5.4 5.3v3.6c-1.9.1-3.6-.4-5.2-1.5v6.7c0 4.3-2.8 6.9-6.8 6.9-3.8 0-6.6-2.5-6.6-6.1 0-3.9 3-6.5 7.4-6.2v3.8c-2-.3-3.5.6-3.5 2.3 0 1.4 1.1 2.3 2.6 2.3 1.8 0 2.9-1 2.9-3.2V2h3.8Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--surface-dark)', color: 'var(--surface-dark-foreground)', position: 'relative', overflow: 'hidden' }}>
      {/* Top gold accent line */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(to right, transparent, var(--gold-dark), var(--gold), var(--gold-light), var(--gold), var(--gold-dark), transparent)' }}
      />
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(212,165,32,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-5">
            <img
              src={logoImage.src}
              alt="Scissor King Dimma"
              className="h-20 w-auto object-contain"
            />
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'rgba(240,228,184,0.6)',
                fontSize: '0.875rem',
                lineHeight: '1.8',
                maxWidth: '28rem',
              }}
            >
              Sri Lanka's premier beauty salon and grooming academy — offering professional hair, bridal,
              beauty, and tattoo training services. Experience the art of transformation.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { href: 'https://www.facebook.com/DimmaGroup', Icon: Facebook, label: 'Facebook' },
                { href: 'https://www.instagram.com/scissorkingdimma?igsh=MXJ5OXM3NnJxNnoybA==', Icon: Instagram, label: 'Instagram' },
                { href: 'https://www.tiktok.com/@dimuthusrinathweerasinhe?_r=1&_t=ZS-97wDPxhyPUw', Icon: TikTokIcon, label: 'TikTok' },
                { href: 'https://www.youtube.com/@scissorkingdimma', Icon: Youtube, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(240,228,184,0.06)',
                    border: '1px solid rgba(212,165,32,0.2)',
                    color: 'rgba(240,228,184,0.7)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'linear-gradient(135deg, var(--gold-dark), var(--gold))';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gold)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary-foreground)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(212,165,32,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(240,228,184,0.06)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,165,32,0.2)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(240,228,184,0.7)';
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1rem', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: item.href === '#booking' ? 'var(--gold)' : 'rgba(240,228,184,0.55)',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = item.href === '#booking' ? 'var(--gold)' : 'rgba(240,228,184,0.55)')}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1rem', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold-dark)' }} />
                <span style={{ fontFamily: 'var(--font-body)', color: 'rgba(240,228,184,0.55)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                  No 29 Salon Scissor<br />Bus Stand, Urubokka
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold-dark)' }} />
                <a
                  href="tel:+94715729660"
                  style={{ fontFamily: 'var(--font-body)', color: 'rgba(240,228,184,0.55)', fontSize: '0.85rem', transition: 'color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,228,184,0.55)')}
                >
                  071 57 29 660
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--gold-dark)' }} />
                <a
                  href="mailto:srinathdimuthu@gmail.com"
                  style={{ fontFamily: 'var(--font-body)', color: 'rgba(240,228,184,0.55)', fontSize: '0.85rem', transition: 'color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,228,184,0.55)')}
                >
                  srinathdimuthu@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(212,165,32,0.12)' }}
        >
          <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(240,228,184,0.3)', fontSize: '0.78rem' }}>
            © 2026 Scissor King Dimma. All rights reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(212,165,32,0.4)', fontSize: '0.78rem' }}>
            Powered by SalonMate
          </p>
        </div>
      </div>
    </footer>
  );
}
