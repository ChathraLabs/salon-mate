import { CalendarCheck, Home, Images, MoreHorizontal, Scissors } from 'lucide-react';
import type { MobileSection } from '../types/mobileNavigation';

interface MobileBottomNavigationProps {
  activeSection: MobileSection;
  onNavigate: (section: MobileSection) => void;
  onMoreClick: () => void;
}

const primaryItems = [
  { label: 'Home', section: 'home', icon: Home },
  { label: 'Services', section: 'services', icon: Scissors },
  { label: 'Book', section: 'booking', icon: CalendarCheck },
  { label: 'Gallery', section: 'gallery', icon: Images },
] satisfies Array<{
  label: string;
  section: MobileSection;
  icon: typeof Home;
}>;

const moreSections: MobileSection[] = [
  'reviews',
  'about',
  'contact',
];

export function MobileBottomNavigation({ activeSection, onNavigate, onMoreClick }: MobileBottomNavigationProps) {
  return (
    <nav className="mobile-bottom-nav lg:hidden" aria-label="Primary mobile navigation">
      {primaryItems.map(({ label, section, icon: Icon }) => {
        const isActive = activeSection === section;

        return (
          <button
            key={section}
            type="button"
            className="mobile-bottom-nav__item"
            onClick={() => onNavigate(section)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="mobile-bottom-nav__icon" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
      <button
        type="button"
        className="mobile-bottom-nav__item"
        onClick={onMoreClick}
        aria-current={moreSections.includes(activeSection) ? 'page' : undefined}
        aria-label="Open more navigation"
      >
        <MoreHorizontal className="mobile-bottom-nav__icon" aria-hidden="true" />
        <span>More</span>
      </button>
    </nav>
  );
}
