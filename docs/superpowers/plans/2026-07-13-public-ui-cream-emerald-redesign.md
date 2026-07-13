# Public UI Cream/Emerald Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the public customer-facing UI into a mobile-first cream/emerald salon app theme while preserving booking behavior and leaving admin pages unchanged.

**Architecture:** Establish the new public visual system in `src/styles/theme.css`, then apply it across public shell/navigation, content sections, and booking screens. Keep existing React state, API calls, and routing behavior intact; this is a visual and layout redesign, not a backend or booking-flow rewrite.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS v4, `lucide-react`, existing CSS custom properties in `src/styles/theme.css`.

## Global Constraints

- Apply changes only to the public customer-facing UI.
- Do not redesign admin pages.
- Prioritize a polished mobile application experience.
- Support a full desktop web layout that feels intentionally designed.
- Replace the current dark black/gold public theme with warm cream, deep emerald, and antique gold.
- Do not change backend booking contracts, database schema, API endpoints, or service/staff business logic.
- Preserve booking service selection, staff/date/time loading, customer details, confirmation, error, and fallback behavior.
- Avoid unrelated refactors outside the public UI files.
- Existing unrelated workspace changes must not be reverted.

---

## File Structure

Modify these files:

- `src/styles/theme.css`: public color tokens, base styles, mobile bottom navigation, shared responsive public styles.
- `src/app/App.tsx`: public app shell background and any public-only wrapper classes needed for the new theme.
- `src/app/components/Header.tsx`: mobile-first cream header, desktop header, quick actions, logo treatment.
- `src/app/components/MobileBottomNavigation.tsx`: keep behavior; rely on updated CSS for floating ivory nav and emerald active states.
- `src/app/components/MobileMenu.tsx`: cream/emerald menu panel, active states, contact footer.
- `src/app/components/Hero.tsx`: mobile-first editorial home screen and desktop hero.
- `src/app/components/Services.tsx`: service cards/rows, chips/header styling, CTA styling.
- `src/app/components/Gallery.tsx`: warm gallery header, chip-like filters if static, rounded image cards.
- `src/app/components/About.tsx`: salon story cards, stats, image treatment.
- `src/app/components/Contact.tsx`: quick action buttons, detail card, map card, booking CTA styling.
- `src/app/components/Footer.tsx`: desktop footer moved away from black/gold to cream/emerald or controlled emerald band.
- `src/app/components/Booking.tsx`: visual-only restyle of stepper, cards, selections, form fields, summaries, and confirmation state.

Do not modify admin pages except to fix an accidental global-style regression discovered during verification.

## Parallelization Notes

Task 1 must run first because later tasks depend on the new tokens and shared classes.

After Task 1 is complete, these work lanes are mostly independent and can be dispatched in parallel:

- Lane A: Task 2, public shell/navigation.
- Lane B: Task 3, home/services/gallery/about/contact/footer content sections.
- Lane C: Task 4, booking visual redesign.

Task 5 must run after the lanes are integrated because it verifies the combined UI.

Workers must not edit the same file at the same time. In particular, `src/styles/theme.css` and `src/app/components/Booking.tsx` should each have a single owner during implementation.

---

### Task 1: Establish Public Theme Tokens And Shared CSS

**Files:**
- Modify: `src/styles/theme.css`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: existing CSS variables and public wrapper classes.
- Produces: theme variables used by all public components:
  - `--background`
  - `--foreground`
  - `--card`
  - `--card-foreground`
  - `--primary`
  - `--primary-foreground`
  - `--secondary`
  - `--secondary-foreground`
  - `--muted`
  - `--muted-foreground`
  - `--accent`
  - `--accent-foreground`
  - `--gold`
  - `--gold-light`
  - `--gold-dark`
  - `--emerald`
  - `--emerald-dark`
  - `--cream`
  - `--surface`
  - `--surface-strong`
  - `--shadow-soft`
  - `--shadow-card`
  - `--shadow-button`

- [ ] **Step 1: Update root theme variables**

Replace the current dark palette in `src/styles/theme.css` with cream/emerald public tokens. Keep existing variable names so component imports keep working, and add readable aliases for new public styles.

Use this palette block as the target shape:

```css
:root {
  --font-size: 16px;
  --font-heading: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Inter', 'Lato', system-ui, sans-serif;

  --cream: #fbf4ea;
  --cream-warm: #f7eadb;
  --surface: #fffaf4;
  --surface-strong: #ffffff;
  --surface-soft: #f4e7d6;

  --emerald: #064437;
  --emerald-dark: #032f27;
  --emerald-soft: #e3efe9;

  --gold: #bd8730;
  --gold-light: #e6bd72;
  --gold-dark: #8a5f22;
  --gold-glow: rgba(189, 135, 48, 0.18);

  --background: var(--cream);
  --section-dark-green: #f6eadc;
  --foreground: #10211d;
  --card: var(--surface);
  --card-foreground: #10211d;
  --popover: var(--surface-strong);
  --popover-foreground: #10211d;
  --primary: var(--emerald);
  --primary-foreground: #fffaf4;
  --secondary: #f1dfc8;
  --secondary-foreground: var(--emerald);
  --muted: #f6eadc;
  --muted-foreground: #66706d;
  --accent: var(--gold);
  --accent-foreground: #10211d;
  --surface-dark: var(--emerald-dark);
  --surface-dark-foreground: #fffaf4;
  --destructive: #ef4d3d;
  --destructive-foreground: #ffffff;
  --border: rgba(138, 95, 34, 0.18);
  --input: transparent;
  --input-background: #fffaf4;
  --switch-background: #d8c5aa;
  --ring: var(--emerald);
  --shadow-soft: 0 10px 30px rgba(32, 22, 12, 0.08);
  --shadow-card: 0 8px 24px rgba(32, 22, 12, 0.1);
  --shadow-button: 0 8px 18px rgba(6, 68, 55, 0.18);
  --radius: 1rem;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --sidebar: var(--surface);
  --sidebar-foreground: #10211d;
  --sidebar-primary: var(--emerald);
  --sidebar-primary-foreground: #fffaf4;
  --sidebar-accent: #f1dfc8;
  --sidebar-accent-foreground: var(--emerald);
  --sidebar-border: rgba(138, 95, 34, 0.18);
  --sidebar-ring: var(--emerald);
}
```

- [ ] **Step 2: Extend `@theme inline` with new aliases**

Add the new aliases so Tailwind utility classes can reference them:

```css
  --color-emerald: var(--emerald);
  --color-emerald-dark: var(--emerald-dark);
  --color-cream: var(--cream);
  --color-surface: var(--surface);
  --color-surface-strong: var(--surface-strong);
```

Keep the existing `--color-gold`, `--color-background`, and shadcn-compatible mappings.

- [ ] **Step 3: Update base focus and body styles**

Change focus rings from gold-only to emerald-first:

```css
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--emerald);
  outline-offset: 3px;
}
```

Ensure `body` still uses:

```css
body {
  @apply bg-background text-foreground;
  font-family: var(--font-body);
}
```

- [ ] **Step 4: Restyle `.mobile-bottom-nav`**

Replace the existing dark bottom navigation CSS with this ivory floating bar pattern:

```css
.mobile-bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 45;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.125rem;
  padding: 0.5rem max(0.6rem, env(safe-area-inset-left)) calc(0.5rem + env(safe-area-inset-bottom)) max(0.6rem, env(safe-area-inset-right));
  background: rgba(255, 250, 244, 0.96);
  border-top: 1px solid rgba(138, 95, 34, 0.14);
  border-radius: 1.45rem 1.45rem 0 0;
  box-shadow: 0 -10px 30px rgba(32, 22, 12, 0.12);
  backdrop-filter: blur(16px);
}

.mobile-bottom-nav__item {
  min-width: 0;
  min-height: 3.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.22rem;
  border: 0;
  border-radius: 0.95rem;
  background: transparent;
  color: #5f6663;
  font-family: var(--font-body);
  font-size: 0.68rem;
  line-height: 1.1;
  text-decoration: none;
  cursor: pointer;
  position: relative;
}

.mobile-bottom-nav__item[aria-current='page'] {
  color: var(--emerald);
}

.mobile-bottom-nav__item[aria-current='page']::after {
  content: '';
  position: absolute;
  bottom: 0.24rem;
  width: 1.55rem;
  height: 0.18rem;
  border-radius: 9999px;
  background: var(--emerald);
}
```

- [ ] **Step 5: Update mobile responsive public spacing**

In the existing `@media (max-width: 767px)` block, keep safe-area padding and adjust section spacing for app screens:

```css
.salon-app {
  padding-bottom: calc(4rem + env(safe-area-inset-bottom));
}

.salon-app section {
  padding-top: 5rem;
  padding-bottom: 1.35rem;
}

.salon-section-inner,
.salon-booking__inner {
  padding-right: 1rem;
  padding-left: 1rem;
}
```

- [ ] **Step 6: Update `App.tsx` wrapper**

Keep behavior the same and set the root background through the theme:

```tsx
return (
  <div className="salon-app min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
    <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
    {/* existing content unchanged */}
  </div>
);
```

- [ ] **Step 7: Verify theme compiles**

Run:

```bash
npm run build
```

Expected: build completes without CSS variable or Tailwind class errors. If build fails because `prisma generate` needs environment configuration, record the exact error and continue with `npm test` after confirming the failure is unrelated to CSS.

- [ ] **Step 8: Commit**

```bash
git add src/styles/theme.css src/app/App.tsx
git commit -m "style: add cream emerald public theme tokens"
```

---

### Task 2: Restyle Public Shell And Mobile Navigation

**Files:**
- Modify: `src/app/components/Header.tsx`
- Modify: `src/app/components/MobileMenu.tsx`
- Modify: `src/app/components/MobileBottomNavigation.tsx`

**Interfaces:**
- Consumes: tokens from Task 1.
- Produces: public shell that later sections sit under, with unchanged props:
  - `Header({ onMenuClick }: HeaderProps)`
  - `MobileMenu({ isOpen, activeSection, onNavigate, onClose }: MobileMenuProps)`
  - `MobileBottomNavigation({ activeSection, onNavigate, onMoreClick }: MobileBottomNavigationProps)`

- [ ] **Step 1: Update `Header.tsx` imports**

Change imports to support reference-style quick actions:

```tsx
import { Bell, Menu, Phone, UserRound } from 'lucide-react';
```

Keep:

```tsx
import logoImage from '../../imports/image-1.png';
import { is_visible_cilent_review } from '../config/visibility';
```

- [ ] **Step 2: Restyle header background and shadow**

Replace the dark header style with:

```tsx
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
```

- [ ] **Step 3: Add mobile brand text beside logo**

Inside the logo area, render the logo and brand copy:

```tsx
<div className="flex items-center gap-3 min-w-0">
  <img
    src={logoImage.src}
    alt="Scissor King Dimma"
    className="h-12 w-12 rounded-full object-contain shadow-sm sm:h-14 sm:w-14"
  />
  <div className="min-w-0 lg:hidden">
    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontWeight: 700, lineHeight: 1.15 }}>
      Scissor King Dimma
    </p>
    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.78rem' }}>
      Your style. Our passion.
    </p>
  </div>
</div>
```

For desktop, keep the existing logo-only treatment or add the same text if it fits the wider nav.

- [ ] **Step 4: Restyle desktop navigation and CTA**

Use emerald for hover and active-like treatment:

```tsx
style={{
  fontFamily: 'var(--font-body)',
  color: 'var(--muted-foreground)',
  fontSize: '0.9rem',
  letterSpacing: '0.02em',
  textDecoration: 'none',
}}
```

Mouse enter color:

```tsx
e.currentTarget.style.color = 'var(--emerald)';
```

Desktop CTA style:

```tsx
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
  boxShadow: 'var(--shadow-button)',
}}
```

- [ ] **Step 5: Add mobile quick action buttons**

Before the mobile menu button, add a mobile-only quick action row:

```tsx
<div className="lg:hidden flex items-center gap-2">
  <a href="tel:+94715729660" aria-label="Call salon" className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-strong)', color: 'var(--gold-dark)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
    <Phone size={18} />
  </a>
  <button type="button" aria-label="Notifications" className="h-10 w-10 rounded-full flex items-center justify-center relative" style={{ background: 'var(--surface-strong)', color: 'var(--gold-dark)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
    <Bell size={18} />
    <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full" style={{ background: 'var(--destructive)' }} />
  </button>
  <button type="button" aria-label="Profile" className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: 'var(--surface-strong)', color: 'var(--gold-dark)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
    <UserRound size={18} />
  </button>
</div>
```

Keep the `Menu` button visible on mobile if the quick actions make the header too crowded. If space is tight, move `Profile` into the menu and leave call, notifications, and menu.

- [ ] **Step 6: Restyle `MobileMenu.tsx`**

Change overlay and panel styles:

```tsx
style={{ background: 'rgba(16,33,29,0.28)', backdropFilter: 'blur(5px)' }}
```

Panel:

```tsx
style={{
  background: 'var(--surface)',
  borderLeft: '1px solid var(--border)',
  boxShadow: '-16px 0 36px rgba(32,22,12,0.16)',
}}
```

Active nav button style:

```tsx
color: activeSection === item.section ? 'var(--emerald)' : 'var(--foreground)',
background: activeSection === item.section ? 'var(--emerald-soft)' : 'transparent',
borderRadius: '0.9rem',
borderBottom: 'none',
```

- [ ] **Step 7: Keep `MobileBottomNavigation.tsx` behavior unchanged**

Do not change props or navigation behavior. Optionally rename the booking label from `Book` to `Bookings` only if it still fits within the bottom nav without overflow:

```tsx
{ label: 'Bookings', section: 'booking', icon: CalendarCheck },
```

- [ ] **Step 8: Verify shell manually**

Run:

```bash
npm run dev
```

Expected: local Next.js server starts. Open the public site and verify on a mobile viewport that the header, quick actions, mobile menu, and bottom nav do not overlap content and preserve navigation.

- [ ] **Step 9: Commit**

```bash
git add src/app/components/Header.tsx src/app/components/MobileMenu.tsx src/app/components/MobileBottomNavigation.tsx
git commit -m "style: refresh public navigation for cream emerald theme"
```

---

### Task 3: Redesign Public Content Sections

**Files:**
- Modify: `src/app/components/Hero.tsx`
- Modify: `src/app/components/Services.tsx`
- Modify: `src/app/components/Gallery.tsx`
- Modify: `src/app/components/About.tsx`
- Modify: `src/app/components/Contact.tsx`
- Modify: `src/app/components/Footer.tsx`

**Interfaces:**
- Consumes: tokens and shell from Tasks 1 and 2.
- Produces: public content sections with unchanged exported component signatures:
  - `Hero({ useStateNavigation, onBookAppointment, onViewServices }: HeroProps)`
  - `Services({ onBookService, useStateNavigation })`
  - `Gallery()`
  - `About()`
  - `Contact()`
  - `Footer()`

- [ ] **Step 1: Redesign `Hero.tsx` mobile-first layout**

Keep the existing props and CTA handlers. Replace dark ambient blobs with a cream editorial section:

```tsx
<section
  id="home"
  className="salon-hero relative min-h-screen flex items-center pt-20 overflow-hidden"
  style={{
    background: 'linear-gradient(160deg, var(--cream) 0%, #fffaf4 48%, var(--cream-warm) 100%)',
  }}
>
```

Use serif title text:

```tsx
<h1
  style={{
    fontFamily: 'var(--font-heading)',
    color: 'var(--emerald)',
    fontSize: 'clamp(3.25rem, 12vw, 5rem)',
    lineHeight: '0.96',
  }}
>
  <span className="block">Look</span>
  <span className="block">Beautiful.</span>
</h1>
```

Primary CTA:

```tsx
style={{
  fontFamily: 'var(--font-body)',
  background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))',
  color: 'var(--primary-foreground)',
  padding: '1rem 2.25rem',
  borderRadius: '9999px',
  textDecoration: 'none',
  textAlign: 'center',
  boxShadow: 'var(--shadow-button)',
}}
```

Image frame:

```tsx
<div className="relative h-full rounded-[2rem] overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
  <img src="/unsplash.com/salon-reciption.png" alt="Scissor King Dimma salon reception" className="w-full h-full object-cover" />
</div>
```

- [ ] **Step 2: Add home summary/offer card if it does not change behavior**

Below the hero copy on mobile, add a compact card using existing CTA handlers:

```tsx
<div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)', fontSize: '0.78rem', fontWeight: 700 }}>NEXT AVAILABLE</p>
  <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.35rem', marginTop: '0.4rem' }}>Book your next salon visit</p>
  <a href="#booking" onClick={...existing booking handler...}>Book Appointment</a>
</div>
```

- [ ] **Step 3: Redesign `Services.tsx` cards**

Keep `salonServices.map` and `onBookService`. Use ivory cards and emerald action buttons:

```tsx
style={{
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-card)',
}}
```

Service action:

```tsx
style={{
  fontFamily: 'var(--font-body)',
  background: 'var(--emerald)',
  color: 'var(--primary-foreground)',
  borderRadius: '9999px',
  padding: '0.65rem 1rem',
  fontSize: '0.85rem',
  textDecoration: 'none',
  boxShadow: 'var(--shadow-button)',
}}
```

Use `var(--emerald)` for titles and `var(--gold-dark)` for icons and price accents.

- [ ] **Step 4: Add static service category chips**

Add a small chip row above the grid. These chips are decorative filters for now and must not imply working filtering unless actual filtering is implemented:

```tsx
{['All', 'Hair', 'Beauty', 'Bridal', 'Skin'].map((label, index) => (
  <span
    key={label}
    className="inline-flex items-center rounded-full px-4 py-2"
    style={{
      background: index === 0 ? 'var(--emerald)' : 'var(--surface)',
      color: index === 0 ? 'var(--primary-foreground)' : 'var(--foreground)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-soft)',
      fontFamily: 'var(--font-body)',
      fontSize: '0.875rem',
    }}
  >
    {label}
  </span>
))}
```

- [ ] **Step 5: Redesign `Gallery.tsx`**

Change section background to cream and cards to rounded image tiles:

```tsx
<section id="gallery" className="salon-gallery py-24 relative overflow-hidden" style={{ background: 'var(--background)' }}>
```

Tile style:

```tsx
style={{
  borderRadius: '1.25rem',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-card)',
}}
```

Overlay:

```tsx
style={{ background: 'linear-gradient(to top, rgba(16,33,29,0.72) 0%, transparent 58%)' }}
```

- [ ] **Step 6: Redesign `About.tsx`**

Use cream surfaces, emerald headings, and gold/emerald stats:

```tsx
style={{ background: 'var(--section-dark-green)' }}
```

Stat card:

```tsx
style={{
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-card)',
}}
```

Image:

```tsx
style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
```

- [ ] **Step 7: Redesign `Contact.tsx`**

Keep existing phone, WhatsApp, email, and map links. Use quick action cards:

```tsx
style={{
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-card)',
}}
```

Link color should use:

```tsx
style={{ color: 'var(--emerald)', fontFamily: 'var(--font-body)', textDecoration: 'none' }}
```

Add or restyle the appointment CTA as:

```tsx
<a href="#booking" style={{ background: 'var(--emerald)', color: 'var(--primary-foreground)', borderRadius: '9999px', boxShadow: 'var(--shadow-button)' }}>
  Book Appointment
</a>
```

- [ ] **Step 8: Redesign `Footer.tsx`**

Use a controlled emerald band instead of black/gold:

```tsx
<footer style={{ background: 'var(--emerald-dark)', color: 'var(--surface-dark-foreground)', position: 'relative', overflow: 'hidden' }}>
```

Use cream-tinted body text:

```tsx
color: 'rgba(255,250,244,0.72)'
```

Use gold only for small icons and section headings.

- [ ] **Step 9: Verify content sections manually**

Run:

```bash
npm run dev
```

Expected: public mobile sections render with cream backgrounds, emerald actions, readable text, and no card/button text overflow. Desktop page should remain full-width and readable.

- [ ] **Step 10: Commit**

```bash
git add src/app/components/Hero.tsx src/app/components/Services.tsx src/app/components/Gallery.tsx src/app/components/About.tsx src/app/components/Contact.tsx src/app/components/Footer.tsx
git commit -m "style: redesign public content sections"
```

---

### Task 4: Redesign Booking Visuals Without Changing Flow Logic

**Files:**
- Modify: `src/app/components/Booking.tsx`

**Interfaces:**
- Consumes: booking state, helpers, and tokens from earlier tasks.
- Produces: same `Booking({ requestedService }: BookingProps)` component with unchanged booking behavior.

- [ ] **Step 1: Only edit presentation constants first**

Update `inputBase`, `cardStyle`, `selectionBase`, and `selectionActive` near the top of `Booking.tsx`:

```tsx
const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '1rem',
  border: '1px solid var(--border)',
  background: 'var(--input-background)',
  color: 'var(--foreground)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '1.5rem',
  boxShadow: 'var(--shadow-card)',
};

const selectionBase: React.CSSProperties = {
  padding: '1rem',
  borderRadius: '1rem',
  border: '1px solid var(--border)',
  background: 'var(--surface-strong)',
  cursor: 'pointer',
  textAlign: 'left' as const,
  transition: 'all 0.15s',
  width: '100%',
};

const selectionActive: React.CSSProperties = {
  ...selectionBase,
  border: '1px solid rgba(6,68,55,0.45)',
  background: 'var(--emerald-soft)',
  boxShadow: '0 0 0 3px rgba(6,68,55,0.1)',
};
```

- [ ] **Step 2: Update booking section backgrounds**

Both confirmed and normal booking sections should use cream backgrounds:

```tsx
style={{ background: 'var(--background)' }}
```

Remove dark top divider assumptions or change them to:

```tsx
style={{ background: 'linear-gradient(to right, transparent, rgba(138,95,34,0.22), transparent)' }}
```

- [ ] **Step 3: Restyle booking header**

Use emerald title and gold eyebrow:

```tsx
<p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
  Easy Booking
</p>
<h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--emerald)', fontSize: 'clamp(2.4rem, 7vw, 3.25rem)' }}>
  Book Appointment
</h2>
```

- [ ] **Step 4: Restyle stepper**

Completed/current steps should be emerald:

```tsx
background: isCompleted
  ? 'var(--emerald)'
  : isActive
    ? 'var(--emerald)'
    : 'var(--surface)',
border: isActive || isCompleted ? 'none' : '1px solid var(--border)',
color: isCompleted || isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
boxShadow: isActive ? '0 0 0 4px rgba(6,68,55,0.1)' : 'none',
```

Connector:

```tsx
background: s < step ? 'var(--emerald)' : 'var(--border)'
```

- [ ] **Step 5: Restyle selected service options and totals**

Checked option row:

```tsx
background: isChecked ? 'var(--emerald-soft)' : index % 2 === 0 ? 'var(--muted)' : 'var(--surface-strong)'
```

Checkbox:

```tsx
className="h-5 w-5 accent-emerald"
```

Totals:

```tsx
style={{ background: 'var(--emerald-soft)', border: '1px solid rgba(6,68,55,0.2)' }}
```

- [ ] **Step 6: Restyle calendar and time slots**

Calendar class names should use emerald selected states:

```tsx
day_selected: 'bg-emerald text-primary-foreground hover:bg-emerald hover:text-primary-foreground focus:bg-emerald focus:text-primary-foreground',
day_today: 'border border-emerald/50 text-emerald',
nav_button: 'absolute top-0 inline-flex size-7 items-center justify-center rounded-md border border-border bg-transparent p-0 text-emerald opacity-75 transition hover:bg-secondary hover:opacity-100',
```

Selected time slot background:

```tsx
background: isSelected
  ? 'var(--emerald)'
  : isHeld
    ? 'var(--emerald-soft)'
    : isAvailable
      ? 'var(--surface-strong)'
      : 'rgba(102,112,109,0.08)',
```

Selected time text should be `var(--primary-foreground)`.

- [ ] **Step 7: Restyle staff selector**

Selected staff:

```tsx
border: isSelected ? '2px solid var(--emerald)' : '1px solid var(--border)',
background: isSelected ? 'var(--emerald-soft)' : 'var(--surface-strong)',
boxShadow: isSelected ? '0 0 0 4px rgba(6,68,55,0.1)' : 'none',
```

- [ ] **Step 8: Restyle navigation buttons**

Back button stays outlined:

```tsx
background: 'var(--surface-strong)',
color: 'var(--foreground)',
border: '1px solid var(--border)',
```

Next/confirm button uses emerald:

```tsx
background: canProceed ? 'var(--emerald)' : 'var(--surface-strong)',
color: canProceed ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
boxShadow: canProceed ? 'var(--shadow-button)' : 'none',
```

For confirm:

```tsx
background: isUsingFallbackBookingOptions ? 'var(--surface-strong)' : 'var(--emerald)',
```

- [ ] **Step 9: Restyle confirmation state**

Success icon circle:

```tsx
style={{
  background: 'var(--emerald-soft)',
  border: '1px solid rgba(6,68,55,0.2)',
}}
```

Use:

```tsx
<CheckCircle className="w-10 h-10" style={{ color: 'var(--emerald)' }} />
```

Status chip:

```tsx
style={{
  fontFamily: 'var(--font-body)',
  color: 'var(--emerald)',
  fontSize: '0.78rem',
  background: 'var(--emerald-soft)',
  border: '1px solid rgba(6,68,55,0.2)',
}}
```

- [ ] **Step 10: Verify booking behavior manually**

Run:

```bash
npm run dev
```

Expected:
- Service selection still works.
- Option toggles still update total price and duration.
- Date and staff selection still clear invalid times.
- Time slot selection still works.
- Customer details still update state.
- Confirmation submission behavior is unchanged.
- Fallback/offline messages remain readable.

- [ ] **Step 11: Commit**

```bash
git add src/app/components/Booking.tsx
git commit -m "style: refresh booking flow visuals"
```

---

### Task 5: Integrated Responsive Verification And Cleanup

**Files:**
- Modify only files touched in Tasks 1-4 if verification reveals visual regressions.

**Interfaces:**
- Consumes: all redesigned public UI tasks.
- Produces: verified public UI that builds and keeps existing tests passing.

- [ ] **Step 1: Run automated tests**

```bash
npm test
```

Expected: all existing node tests pass.

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: Next.js production build completes. If it fails due to missing local environment for Prisma generation, capture the exact error and verify whether the same failure existed before this redesign.

- [ ] **Step 3: Start local server**

```bash
npm run dev
```

Expected: local dev server starts and serves the public site.

- [ ] **Step 4: Mobile manual checklist**

Use a mobile viewport around 390x844 and verify:

- Home header and quick actions fit.
- Home hero title, image, and CTAs do not overlap.
- Bottom navigation does not cover primary content or booking controls.
- Services cards fit with readable price/duration/action.
- Booking stepper and cards fit at each step.
- Gallery image labels remain readable.
- About stats do not overflow.
- Contact quick actions and map card fit.
- More menu opens, closes, and navigates.

- [ ] **Step 5: Desktop manual checklist**

Use a desktop viewport around 1440x900 and verify:

- Header nav and CTA fit.
- Hero uses a full desktop layout, not a stretched mobile stack.
- Service cards form a balanced grid.
- Booking form remains readable and centered.
- Gallery layout is visually balanced.
- About/contact/footer use the cream/emerald theme.

- [ ] **Step 6: Check admin for accidental global regressions**

Open `/admin/login` and one admin page if authenticated or available. Expected: no broken layout caused by global CSS changes. Admin does not need to match the cream/emerald public redesign.

- [ ] **Step 7: Inspect final diff**

```bash
git diff --stat
git diff -- src/styles/theme.css src/app/App.tsx src/app/components/Header.tsx src/app/components/MobileMenu.tsx src/app/components/MobileBottomNavigation.tsx src/app/components/Hero.tsx src/app/components/Services.tsx src/app/components/Gallery.tsx src/app/components/About.tsx src/app/components/Contact.tsx src/app/components/Footer.tsx src/app/components/Booking.tsx
```

Expected: changes are scoped to public UI styling/layout and do not alter backend/API contracts.

- [ ] **Step 8: Final commit**

If cleanup changes were made:

```bash
git add src/styles/theme.css src/app/App.tsx src/app/components/Header.tsx src/app/components/MobileMenu.tsx src/app/components/MobileBottomNavigation.tsx src/app/components/Hero.tsx src/app/components/Services.tsx src/app/components/Gallery.tsx src/app/components/About.tsx src/app/components/Contact.tsx src/app/components/Footer.tsx src/app/components/Booking.tsx
git commit -m "style: polish responsive public redesign"
```

If no cleanup changes were made, do not create an empty commit.

---

## Plan Self-Review

- Spec coverage: public-only scope, mobile-first priority, desktop support, cream/emerald/gold palette, unchanged booking behavior, admin non-goal, accessibility, and verification are all covered.
- Placeholder scan: no placeholder markers or unspecified implementation steps remain.
- Type consistency: exported component signatures remain unchanged. New CSS variables are defined in Task 1 before later tasks consume them.
- Parallel safety: Task 1 is serial; Tasks 2-4 can be dispatched after Task 1 with clear file ownership; Task 5 is serial integration.
