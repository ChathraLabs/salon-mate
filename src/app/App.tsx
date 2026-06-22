import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { Gallery } from './components/Gallery';
import { Reviews } from './components/Reviews';
import { Booking } from './components/Booking';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { MobileMenu } from './components/MobileMenu';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main>
        <Hero />
        <Services />
        <About />
        <Gallery />
        <Reviews />
        <Booking />
        <Contact />
      </main>

      <Footer />

      {/* Sticky mobile CTA */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-40"
        style={{
          background: 'var(--surface-dark)',
          borderTop: '1px solid rgba(212,165,32,0.2)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <a
          href="#booking"
          style={{
            display: 'block',
            width: '100%',
            background: 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light))',
            color: 'var(--primary-foreground)',
            padding: '0.875rem 1.5rem',
            borderRadius: '9999px',
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            boxShadow: '0 4px 20px rgba(212,165,32,0.35)',
            fontSize: '0.9rem',
          }}
        >
          Book Appointment
        </a>
      </div>
    </div>
  );
}
