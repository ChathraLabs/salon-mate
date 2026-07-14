import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation, CalendarDays, ChevronRight, Facebook, Instagram, Youtube } from 'lucide-react';
import logoImage from '../../imports/image-1.png';
import { is_visible_cilent_review } from '../config/visibility';

const contactItems = [
  {
    key: 'address',
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
    key: 'phone',
    icon: Phone,
    title: 'Phone',
    content: (
      <a href="tel:+94715729660" style={{ color: 'var(--emerald)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>
        071 57 29 660
      </a>
    ),
  },
  {
    key: 'whatsapp',
    icon: MessageCircle,
    title: 'WhatsApp',
    content: (
      <a href="https://wa.me/94715729660" style={{ color: 'var(--emerald)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>
        071 57 29 660
      </a>
    ),
  },
  {
    key: 'email',
    icon: Mail,
    title: 'Email',
    content: (
      <a href="mailto:srinathdimuthu@gmail.com" style={{ color: 'var(--emerald)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}>
        srinathdimuthu@gmail.com
      </a>
    ),
  },
  {
    key: 'hours',
    icon: Clock,
    title: 'Opening Hours',
    content: (
      <>
        Monday - Sunday: 8:00 AM - 10:00 PM<br />
        Poya Day: Closed
      </>
    ),
  },
];

const quickLinks = [
  { icon: Phone, label: 'Call Now', mobileLabel: 'Call Us', href: 'tel:+94715729660' },
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/94715729660' },
  { icon: Navigation, label: 'Directions', href: 'https://maps.google.com/?q=No%2029%20Salon%20Scissor%20Bus%20Stand%20Urubokka', external: true },
];

const socialLinks = [
  { href: 'https://www.instagram.com/scissorkingdimma?igsh=MXJ5OXM3NnJxNnoybA==', Icon: Instagram, label: 'Instagram', color: '#e1306c' },
  { href: 'https://www.facebook.com/DimmaGroup', Icon: Facebook, label: 'Facebook', color: '#1877f2' },
  { href: 'https://www.youtube.com/@scissorkingdimma', Icon: Youtube, label: 'YouTube', color: '#ff0000' },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="salon-contact py-20 sm:py-24 relative overflow-hidden"
      style={{ background: is_visible_cilent_review ? 'var(--background)' : 'var(--section-dark-green)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(138,95,34,0.18), transparent)' }}
      />

      <div className="salon-section-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="salon-contact__header salon-section-header text-center mb-10 sm:mb-14 space-y-4">
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
            Get In Touch
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--emerald)', fontSize: 'clamp(2.2rem, 8vw, 3.25rem)', lineHeight: '1.05' }}>
            Contact Us <span className="salon-contact__title-spark" aria-hidden="true">✦</span>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '1rem', lineHeight: '1.7' }}>
            <span className="salon-contact__desktop-copy">Get in touch with us for appointments or inquiries.</span>
            <span className="salon-contact__mobile-copy">We're here to help! Reach out to us anytime.</span>
          </p>
        </div>

        <div className="salon-contact__grid grid lg:grid-cols-[0.92fr_1.08fr] gap-6 lg:gap-12">
          <div className="salon-contact__content space-y-5">
            <div
              className="salon-contact__panel p-5 sm:p-8 rounded-2xl space-y-6"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {contactItems.map(({ key, icon: Icon, title, content }) => (
                <div key={key} className={`salon-contact__item salon-contact__item--${key} flex items-start gap-4`}>
                  <div
                    className="salon-contact__item-icon p-2.5 rounded-xl flex-shrink-0"
                    style={{
                      background: 'var(--emerald-soft)',
                      border: '1px solid rgba(6,68,55,0.12)',
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--emerald)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--emerald)', fontSize: '1rem', marginBottom: '0.3rem' }}>
                      {title}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem', lineHeight: '1.65' }}>
                      {content}
                    </div>
                  </div>
                  <ChevronRight className="salon-contact__item-arrow" aria-hidden="true" />
                </div>
              ))}

              <a
                href="#booking"
                className="salon-contact__panel-cta inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-full transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'var(--emerald)',
                  color: 'var(--primary-foreground)',
                  borderRadius: '9999px',
                  boxShadow: 'var(--shadow-button)',
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                }}
              >
                <CalendarDays className="w-4 h-4" />
                Book Appointment
              </a>
            </div>

            <div className="salon-contact__quick-actions grid grid-cols-3 gap-3">
              {quickLinks.map(({ icon: Icon, label, mobileLabel, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="salon-contact__quick-action flex flex-col items-center gap-2.5 p-4 rounded-xl transition-transform hover:-translate-y-0.5"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div
                    className="salon-contact__quick-icon w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--emerald-soft)', border: '1px solid rgba(6,68,55,0.12)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--emerald)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.78rem', textAlign: 'center' }}>
                    <span className="salon-contact__desktop-label">{label}</span>
                    <span className="salon-contact__mobile-label">{mobileLabel ?? label}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div
            className="salon-contact__map rounded-2xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
              minHeight: '360px',
            }}
          >
            <iframe
              src="https://www.google.com/maps?q=No%2029%20Salon%20Scissor%20Bus%20Stand%20Urubokka&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', minHeight: '360px' }}
              allowFullScreen
              loading="lazy"
              title="Salon Location"
            />
            <div className="salon-contact__map-overlay" aria-hidden="true">
              <img src={logoImage.src} alt="" />
              <p>Scissor King Dimma</p>
              <span>We're right here!</span>
            </div>
          </div>
        </div>

        <div className="salon-contact__social" aria-label="Follow Scissor King Dimma">
          <div>
            <h3>Follow Us <span aria-hidden="true">✦</span></h3>
            <p>Stay connected for the latest updates & offers.</p>
          </div>
          <div className="salon-contact__social-links">
            {socialLinks.map(({ href, Icon, label, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon className="w-5 h-5" style={{ color }} />
              </a>
            ))}
          </div>
        </div>

        <a href="#booking" className="salon-contact__mobile-cta" style={{ textDecoration: 'none' }}>
          <CalendarDays className="w-5 h-5" aria-hidden="true" />
          <span>Book Appointment</span>
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
