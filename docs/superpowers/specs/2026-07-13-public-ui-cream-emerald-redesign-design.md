# Public UI Cream/Emerald Redesign Design

## Overview

Redesign the public customer-facing Salon Mate UI into a mobile-first cream/emerald salon app theme inspired by the provided references. The redesign applies only to public screens and components. Admin pages remain unchanged.

The current application is a Next.js public salon site with mobile section navigation and working booking flows. The redesign should preserve public behavior, booking logic, API contracts, service data loading, and admin routes while changing the visual system and public screen composition.

## Goals

- Prioritize a polished mobile application experience.
- Support a full desktop web layout that feels intentionally designed, not stretched from mobile.
- Replace the current dark black/gold public theme with a warm cream, deep emerald, and antique gold visual system.
- Keep booking, service selection, staff/date/time loading, and public navigation behavior intact.
- Centralize repeated visual decisions in theme tokens and reusable public styling patterns where practical.

## Non-Goals

- Do not redesign admin pages.
- Do not change backend booking contracts, database schema, API endpoints, or service/staff business logic.
- Do not implement unrelated features from the reference screenshots.
- Do not preserve the current black/gold theme as the primary public identity.

## Current Project Context

Relevant public UI files:

- `src/styles/theme.css`
- `src/styles/index.css`
- `src/app/App.tsx`
- `src/app/components/Header.tsx`
- `src/app/components/Hero.tsx`
- `src/app/components/Services.tsx`
- `src/app/components/Booking.tsx`
- `src/app/components/Gallery.tsx`
- `src/app/components/About.tsx`
- `src/app/components/Contact.tsx`
- `src/app/components/Footer.tsx`
- `src/app/components/MobileMenu.tsx`
- `src/app/components/MobileBottomNavigation.tsx`

The public UI currently mixes global CSS variables with many component-level inline styles. Several inline styles assume the existing dark luxury palette. The redesign should replace those public-facing dark assumptions with the new public theme.

## Visual System

### Palette

Use a warm salon-app palette:

- Page background: soft cream/ivory.
- Primary action: deep emerald.
- Primary hover/pressed: darker emerald.
- Accent: antique gold for premium highlights, icons, dividers, badges, and decorative sparkle details.
- Card surface: ivory/soft white.
- Muted surface: warm cream.
- Text primary: near-black with a subtle green warmth.
- Text secondary: muted cool gray.
- Borders: warm beige/gold-tinted lines.
- Destructive/error: readable warm red that remains distinct from gold and emerald.

The new palette should live in `theme.css` as the source of truth for public styling.

### Typography

- Keep elegant serif headings for editorial section titles such as "Look Beautiful", "Services", "Book Appointment", "Gallery", "About Us", and "Contact Us".
- Use a clean sans-serif for navigation, body text, labels, form fields, prices, and metadata.
- Mobile titles should feel large and premium but must not overflow or collide with controls.
- Desktop titles should scale up without using viewport-width-only font sizing.

### Surfaces, Radius, and Shadows

- Cards use ivory/white surfaces, warm borders, soft shadows, and rounded corners.
- Buttons and chips use pill shapes where the control represents a tab, category, or action.
- Repeated list cards such as services should be dense enough for mobile scanning.
- Avoid dark overlays except subtle image label overlays where needed for readability.

### Icons and Decoration

- Use existing `lucide-react` icons where appropriate.
- Active icons and selected states use emerald.
- Gold is reserved for small accents, premium badges, dividers, and decorative sparkle marks.
- Decorative elements should be restrained and should not block content on mobile.

## Public Screen Design

### Mobile Header and Navigation

The mobile public experience should feel app-like:

- Compact top header with brand identity, salon name, subtitle where space allows, and quick action icons.
- White or ivory circular icon buttons with soft shadows.
- Bottom navigation becomes a floating white/ivory bar with emerald active icons and a short active underline.
- The "More" state should use the same cream/emerald visual language in `MobileMenu`.

### Home

Mobile home should be the highest polish screen:

- Editorial hero with large serif "Look Beautiful" style heading.
- Warm cream background and image-led salon/beauty visual.
- Clear emerald booking CTA.
- Optional compact service/offer cards if they can use existing data without changing behavior.
- Desktop adapts to a two-column editorial hero with image framing and strong CTA hierarchy.

### Services

Services should become easier to scan on mobile:

- Large serif title and short supporting copy.
- Category chips styled like the references where useful.
- Service rows/cards with image, title, description, duration, price, favorite/add/book action styling.
- Selected/primary actions use emerald; prices can use a warm red or strong accent only if readable.
- Desktop uses a responsive grid of soft cards, preserving service booking actions.

### Booking

Booking should keep existing functionality while adopting the new app style:

- Stepper uses emerald for completed/current steps and warm cream connectors.
- Service, date/time, stylist, details, and summary areas appear as soft cream cards.
- Selected dates, times, service options, and staff members use emerald active states.
- Errors and loading states remain readable on cream surfaces.
- Mobile should keep clear progression and avoid bottom navigation covering the final CTA.
- Desktop keeps the complete booking form usable with wider grids and clear summary areas.

### Gallery

Gallery should become more visual and warm:

- Serif title and category chips.
- Rounded image grid with subtle label overlays.
- Featured or larger image treatments are acceptable if they use the existing gallery content.
- Desktop may keep a masonry-style layout, but with softer cards and cream background.

### About

About should feel like a salon story screen:

- Large rounded salon image.
- Story cards for salon overview and promise.
- Stats row with emerald/gold icon circles.
- Optional strong CTA styled like the rest of the public UI.
- Desktop uses a balanced image/content layout.

### Contact

Contact should be action-oriented:

- Quick action buttons for call, WhatsApp/contact, and directions where existing links support them.
- Contact detail card with icon rows.
- Map card treatment with rounded frame.
- Social/follow row if existing content supports it.
- Prominent emerald appointment CTA.
- Desktop uses a wider layout while preserving quick action clarity.

### Footer

Desktop footer should no longer be a dark black/gold block. It should use the cream/emerald theme or a controlled deep emerald band if stronger contrast is useful. Mobile footer remains secondary to bottom navigation.

## Component Boundaries

The implementation should keep public components understandable and avoid turning one file into a large style dump:

- Put global theme tokens, base styles, responsive public utilities, and bottom navigation styling in `theme.css`.
- Keep component-specific layout in the component where it is tightly coupled to markup.
- Extract small helpers or repeated style objects only when they meaningfully reduce duplication.
- Avoid broad refactors outside the public UI files listed above.

## Data Flow and Behavior

No data flow changes are required.

- `App.tsx` continues to drive mobile section state.
- `Booking` continues to load services and availability from existing endpoints.
- `Services` continues to call `onBookService` and route mobile users to booking.
- Gallery, about, contact, header, footer, menu, and bottom navigation remain public presentation components.
- API fallbacks and error messages should remain visible and legible.

## Error Handling and Accessibility

- Existing booking load and submit errors must stay readable on the new surfaces.
- Focus states should be visible against cream backgrounds, using emerald or gold as appropriate.
- Buttons and links must retain accessible labels.
- Color should not be the only indicator for active navigation or booking progress; active underline, checkmark, or shape should also communicate state.
- Text must fit within cards, buttons, and bottom navigation labels on mobile.

## Testing and Verification

Run automated checks:

- `npm test`
- `npm run build`

Perform manual visual checks:

- Mobile home, services, booking, gallery, about, contact, and more/menu.
- Desktop full public page flow.
- Booking service selection, date/time selection, staff selection, customer details, confirmation, and error/loading states.
- Bottom navigation safe-area spacing and content overlap.
- Responsive behavior around common mobile and desktop widths.

## Risks and Mitigations

- Risk: Inline dark-theme styles may remain in public components.
  - Mitigation: inspect each public component and replace dark assumptions with theme-driven cream/emerald styling.
- Risk: Mobile redesign could break booking usability.
  - Mitigation: preserve state and event handlers, and verify the full booking path manually.
- Risk: Desktop could feel secondary.
  - Mitigation: adapt each section into a proper desktop layout after mobile styling is established.
- Risk: Public and admin styles could bleed into each other.
  - Mitigation: scope changes to public components and shared tokens carefully, then inspect admin pages only for accidental regressions if global tokens affect them.

## Implementation Sequence

The implementation plan should be written separately after this design is approved. A sensible order is:

1. Update public theme tokens and base responsive styles.
2. Restyle mobile header, menu, and bottom navigation.
3. Redesign public content sections: home, services, gallery, about, contact, footer.
4. Redesign booking visuals while preserving behavior.
5. Adapt desktop layouts.
6. Run automated and manual verification.
