import { X } from 'lucide-react';
import { useEffect } from 'react';
import logoImage from '../../imports/image-1.png';
import { is_visible_cilent_review } from '../config/visibility';
import type { MobileSection } from '../types/mobileNavigation';

interface MobileMenuProps {
  isOpen: boolean;
  activeSection: MobileSection;
  onNavigate: (section: MobileSection) => void;
  onClose: () => void;
}

const navLinks: Array<{ label: string; section: MobileSection }> = [
  { label: 'Home', section: 'home' },
  { label: 'Book Appointment', section: 'booking' },
  { label: 'Services', section: 'services' },
  { label: 'Gallery', section: 'gallery' },
  ...(is_visible_cilent_review
    ? ([{ label: 'Reviews', section: 'reviews' }] satisfies Array<{ label: string; section: MobileSection }>)
    : []),
  { label: 'About Us', section: 'about' },
  { label: 'Contact Us', section: 'contact' },
];

export function MobileMenu({ isOpen, activeSection, onNavigate, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 lg:hidden"
        style={{ background: 'rgba(16,33,29,0.28)', backdropFilter: 'blur(5px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="mobile-menu-panel fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 lg:hidden flex flex-col"
        style={{
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-16px 0 36px rgba(32,22,12,0.16)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between gap-4 px-6 py-5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoImage.src} alt="Scissor King Dimma" className="h-12 w-12 rounded-full object-contain shadow-sm" />
            <div className="min-w-0">
              <p
                className="truncate"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--foreground)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                Scissor King Dimma
              </p>
              <p
                className="truncate"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.78rem',
                }}
              >
                Salon & Academy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors"
            style={{
              color: 'var(--emerald)',
              background: 'var(--surface-strong)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-soft)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--emerald-dark)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--emerald)')}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="mobile-menu-panel__nav flex-1 px-6 py-8">
          <div className="flex flex-col gap-1">
            <a href="/admin" onClick={onClose} className="mobile-menu-panel__dashboard-link">
              Dashboard
            </a>
            {navLinks.map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={() => onNavigate(item.section)}
                aria-current={activeSection === item.section ? 'page' : undefined}
                style={{
                  fontFamily: 'var(--font-body)',
                  color: activeSection === item.section ? 'var(--emerald)' : 'var(--foreground)',
                  fontSize: '1rem',
                  padding: '0.95rem 1rem',
                  borderRadius: '0.9rem',
                  borderBottom: 'none',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderLeft: 'none',
                  background: activeSection === item.section ? 'var(--emerald-soft)' : 'transparent',
                  transition: 'color 0.2s, background 0.2s',
                  letterSpacing: '0.01em',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--emerald)';
                  e.currentTarget.style.background = activeSection === item.section ? 'var(--emerald-soft)' : 'rgba(227,239,233,0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = activeSection === item.section ? 'var(--emerald)' : 'var(--foreground)';
                  e.currentTarget.style.background = activeSection === item.section ? 'var(--emerald-soft)' : 'transparent';
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom info */}
        <div
          className="px-6 py-5"
          style={{ borderTop: '1px solid var(--border)', background: 'rgba(255,250,244,0.72)' }}
        >
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
            Scissor King Dimma Academy
          </p>
          <a
            href="tel:+94715729660"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--emerald)', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}
          >
            071 57 29 660
          </a>
        </div>
      </div>
    </>
  );
}
