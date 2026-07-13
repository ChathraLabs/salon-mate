import { useEffect, useState } from 'react';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const queries = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
};

const serverSnapshot: ResponsiveState = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
};

function getResponsiveState(): ResponsiveState {
  if (typeof window === 'undefined') {
    return serverSnapshot;
  }

  return {
    isMobile: window.matchMedia(queries.mobile).matches,
    isTablet: window.matchMedia(queries.tablet).matches,
    isDesktop: window.matchMedia(queries.desktop).matches,
  };
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(serverSnapshot);

  useEffect(() => {
    const mobileQuery = window.matchMedia(queries.mobile);
    const tabletQuery = window.matchMedia(queries.tablet);
    const desktopQuery = window.matchMedia(queries.desktop);
    const updateState = () => setState(getResponsiveState());

    mobileQuery.addEventListener('change', updateState);
    tabletQuery.addEventListener('change', updateState);
    desktopQuery.addEventListener('change', updateState);
    updateState();

    return () => {
      mobileQuery.removeEventListener('change', updateState);
      tabletQuery.removeEventListener('change', updateState);
      desktopQuery.removeEventListener('change', updateState);
    };
  }, []);

  return state;
}
