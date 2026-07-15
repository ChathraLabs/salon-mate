import { useState, useEffect } from 'react';
import { Bell, Phone, UserRound } from 'lucide-react';
import logoImage from '../../imports/image-1.png';
import { is_visible_cilent_review } from '../config/visibility';

interface HeaderProps {
  onMenuClick: () => void;
}

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  ...(is_visible_cilent_review ? [{ label: 'Reviews', href: '#reviews' }] : []),
  { label: 'About Us', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
];

export function Header({ onMenuClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className="salon-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s',
        background: isScrolled ? 'rgba(255,250,244,0.94)' : 'rgba(251,244,234,0.9)',
        borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: 'blur(14px)',
        boxShadow: isScrolled ? 'var(--shadow-soft)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="salon-header__inner flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <div className="flex flex-1 items-center gap-3 min-w-0 lg:flex-none">
            <img
              src={logoImage.src}
              alt="Scissor King Dimma"
              className="h-12 w-12 rounded-full object-contain shadow-sm sm:h-14 sm:w-14 lg:h-16 lg:w-auto lg:rounded-none lg:shadow-none"
            />
            <div className="min-w-0 lg:hidden">
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
                Your style. Our passion.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative group transition-colors"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--emerald)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
              >
                {item.label}
                <span
                  className="absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: 'var(--emerald)' }}
                />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <a
              href="#booking"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'var(--emerald)',
                color: 'var(--primary-foreground)',
                padding: '0.7rem 1.5rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                transition: 'all 0.3s',
                boxShadow: 'var(--shadow-button)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--emerald-dark)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(6,68,55,0.24)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--emerald)';
                e.currentTarget.style.boxShadow = 'var(--shadow-button)';
              }}
            >
              Book Appointment
            </a>
          </div>

          <div className="lg:hidden flex shrink-0 items-center gap-1.5 sm:gap-2">
            <a
              href="tel:+94715729660"
              aria-label="Call salon"
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{
                background: 'var(--surface-strong)',
                color: 'var(--gold-dark)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-soft)',
              }}
            >
              <Phone size={18} />
            </a>
            <button
              type="button"
              aria-label="Notifications"
              className="relative h-10 w-10 rounded-full flex items-center justify-center"
              style={{
                background: 'var(--surface-strong)',
                color: 'var(--gold-dark)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-soft)',
                cursor: 'pointer',
              }}
            >
              <Bell size={18} />
              <span
                aria-hidden="true"
                className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full"
                style={{ background: 'var(--destructive)', border: '2px solid var(--surface-strong)' }}
              />
            </button>
            <button
              onClick={onMenuClick}
              className="h-10 w-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                color: 'var(--emerald)',
                background: 'var(--surface-strong)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-soft)',
                cursor: 'pointer',
              }}
              aria-label="Open profile menu"
            >
              <UserRound size={19} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
