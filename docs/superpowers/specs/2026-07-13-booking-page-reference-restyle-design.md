# Booking Page Reference Restyle Design

## Overview

Restyle the public booking page to closely match the attached mobile appointment reference while preserving the current booking flow, data loading, validation, API calls, and confirmation behavior.

This is a visual and interaction-layout refresh of the existing `Booking` component, not a backend or business-logic change. The goal is to make the booking experience feel like a polished salon app on mobile and an intentionally designed booking surface on desktop.

## Goals

- Make the booking page visually resemble the attached reference: cream background, deep emerald selection states, antique gold accents, rounded cards, soft shadows, large serif heading, horizontal date/time controls, avatar stylist selection, and strong summary CTA.
- Preserve the existing 4-step flow: Service, Date & Time, Details, Confirm.
- Reuse current service images, service options, staff avatars, availability data, pricing, duration, and confirmation logic.
- Improve mobile scanning and spacing so the booking CTA is not covered by the bottom navigation.
- Keep desktop useful and premium rather than stretching the mobile layout.

## Non-Goals

- Do not change booking API endpoints, request payloads, database schema, availability rules, or admin pages.
- Do not redesign the full public site in this task.
- Do not replace the current step flow with a one-page checkout.
- Do not add accounts, notifications, favorites, payments, or any other reference-only features.

## Current Project Context

Relevant files:

- `src/app/components/Booking.tsx`
- `src/styles/theme.css`
- `src/app/config/services.ts`
- `src/types/booking.ts`
- `src/app/App.tsx`
- `src/app/components/MobileBottomNavigation.tsx`

The booking component currently owns service selection, option toggles, date/time selection, staff selection, customer details, confirmation, loading states, fallback preview slots, and submit errors. The component uses a mix of inline styles and supporting responsive CSS in `theme.css`.

There are existing uncommitted changes in public UI files. The implementation should avoid unrelated edits and should only touch those files when needed for the booking restyle.

## Visual Direction

Use the reference as the visual target:

- Background: warm cream.
- Main cards: ivory or soft white with warm beige borders.
- Primary action and selected states: deep emerald.
- Accent details: antique gold for small icons, sparkle/detail marks, dividers, and metadata.
- Prices and errors: readable warm red only where the current design already benefits from emphasis.
- Typography: large elegant serif for `Book Appointment`; clean sans-serif for labels, metadata, chips, inputs, and controls.
- Shape: rounded cards and pill/chip controls with soft shadows.

Avoid heavy dark panels, black/gold luxury styling, and dense generic form layouts inside the booking screen.

## Mobile Design

The mobile booking screen should feel like the attached appointment app:

1. Header area
   - Keep the existing app header above the booking tab.
   - Inside the booking section, show a large serif `Book Appointment` title and a short subtitle such as `Choose your service, date and time.`
   - Use spacing that starts comfortably below the fixed header.

2. Stepper
   - Keep four steps: Service, Date & Time, Details, Confirm.
   - Completed steps use an emerald filled circle with a check icon.
   - Active step uses an emerald filled circle with the step number.
   - Inactive steps use cream circles with warm borders.
   - Labels remain visible on mobile when space allows and must not overflow.

3. Service step
   - Service choices appear as reference-style cards using the service image, name, short description, duration, and price.
   - Selected service displays as a compact selected-service card with image, name, selected option count, total duration, and total price.
   - Service options remain checkboxes/toggles, but styled as premium rows or chips with clear selected state.

4. Date and time step
   - Prefer a horizontal date strip over the current large calendar-first feel on mobile.
   - Each date chip shows weekday and day number; selected date is emerald.
   - Use the availability `dates` array as the primary mobile date control. Do not show the full calendar on mobile unless the existing availability data is missing.
   - Time slots use horizontal or wrapped pill chips like the reference.
   - Disabled/booked slots remain visible but subdued and labelled.

5. Stylist selection
   - Staff members appear as circular avatar choices with names below.
   - Selected stylist gets an emerald ring and check mark.
   - If no staff data is available, the UI should still proceed using the current fallback behavior.

6. Customer details
   - Inputs sit inside a soft card with consistent spacing, rounded borders, and visible focus states.
   - Required name and phone remain clear.
   - Optional email and note remain available.

7. Summary and CTA
   - Summary uses a soft card similar to the reference with service, date, time, stylist, total amount, and safety/status note.
   - Primary action is a wide emerald rounded button.
   - Mobile spacing must account for the fixed bottom navigation and safe-area inset.

## Desktop Design

Desktop should share the same appointment-card language without becoming a phone mockup:

- Use a wider centered layout.
- Header and stepper sit across the top.
- The active step content can occupy the main column.
- On screens at least `1024px` wide, show a live booking summary card beside the active step once a service is selected.
- Cards, chips, staff avatars, and CTA styling should match the mobile visual system.
- Desktop service and time options should use responsive grids for easier scanning.

## Behavior and Data Flow

No behavior changes are required.

- `Booking` continues to fetch `/api/services` and `/api/availability`.
- Duration-specific availability reload remains unchanged.
- Service option toggling still recalculates price and duration.
- Staff selection still clears an incompatible selected time.
- Step validation remains:
  - Step 1 requires service and at least one selected option.
  - Step 2 requires date, time, and staff where staff exists.
  - Step 3 requires name and phone.
  - Step 4 submits the booking.
- Confirmation keeps showing booking code, appointment details, status, and contact guidance.

## Error, Empty, and Loading States

- Load errors remain visible as compact warm notice text/cards.
- Submit errors remain visible near the confirm action.
- Fallback preview mode remains clear and disables live submission as it does today.
- Loading availability after option changes should not create layout jumps.
- Empty availability should explain that the user should choose another date or stylist.

## Accessibility

- Preserve button semantics and labels.
- Ensure visible focus styles on cream backgrounds.
- Do not rely on color alone for selected/progress states; use shape, check icons, labels, or borders.
- Date, time, service, and stylist controls must have clear accessible names.
- Text must not overflow chips, cards, bottom navigation, or CTA buttons on common mobile widths.

## Implementation Boundaries

Expected files:

- `src/app/components/Booking.tsx`
- `src/styles/theme.css`

Supporting files may be edited only for these narrow reasons:

- `src/app/config/services.ts` for existing image/metadata use only.
- `src/app/components/MobileBottomNavigation.tsx` only if booking CTA spacing reveals a nav overlap issue.

Avoid touching unrelated public sections, admin pages, API routes, Prisma schema, or server services.

## Testing and Verification

Run:

- `npm test`
- `npm run build`

Manual checks:

- Mobile booking tab at common phone widths.
- Desktop booking section.
- Service selection and option toggling.
- Date strip/date selection, time selection, and staff selection.
- Customer details validation.
- Confirmation submission path where backend is available.
- Fallback preview/offline state.
- Bottom navigation overlap and safe-area spacing.

## Risks and Mitigations

- Risk: Styling changes accidentally alter booking behavior.
  - Mitigation: keep state handlers and API payloads intact; restyle markup around existing data.
- Risk: The booking component becomes too large.
  - Mitigation: extract small render helpers only when they reduce local complexity without creating broad abstractions.
- Risk: Mobile date chips hide too much date context.
  - Mitigation: use availability data labels and keep the selected full date visible in the summary.
- Risk: Existing uncommitted public UI changes conflict with the restyle.
  - Mitigation: inspect diffs before implementation and limit edits to booking-specific needs.
