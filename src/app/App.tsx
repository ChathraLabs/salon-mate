import { useEffect, useRef, useState } from 'react';
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
import { MobileBottomNavigation } from './components/MobileBottomNavigation';
import { is_visible_cilent_review } from './config/visibility';
import { useResponsive } from './hooks/useResponsive';
import type { MobileSection } from './types/mobileNavigation';

export default function App() {
  const { isMobile } = useResponsive();
  const mobileViewportRef = useRef<HTMLDivElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState<MobileSection>('home');
  const [requestedService, setRequestedService] = useState<{ id: string; key: number } | null>(null);
  const [isBookingFlowActive, setIsBookingFlowActive] = useState(false);

  useEffect(() => {
    if (!isMobile) return;
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    const shouldOpenBooking = section === 'booking' || window.location.hash === '#booking';

    if (shouldOpenBooking) {
      setActiveMobileSection('booking');
    }

    if (window.location.hash || section) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [isMobile]);

  useEffect(() => {
    if (activeMobileSection !== 'booking') {
      setIsBookingFlowActive(false);
    }
  }, [activeMobileSection]);

  const handleMobileNavigate = (section: MobileSection) => {
    setActiveMobileSection(section);
    setIsMobileMenuOpen(false);
    window.requestAnimationFrame(() => {
      mobileViewportRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  };

  const handleBookService = (id: string) => {
    setRequestedService({ id, key: Date.now() });
    if (isMobile) {
      handleMobileNavigate('booking');
    }
  };

  const renderMobileSection = () => {
    switch (activeMobileSection) {
      case 'services':
        return <Services onBookService={handleBookService} useStateNavigation />;
      case 'booking':
        return <Booking requestedService={requestedService} onFlowActiveChange={setIsBookingFlowActive} />;
      case 'gallery':
        return <Gallery />;
      case 'reviews':
        return is_visible_cilent_review ? <Reviews /> : <Hero />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'home':
      default:
        return (
          <Hero
            useStateNavigation
            onBookAppointment={() => handleMobileNavigate('booking')}
            onViewServices={() => handleMobileNavigate('services')}
            onViewAbout={() => handleMobileNavigate('about')}
            onContact={() => handleMobileNavigate('contact')}
            onBookService={handleBookService}
          />
        );
    }
  };

  return (
    <div className="salon-app min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        activeSection={activeMobileSection}
        onNavigate={handleMobileNavigate}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="salon-main">
        {isMobile ? (
          <div ref={mobileViewportRef} className="mobile-section-view" key={activeMobileSection}>
            {renderMobileSection()}
          </div>
        ) : (
          <>
            <Hero />
            <Booking requestedService={requestedService} />
            <Services onBookService={handleBookService} />
            <Gallery />
            {is_visible_cilent_review && <Reviews />}
            <About />
            <Contact />
          </>
        )}
      </main>

      {!isMobile && <Footer />}
      {!(activeMobileSection === 'booking' && isBookingFlowActive) && (
        <MobileBottomNavigation
          activeSection={activeMobileSection}
          onNavigate={handleMobileNavigate}
          onMoreClick={() => setIsMobileMenuOpen(true)}
        />
      )}
    </div>
  );
}
