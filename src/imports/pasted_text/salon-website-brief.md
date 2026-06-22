
# Salon Public Website UI — Figma Design Brief

## 1. Overall Design Direction

Create a **premium, clean, mobile-first salon website** that helps customers quickly understand the salon, view services, and book an appointment.

The design should feel:

* Elegant
* Feminine but not overly decorative
* Modern
* Trustworthy
* Easy to book within 1–2 minutes

Suggested visual style: use theme in the attached image


---

# 2. Page Structure

## A. Header Section

The header should be sticky on scroll, especially on mobile.

### Desktop Header

Left side:

```txt
Salon Logo / Salon Name
```

Center navigation:

```txt
Home | Services | Gallery | Reviews | Contact
```

Right side:

```txt
Book Appointment button
```

### Mobile Header

```txt
Logo / Salon Name
Menu icon
Book button can be visible or inside menu
```

Mobile menu items:

```txt
Home
Services
Gallery
Reviews
Contact
Book Appointment
```

Header behavior:

* Sticky header
* Transparent over hero initially or white background after scroll
* Clear CTA button: **Book Now**

---

## B. Hero Section

This is the most important section.

### Content

Left side or centered:

```txt
Salon Name
Premium Beauty & Hair Care in [City]
Short description: Experience professional salon services, bridal styling, hair care, beauty treatments, and more.
Primary CTA: Book Appointment
Secondary CTA: View Services
```

### Right side / Background

Use a high-quality salon, hair styling, bridal, or beauty image.

### Hero Elements

Add small trust indicators:

```txt
4.8 Rating
500+ Happy Customers
Professional Stylists
```

Example layout:

```txt
[Headline]
Look Beautiful. Feel Confident.

[Description]
Book your next salon appointment online with our expert beauty professionals.

[Book Appointment] [View Services]
```

---

## C. Services Preview Section

Purpose: Let customers quickly understand what services are available.

### Section Title

```txt
Our Services
```

### Service Cards

Each card should include:

```txt
Service image/icon
Service name
Short description
Starting price
Duration
Book button
```

Example services:

```txt
Hair Styling
Bridal Dressing
Facial Treatments
Nail Care
Waxing
Makeup
Hair Coloring
Threading
```

### Card Example

```txt
Hair Styling
Professional haircut, styling, and blow dry.
From LKR 2,500
45 min
[Book]
```

Design notes:

* Use 2–3 columns on desktop
* Use horizontal scroll or single column on mobile
* Keep cards clean and image-rich

---

## D. About Salon Section

Purpose: Build trust.

Content:

```txt
About Us
We are a professional beauty salon offering high-quality hair, beauty, bridal, and skincare services. Our team focuses on comfort, hygiene, and personalized care for every customer.
```

Include:

```txt
Years of experience
Number of customers
Specialized services
```

Example stats:

```txt
5+ Years Experience
1,000+ Customers
20+ Services
```

Add image of salon interior or stylist at work.

---

## E. Gallery Section

Purpose: Show visual proof.

### Layout

Use a clean image grid.

Images can include:

```txt
Salon interior
Hair styling results
Bridal dressing
Nail work
Makeup work
Before/after images
```

Design:

* 3-column masonry grid on desktop
* 2-column grid on tablet
* 1-column or 2-column grid on mobile
* Add “View More” button for future

---

## F. Reviews Section

Purpose: Increase trust before booking.

### Review Card

Each review should include:

```txt
Customer name
Star rating
Review text
Optional customer image/avatar
```

Example:

```txt
★★★★★
Amazing service and very friendly staff. Highly recommended!

— Nethmi P.
```

Show 3–6 reviews.

Also add summary:

```txt
4.8/5 average rating from 250+ customers
```

---

# 3. Booking Section

This is the main functional part.

Design this as a clear step-by-step booking form.

## Booking Section Title

```txt
Book Your Appointment
```

## Booking Flow

### Step 1: Select Service

Show services as selectable cards or dropdown.

Each service item:

```txt
Service name
Price
Duration
Short description
```

Example:

```txt
Hair Cut & Styling
LKR 2,500
45 min
```

Selected service should be visually highlighted.

---

### Step 2: Select Date

Use a calendar/date picker.

Requirements:

* Disable closed days
* Highlight selected date
* Show available dates clearly
* Mobile-friendly date picker

Example UI:

```txt
Today
Tomorrow
Fri 24
Sat 25
Sun 26
```

---

### Step 3: Select Available Time

Show time slots as buttons.

Example:

```txt
09:00 AM
10:00 AM
11:30 AM
02:00 PM
04:30 PM
```

States:

```txt
Available
Selected
Unavailable
```

Unavailable slots should be greyed out.

---

### Step 4: Customer Details

Fields:

```txt
Full Name
Mobile Number
Email Address optional
Special Note optional
```

Use clear validation messages.

Example:

```txt
Please enter your mobile number
```

---

### Step 5: Booking Summary

Before final confirmation, show a summary card:

```txt
Service: Hair Styling
Date: 25 May 2026
Time: 10:30 AM
Duration: 45 min
Price: LKR 2,500
Customer: Tharuka
Contact: 07X XXX XXXX
```

CTA:

```txt
Confirm Booking
```

Secondary:

```txt
Back / Edit
```

---

## G. Booking Confirmation Page / Modal

After successful booking, show a clean confirmation screen.

Content:

```txt
Booking Confirmed!
Your appointment request has been submitted successfully.
```

Show:

```txt
Booking ID
Salon Name
Service
Date
Time
Contact Number
Status: Pending / Confirmed
```

Buttons:

```txt
Back to Salon Page
Call Salon
Share on WhatsApp
```

Important note:

```txt
The salon will contact you if any changes are needed.
```

---

# 4. Contact Section

Include:

```txt
Salon address
Phone number
WhatsApp number
Email
Opening hours
Google Maps embed
```

CTA buttons:

```txt
Call Now
WhatsApp
Get Directions
```

Example:

```txt
Opening Hours
Monday - Saturday: 9:00 AM - 7:00 PM
Sunday: Closed
```

---

# 5. Footer

Footer should include:

```txt
Salon logo/name
Short description
Quick links
Contact details
Social media icons
Copyright
```

Example:

```txt
© 2026 Zara Salon. Powered by SalonMate.
```

This “Powered by” part is useful for SaaS marketing.

---

# 6. Mobile UX Requirements

The mobile version is more important than desktop.

Mobile design should have:

```txt
Sticky bottom Book Now button
Large touch-friendly buttons
Simple one-column layout
Fast booking flow
Clear spacing
Minimal typing
```

Suggested mobile sticky CTA:

```txt
[Book Appointment]
```

It should stay at the bottom when the user scrolls.

---

# 7. Figma Frames to Create

Ask the designer to create these screens:

```txt
1. Desktop Salon Home Page
2. Mobile Salon Home Page
3. Desktop Booking Section
4. Mobile Booking Flow
5. Service Selected State
6. Date Selected State
7. Time Slot Selected State
8. Customer Details Form
9. Booking Summary
10. Booking Confirmation Screen
11. Mobile Menu Open State
```

---

# 8. Key Components for Figma

Create reusable components:

```txt
Header
Hero section
Primary button
Secondary button
Service card
Review card
Gallery image card
Date picker
Time slot button
Input field
Booking summary card
Confirmation modal
Footer
```

---

# 9. Sample Website Section Order

Recommended order:

```txt
Header
Hero
Services
About
Gallery
Reviews
Booking
Contact
Footer
```

For conversion, the **Book Appointment** button should appear in:

```txt
Header
Hero
Each service card
Sticky mobile bottom bar
Footer/contact section
```

---

# 10. Main Design Goal

The website should make the customer feel:

```txt
“This salon looks professional, I understand the services, and I can book quickly.”
```

For MVP, do not make it a complex page builder. Use one beautiful default template where salon owners can update:

```txt
Salon name
Logo
Banner image
About text
Services
Prices
Gallery
Contact details
Opening hours
Reviews
```
