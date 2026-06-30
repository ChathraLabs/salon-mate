import { X } from 'lucide-react';
import { useEffect } from 'react';
import logoImage from '../../imports/image-1.png';
import { is_visible_cilent_review } from '../config/visibility';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Book Appointment', href: '#booking' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  ...(is_visible_cilent_review ? [{ label: 'Reviews', href: '#reviews' }] : []),
  { label: 'About Us', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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

  const handleLinkClick = () => onClose();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 lg:hidden"
        style={{ background: 'rgba(6,4,2,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 lg:hidden flex flex-col"
        style={{ background: 'var(--card)', borderLeft: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <img src={logoImage.src} alt="Scissor King Dimma" className="h-12 w-auto object-contain" />
          <button
            onClick={onClose}
            className="p-2 transition-colors"
            style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-6 py-8">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--foreground)',
                  fontSize: '1rem',
                  padding: '0.875rem 0.5rem',
                  borderBottom: '1px solid var(--border)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Bottom info */}
        <div
          className="px-6 py-5"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
            Scissor King Dimma Academy
          </p>
          <a
            href="tel:+94715729660"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            071 57 29 660
          </a>
        </div>
      </div>
    </>
  );
}
