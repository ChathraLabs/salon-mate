import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Calendar, Clock, User, CheckCircle } from 'lucide-react';

const services = [
  { id: 1, name: 'Hair Cut & Styling', price: 2500, duration: '45 min' },
  { id: 2, name: 'Bridal Dressing', price: 15000, duration: '3 hours' },
  { id: 3, name: 'Facial Treatment', price: 3500, duration: '60 min' },
  { id: 4, name: 'Nail Care', price: 1500, duration: '30 min' },
  { id: 5, name: 'Waxing & Threading', price: 500, duration: '20 min' },
  { id: 6, name: 'Makeup', price: 5000, duration: '90 min' },
  { id: 7, name: 'Hair Coloring', price: 4000, duration: '120 min' },
  { id: 8, name: 'Tattoo Training', price: 0, duration: 'Varies' },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '03:00 PM', '04:00 PM', '04:30 PM', '05:30 PM',
];

const dates = [
  { label: 'Today', date: '2026-05-11' },
  { label: 'Tomorrow', date: '2026-05-12' },
  { label: 'Fri 13', date: '2026-05-13' },
  { label: 'Sat 14', date: '2026-05-14' },
  { label: 'Sun 15', date: '2026-05-15' },
  { label: 'Mon 16', date: '2026-05-16' },
  { label: 'Tue 17', date: '2026-05-17' },
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
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', email: '', note: '' });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());

  const handleNext = () => { if (step < 5) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const handleConfirmBooking = () => setIsConfirmed(true);
  const handleNewBooking = () => {
    setStep(1); setSelectedService(null); setSelectedDate(null);
    setSelectedTime(null); setCustomerDetails({ name: '', phone: '', email: '', note: '' });
    setIsConfirmed(false);
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
                { label: 'Booking ID', value: `SKD-${bookingId}` },
                { label: 'Service', value: selectedService?.name },
                { label: 'Date', value: dates.find(d => d.date === selectedDate)?.label },
                { label: 'Time', value: selectedTime },
                { label: 'Duration', value: selectedService?.duration },
                { label: 'Price', value: `LKR ${selectedService?.price.toLocaleString()}` },
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
                    onClick={() => setSelectedDate(date.date)}
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
                  { label: 'Price', value: `LKR ${selectedService?.price.toLocaleString()}` },
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
                className="ml-auto"
                style={{
                  fontFamily: 'var(--font-body)',
                  padding: '0.7rem 2rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                  color: 'var(--primary-foreground)',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(212,165,32,0.25)',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,165,32,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,32,0.25)')}
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
