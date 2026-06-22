import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import logoImage from '../../imports/428409218_895173022613361_2413261302491507174_n.jpg';

interface HeaderProps {
  onMenuClick: () => void;
}

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s',
        background: isScrolled
          ? 'var(--background)'
          : 'linear-gradient(to bottom, var(--background), rgba(12,9,8,0.92))',
        borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
        backdropFilter: 'blur(12px)',
        boxShadow: isScrolled ? '0 2px 24px rgba(212,165,32,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logoImage.src}
              alt="Scissor King Dimma"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {['Home', 'Services', 'Gallery', 'Reviews', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative group transition-colors"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
              >
                {item}
                {/* Gold underline on hover */}
                <span
                  className="absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: 'var(--gold)' }}
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
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%)',
                backgroundSize: '200% auto',
                color: 'var(--primary-foreground)',
                padding: '0.6rem 1.5rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '0.875rem',
                letterSpacing: '0.03em',
                transition: 'all 0.3s',
                boxShadow: '0 2px 16px rgba(212,165,32,0.25)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundPosition = 'right center';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 24px rgba(212,165,32,0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundPosition = 'left center';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 2px 16px rgba(212,165,32,0.25)';
              }}
            >
              Book Appointment
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 transition-colors"
            style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
