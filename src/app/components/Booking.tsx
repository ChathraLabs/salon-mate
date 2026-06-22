import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import type { AvailabilityDay, PublicService } from '@/types/booking';

const fallbackServices: PublicService[] = [
  { id: 'hair-cut-styling', name: 'Hair Cut & Styling', description: null, priceCents: 250000, price: 2500, durationMinutes: 45, duration: '45 min' },
  { id: 'bridal-dressing', name: 'Bridal Dressing', description: null, priceCents: 1500000, price: 15000, durationMinutes: 180, duration: '3 hours' },
];

const stepLabels = ['Service', 'Date', 'Time', 'Details', 'Confirm'];

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid var(--border)',
  background: 'var(--input-background)',
  color: 'var(--foreground)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '1.5rem',
  boxShadow: '0 4px 48px rgba(0,0,0,0.5)',
};

const selectionBase: React.CSSProperties = {
  padding: '1rem',
  borderRadius: '0.875rem',
  border: '1px solid var(--border)',
  background: 'var(--muted)',
  cursor: 'pointer',
  textAlign: 'left' as const,
  transition: 'all 0.15s',
  width: '100%',
};

const selectionActive: React.CSSProperties = {
  ...selectionBase,
  border: '1px solid rgba(212,165,32,0.6)',
  background: 'rgba(212,165,32,0.08)',
  boxShadow: '0 0 0 2px rgba(212,165,32,0.12)',
};

export function Booking() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<PublicService[]>(fallbackServices);
  const [dates, setDates] = useState<AvailabilityDay[]>([]);
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', email: '', note: '' });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBookingData() {
      try {
        const [servicesResponse, availabilityResponse] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/availability'),
        ]);

        if (!servicesResponse.ok || !availabilityResponse.ok) {
          throw new Error('Unable to load booking options.');
        }

        const [servicesData, availabilityData] = await Promise.all([
          servicesResponse.json(),
          availabilityResponse.json(),
        ]);

        if (!cancelled) {
          setServices(servicesData.services);
          setDates(availabilityData.days);
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load booking options.');
        }
      }
    }

    loadBookingData();

    return () => {
      cancelled = true;
    };
  }, []);

  const timeSlots = useMemo(() => {
    return dates.find((date) => date.date === selectedDate)?.slots ?? [];
  }, [dates, selectedDate]);

  const handleNext = () => { if (step < 5) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: selectedDate,
          time: selectedTime,
          customer: {
            name: customerDetails.name,
            phone: customerDetails.phone,
            email: customerDetails.email,
          },
          note: customerDetails.note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to submit booking.');
      }

      setBookingCode(data.booking.bookingCode);
      setIsConfirmed(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNewBooking = () => {
    setStep(1); setSelectedService(null); setSelectedDate(null);
    setSelectedTime(null); setCustomerDetails({ name: '', phone: '', email: '', note: '' });
    setBookingCode(null); setSubmitError(null); setIsConfirmed(false);
  };

  const canProceed = [
    selectedService !== null,
    selectedDate !== null,
    selectedTime !== null,
    !!(customerDetails.name && customerDetails.phone),
    true,
  ][step - 1];

  if (isConfirmed) {
    return (
      <section id="booking" className="py-24 relative" style={{ background: 'var(--muted)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center p-10 sm:p-14" style={cardStyle}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(212,165,32,0.15), rgba(242,200,58,0.2))',
                border: '1px solid rgba(212,165,32,0.3)',
              }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: 'var(--gold)' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: 'clamp(1.75rem, 4vw, 2.25rem)' }}>
              Booking Confirmed!
            </h2>
            <p className="mt-3 mb-8" style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '1rem' }}>
              Your appointment request has been submitted successfully.
            </p>

            <div className="text-left mb-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {[
                { label: 'Booking ID', value: bookingCode },
                { label: 'Service', value: selectedService?.name },
                { label: 'Date', value: dates.find(d => d.date === selectedDate)?.label },
                { label: 'Time', value: selectedTime },
                { label: 'Duration', value: selectedService?.duration },
                { label: 'Price', value: selectedService?.price ? `LKR ${selectedService.price.toLocaleString()}` : 'Contact for pricing' },
              ].map(({ label, value }, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-5 py-3"
                  style={{
                    borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
                    background: i % 2 === 0 ? 'var(--muted)' : 'var(--card)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-body)', color: i === 0 ? 'var(--gold)' : 'var(--foreground)', fontSize: '0.875rem' }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-5 py-3" style={{ background: 'var(--muted)' }}>
                <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Status</span>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.78rem',
                    background: 'rgba(212,165,32,0.1)', border: '1px solid rgba(212,165,32,0.2)',
                  }}
                >
                  Pending Confirmation
                </span>
              </div>
            </div>

            <p className="mb-8" style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
              The salon will contact you at <strong style={{ color: 'var(--gold)' }}>{customerDetails.phone}</strong> to confirm.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleNewBooking}
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                  color: 'var(--primary-foreground)',
                  borderRadius: '9999px', padding: '0.8rem 1.75rem',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(212,165,32,0.25)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,165,32,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,32,0.25)')}
              >
                Book Another
              </button>
              <a
                href="tel:+94712345678"
                style={{
                  fontFamily: 'var(--font-body)',
                  border: '1px solid rgba(212,165,32,0.35)', color: 'var(--foreground)',
                  borderRadius: '9999px', padding: '0.8rem 1.75rem', textAlign: 'center',
                  transition: 'all 0.2s', display: 'block', textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gold)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold-light)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212,165,32,0.35)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground)';
                }}
              >
                Call Salon
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 relative overflow-hidden" style={{ background: 'var(--muted)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,32,0.3), transparent)' }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            ✦ Easy Booking ✦
          </p>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
            Book Your Appointment
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '1rem' }}>
            Follow these simple steps to secure your appointment
          </p>
          {loadError && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)', fontSize: '0.875rem' }}>
              {loadError}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {stepLabels.map((label, i) => {
            const s = i + 1;
            const isCompleted = s < step;
            const isActive = s === step;
            return (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isCompleted
                        ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))'
                        : isActive
                        ? 'rgba(212,165,32,0.15)'
                        : 'var(--card)',
                      border: isActive
                        ? '2px solid var(--gold)'
                        : isCompleted
                        ? 'none'
                        : '1px solid var(--border)',
                      color: isCompleted
                        ? 'var(--primary-foreground)'
                        : isActive
                        ? 'var(--gold)'
                        : 'var(--muted-foreground)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      boxShadow: isActive ? '0 0 0 4px rgba(212,165,32,0.1)' : 'none',
                    }}
                  >
                    {isCompleted ? <Check size={15} /> : s}
                  </div>
                  <span
                    className="hidden sm:block"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem',
                      color: isActive ? 'var(--gold)' : 'var(--muted-foreground)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {label}
                  </span>
                </div>
                {s < 5 && (
                  <div
                    className="w-10 sm:w-14 h-px mx-1 mb-5 transition-all"
                    style={{
                      background: s < step
                        ? 'linear-gradient(to right, var(--gold-dark), var(--gold))'
                        : 'var(--border)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="p-6 sm:p-10" style={cardStyle}>

          {/* Step 1 – Service */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                Select Service
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    style={selectedService?.id === service.id ? selectionActive : selectionBase}
                    onMouseEnter={(e) => { if (selectedService?.id !== service.id) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,165,32,0.3)'; } }}
                    onMouseLeave={(e) => { if (selectedService?.id !== service.id) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; } }}
                  >
                    <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '0.975rem', marginBottom: '0.35rem' }}>
                      {service.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', fontSize: '0.8rem' }}>
                        {service.price > 0 ? `LKR ${service.price.toLocaleString()}` : 'Contact for pricing'}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.72rem', background: 'var(--card)', border: '1px solid var(--border)' }}
                      >
                        {service.duration}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 – Date */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                Select Date
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dates.map((date) => (
                  <button
                    key={date.date}
                    onClick={() => {
                      setSelectedDate(date.date);
                      setSelectedTime(null);
                    }}
                    style={selectedDate === date.date ? { ...selectionActive, textAlign: 'center' } : { ...selectionBase, textAlign: 'center' }}
                    onMouseEnter={(e) => { if (selectedDate !== date.date) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,165,32,0.3)'; }}
                    onMouseLeave={(e) => { if (selectedDate !== date.date) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                  >
                    <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '0.975rem' }}>{date.label}</p>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{date.date}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 – Time */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <Clock className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                Select Time
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{ ...(selectedTime === time ? selectionActive : selectionBase), textAlign: 'center' }}
                    onMouseEnter={(e) => { if (selectedTime !== time) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,165,32,0.3)'; }}
                    onMouseLeave={(e) => { if (selectedTime !== time) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
                  >
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem' }}>{time}</span>
                  </button>
                ))}
              </div>
              {timeSlots.length === 0 && (
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                  No available slots for this date. Please go back and choose another date.
                </p>
              )}
            </div>
          )}

          {/* Step 4 – Details */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <User className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                Your Details
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Full Name *', type: 'text', key: 'name', placeholder: 'Enter your full name' },
                  { label: 'Mobile Number *', type: 'tel', key: 'phone', placeholder: '07X XXX XXXX' },
                  { label: 'Email Address (Optional)', type: 'email', key: 'email', placeholder: 'your@email.com' },
                ].map(({ label, type, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={customerDetails[key as keyof typeof customerDetails]}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, [key]: e.target.value })}
                      placeholder={placeholder}
                      style={inputBase}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                    Special Note (Optional)
                  </label>
                  <textarea
                    value={customerDetails.note}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, note: e.target.value })}
                    rows={3}
                    placeholder="Any special requests or requirements..."
                    style={{ ...inputBase, resize: 'vertical' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--gold)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5 – Summary */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--foreground)', fontSize: '1.4rem' }}>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                Confirm Booking
              </h3>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {[
                  { label: 'Service', value: selectedService?.name },
                  { label: 'Date', value: `${dates.find(d => d.date === selectedDate)?.label} (${selectedDate})` },
                  { label: 'Time', value: selectedTime },
                  { label: 'Duration', value: selectedService?.duration },
                  { label: 'Price', value: selectedService?.price ? `LKR ${selectedService.price.toLocaleString()}` : 'Contact for pricing' },
                  { label: 'Customer', value: customerDetails.name },
                  { label: 'Contact', value: customerDetails.phone },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-5 py-3.5"
                    style={{
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      background: i % 2 === 0 ? 'var(--muted)' : 'var(--card)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem' }}>{value}</span>
                  </div>
                ))}
              </div>
              {submitError && (
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)', fontSize: '0.9rem' }}>
                  {submitError}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-body)',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--foreground)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,32,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <ChevronLeft size={18} />
                Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-2 ml-auto"
                style={{
                  fontFamily: 'var(--font-body)',
                  padding: '0.7rem 1.75rem',
                  borderRadius: '9999px',
                  background: canProceed
                    ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))'
                    : 'var(--card)',
                  color: canProceed ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  border: canProceed ? 'none' : '1px solid var(--border)',
                  cursor: canProceed ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: canProceed ? '0 4px 16px rgba(212,165,32,0.25)' : 'none',
                }}
                onMouseEnter={(e) => { if (canProceed) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(212,165,32,0.4)'; }}
                onMouseLeave={(e) => { if (canProceed) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(212,165,32,0.25)'; }}
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="ml-auto"
                style={{
                  fontFamily: 'var(--font-body)',
                  padding: '0.7rem 2rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                  color: 'var(--primary-foreground)',
                  border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(212,165,32,0.25)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,165,32,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,32,0.25)')}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
