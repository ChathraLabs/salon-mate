# Booking Page Reference Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the public booking page to match the attached cream/emerald appointment-app reference while preserving the current booking behavior.

**Architecture:** Add a tiny booking presentation helper module for deterministic date-chip and step-state formatting, then use those helpers in `Booking.tsx` while restyling the existing markup. Keep booking state, validation, API calls, and submit payloads unchanged; place responsive visual rules in `theme.css`.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS v4, `lucide-react`, Node test runner with `tsx`, existing CSS custom properties in `src/styles/theme.css`.

## Global Constraints

- Do not change booking API endpoints, request payloads, database schema, availability rules, or admin pages.
- Do not redesign the full public site in this task.
- Do not replace the current step flow with a one-page checkout.
- Reuse current service images, service options, staff avatars, availability data, pricing, duration, and confirmation logic.
- Mobile date chips use the availability `dates` array as the primary mobile date control.
- On screens at least `1024px` wide, show a live booking summary card beside the active step once a service is selected.
- Existing unrelated workspace changes must not be reverted.

---

## File Structure

- Create `src/app/components/bookingPresentation.ts`: pure helpers for date chip labels and step state.
- Create `src/app/components/bookingPresentation.test.ts`: focused tests for the new helper API.
- Modify `src/app/components/Booking.tsx`: reference-led visual structure, helper usage, selected service card, date strip, stylist tiles, live desktop summary, restyled confirmation.
- Modify `src/styles/theme.css`: booking-specific responsive CSS classes, mobile spacing, horizontal strips, desktop booking shell.

---

### Task 1: Booking Presentation Helpers

**Files:**
- Create: `src/app/components/bookingPresentation.test.ts`
- Create: `src/app/components/bookingPresentation.ts`

**Interfaces:**
- Produces: `getBookingStepState(stepNumber: number, currentStep: number): 'completed' | 'active' | 'upcoming'`
- Produces: `getDateChipParts(date: string, fallbackLabel?: string): { weekday: string; day: string; month: string; fullLabel: string }`

- [ ] **Step 1: Write the failing test**

```ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getBookingStepState, getDateChipParts } from './bookingPresentation';

describe('booking presentation helpers', () => {
  it('formats availability dates for compact booking chips', () => {
    assert.deepEqual(getDateChipParts('2025-05-31'), {
      weekday: 'Sat',
      day: '31',
      month: 'May',
      fullLabel: 'Sat, May 31, 2025',
    });
  });

  it('falls back to the availability label for invalid date strings', () => {
    assert.deepEqual(getDateChipParts('not-a-date', 'Today'), {
      weekday: 'Today',
      day: '',
      month: '',
      fullLabel: 'Today',
    });
  });

  it('classifies booking steps against the current step', () => {
    assert.equal(getBookingStepState(1, 2), 'completed');
    assert.equal(getBookingStepState(2, 2), 'active');
    assert.equal(getBookingStepState(3, 2), 'upcoming');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/app/components/bookingPresentation.test.ts`

Expected: FAIL because `./bookingPresentation` does not exist.

- [ ] **Step 3: Implement the helpers**

```ts
export type BookingStepState = 'completed' | 'active' | 'upcoming';

export function getBookingStepState(stepNumber: number, currentStep: number): BookingStepState {
  if (stepNumber < currentStep) return 'completed';
  if (stepNumber === currentStep) return 'active';
  return 'upcoming';
}

export function getDateChipParts(date: string, fallbackLabel = date) {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return {
      weekday: fallbackLabel,
      day: '',
      month: '',
      fullLabel: fallbackLabel,
    };
  }

  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(parsed);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(parsed);
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(parsed);
  const fullLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);

  return { weekday, day, month, fullLabel };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/app/components/bookingPresentation.test.ts`

Expected: PASS.

---

### Task 2: Booking Component Restyle

**Files:**
- Modify: `src/app/components/Booking.tsx`

**Interfaces:**
- Consumes: `getBookingStepState`, `getDateChipParts`
- Preserves: existing `Booking` props, state fields, API requests, step validation, submit payload, and confirmation behavior.

- [ ] **Step 1: Import helper functions and additional icons**

Update imports so `Booking.tsx` can render reference-style cards:

```ts
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getBookingStepState, getDateChipParts } from './bookingPresentation';
```

- [ ] **Step 2: Add derived summary helpers**

Add derived labels near existing memo values:

```ts
const selectedDateChip = selectedDateOption ? getDateChipParts(selectedDateOption.date, selectedDateOption.label) : null;
const selectedServiceImage = selectedService ? getSalonService(selectedService.id)?.image : null;
const selectedOptionCountLabel = selectedOptions.length === 1 ? '1 Service' : `${selectedOptions.length} Services`;
```

- [ ] **Step 3: Restyle the section header and progress**

Replace the current booking header and progress classes with app-like classes:

```tsx
<div className="booking-app-header">
  <p className="booking-app-eyebrow">Easy Booking</p>
  <h2>Book Appointment <Sparkles aria-hidden="true" /></h2>
  <p>Choose your service, date and time.</p>
  {loadError && <p className="booking-notice">{loadError}</p>}
</div>
```

Use `getBookingStepState(s, step)` for completed/active/upcoming class names.

- [ ] **Step 4: Restyle step content while preserving handlers**

Keep the existing `selectService`, `handleOptionToggle`, `setSelectedDate`, `setSelectedTime`, `setSelectedStaffId`, `setCustomerDetails`, `handleNext`, `handleBack`, and `handleConfirmBooking` calls. Change only the markup/classes/styles around them:

- Service choices use `.booking-service-card`.
- Selected service uses `.booking-selected-service`.
- Options use `.booking-option-row`.
- Date choices use `.booking-date-strip` and `.booking-date-chip`.
- Time choices use `.booking-time-strip` and `.booking-time-chip`.
- Staff choices use `.booking-stylist-strip` and `.booking-stylist-card`.
- Details use `.booking-details-card`.
- Confirm rows use `.booking-summary-card`.

- [ ] **Step 5: Add desktop live summary**

When `selectedService` exists, render an aside with class `.booking-live-summary` beside the active step on large screens. It must show service, date, time, stylist, duration, and total amount using existing derived values.

- [ ] **Step 6: Preserve confirmation behavior with new visual treatment**

Keep `isConfirmed` branch and `handleNewBooking`, but restyle confirmation as a centered app card with booking code, appointment rows, pending status, and call/book-another actions.

---

### Task 3: Booking CSS

**Files:**
- Modify: `src/styles/theme.css`

**Interfaces:**
- Consumes classes introduced in Task 2.
- Produces mobile and desktop layout behavior without changing global admin styles.

- [ ] **Step 1: Add booking app classes**

Add booking classes under `@layer components`:

```css
.booking-app-shell { background, section spacing, and cream page treatment }
.booking-app-header { title, subtitle, sparkle icon, and notice spacing }
.booking-app-stepper { four-step progress row, connectors, and state dots }
.booking-app-card { rounded ivory card, warm border, and soft shadow }
.booking-selected-service { image-led selected service summary card }
.booking-date-strip,
.booking-time-strip,
.booking-stylist-strip { horizontal scrolling strip behavior }
.booking-date-chip,
.booking-time-chip,
.booking-stylist-card { selectable chip/card state styles }
.booking-summary-card,
.booking-live-summary,
.booking-details-card { summary/details card surfaces and row spacing }
```

- [ ] **Step 2: Add mobile constraints**

Under the existing `@media (max-width: 767px)`, ensure:

- booking section starts below the fixed header,
- horizontal strips scroll without visible scrollbars,
- CTA spacing clears the fixed bottom navigation,
- text in chips/cards wraps or truncates cleanly.

- [ ] **Step 3: Add desktop layout**

At `min-width: 1024px`, use a two-column `.booking-content-grid` with a sticky-ish summary card only inside the booking section.

---

### Task 4: Verification

**Files:**
- Verify changed files only, then full project checks.

- [ ] **Step 1: Run focused test**

Run: `npm test -- src/app/components/bookingPresentation.test.ts`

Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Manual browser check**

Start the app with `npm run dev`, open the local URL, and inspect:

- mobile booking tab,
- desktop booking section,
- service selection,
- date/time/stylist selection,
- details and confirm steps,
- confirmation screen,
- bottom navigation overlap.
