import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  formatServiceDuration as formatDurationLabel,
  formatServicePrice as formatPrice,
  getStaffRoleLabelForService,
  getSalonService,
  publicSalonServices,
  type SalonServiceOption,
} from '../config/services';
import type { AvailabilityDay, PublicService, PublicStaffMember } from '@/types/booking';
import { getBookingStepState, getDateChipParts } from './bookingPresentation';

type BookingProps = {
  requestedService?: { id: string; key: number } | null;
};

const fallbackServices: PublicService[] = publicSalonServices;

const stepLabels = ['Service', 'Date & Time', 'Details', 'Confirm'];

const defaultTimeSlots = Array.from({ length: 15 }, (_, index) => {
  const hour = index + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

function formatTimeLabel(time: string) {
  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function minutesFromTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function timeFromMinutes(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fallbackAvailabilityDays(days = 7): AvailabilityDay[] {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    const label = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : `${labels[date.getDay()]} ${date.getDate()}`;

    return {
      label,
      date: localDateKey(date),
      allSlots: defaultTimeSlots,
      slots: defaultTimeSlots,
      bookedSlots: [],
      staffSlots: {},
      staffBookedSlots: {},
      availableStaffBySlot: {},
    };
  });
}

function optionsForService(service: PublicService | null): SalonServiceOption[] {
  if (!service) return [];

  return getSalonService(service.id)?.options ?? [
    {
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.durationMinutes,
      defaultSelected: true,
    },
  ];
}

function resolvePublicService(serviceId: string, services: PublicService[]) {
  return services.find((item) => item.id === serviceId)
    ?? publicSalonServices.find((item) => item.id === serviceId)
    ?? null;
}

function barberAvatarUrl(barber: PublicStaffMember) {
  const lowerName = barber.name.toLowerCase();

  if (barber.avatarUrl) return barber.avatarUrl;
  if (lowerName.includes('dimuthu')) return '/staff/Dimuthu.jpeg';
  if (lowerName.includes('sanju')) return '/staff/Sanju.png';
  if (lowerName.includes('salindee')) return '/staff/Salindee.png';
  if (lowerName.includes('vinu')) return '/staff/Vinu.png';

  return null;
}

export function Booking({ requestedService }: BookingProps) {
  const bookingSectionRef = useRef<HTMLElement | null>(null);
  const bookingCardRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<PublicService[]>(fallbackServices);
  const [barbers, setBarbers] = useState<PublicStaffMember[]>([]);
  const [dates, setDates] = useState<AvailabilityDay[]>([]);
  const [selectedService, setSelectedService] = useState<PublicService | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', phone: '', email: '', note: '' });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
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

        const [servicesData, availabilityData] = await Promise.all([
          servicesResponse.json(),
          availabilityResponse.json(),
        ]);

        if (!servicesResponse.ok || !availabilityResponse.ok) {
          throw new Error(servicesData.error ?? availabilityData.error ?? 'Unable to load booking options.');
        }

        if (!cancelled) {
          setServices(publicSalonServices);
          setDates(availabilityData.days);
          setBarbers(availabilityData.staff ?? []);
          setSelectedStaffId((current) => current ?? availabilityData.staff?.find((member: PublicStaffMember) => member.isMain)?.id ?? availabilityData.staff?.[0]?.id ?? null);
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setDates(fallbackAvailabilityDays());
          setBarbers([]);
          setLoadError(error instanceof Error ? `${error.message} Showing default times for preview.` : 'Unable to load booking options. Showing default times for preview.');
        }
      }
    }

    loadBookingData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!requestedService) return;

    const service = resolvePublicService(requestedService.id, services);
    if (!service) return;

    selectService(service);
    setStep(1);
    setSubmitError(null);
  }, [requestedService, services]);

  const selectService = (service: PublicService) => {
    const options = optionsForService(service);
    const defaultIds = options.filter((option) => option.defaultSelected).map((option) => option.id);

    setSelectedService(service);
    setSelectedOptionIds(defaultIds.length > 0 ? defaultIds : options.slice(0, 1).map((option) => option.id));
    setSelectedStaffId(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSubmitError(null);
  };

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptionIds((current) => (
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
    ));
    setSelectedTime(null);
  };

  const availableTimeSlots = useMemo(() => {
    const day = dates.find((date) => date.date === selectedDate);
    if (!day) return [];
    return selectedStaffId ? (day.staffSlots?.[selectedStaffId] ?? []) : day.slots;
  }, [dates, selectedDate, selectedStaffId]);
  const allTimeSlots = useMemo(() => {
    return dates.find((date) => date.date === selectedDate)?.allSlots ?? (selectedDate ? defaultTimeSlots : []);
  }, [dates, selectedDate]);
  const bookedTimeSlots = useMemo(() => {
    const day = dates.find((date) => date.date === selectedDate);
    if (!day) return [];
    return selectedStaffId ? (day.staffBookedSlots?.[selectedStaffId] ?? []) : day.bookedSlots;
  }, [dates, selectedDate, selectedStaffId]);
  const selectedDateOption = useMemo(() => {
    return dates.find((date) => date.date === selectedDate) ?? null;
  }, [dates, selectedDate]);
  const selectedStaff = useMemo(() => {
    return barbers.find((barber) => barber.id === selectedStaffId) ?? null;
  }, [barbers, selectedStaffId]);
  const availableTimeSlotSet = useMemo(() => new Set(availableTimeSlots), [availableTimeSlots]);
  const bookedTimeSlotSet = useMemo(() => new Set(bookedTimeSlots), [bookedTimeSlots]);
  const isUsingFallbackBookingOptions = loadError?.includes('Showing default times for preview.') ?? false;
  const selectedServiceOptions = useMemo(() => optionsForService(selectedService), [selectedService]);
  const selectedOptions = useMemo(
    () => selectedServiceOptions.filter((option) => selectedOptionIds.includes(option.id)),
    [selectedOptionIds, selectedServiceOptions],
  );
  const selectedTotalPrice = selectedOptions.reduce((total, option) => total + option.price, 0);
  const selectedTotalDuration = selectedOptions.reduce((total, option) => total + option.duration, 0);
  const selectedOptionLabels = selectedOptions.map((option) => option.name).join(', ');
  const selectedStaffRoleLabel = getStaffRoleLabelForService(selectedService?.id);
  const selectedDateChip = selectedDateOption ? getDateChipParts(selectedDateOption.date, selectedDateOption.label) : null;
  const selectedServiceImage = selectedService ? getSalonService(selectedService.id)?.image : null;
  const selectedOptionCountLabel = selectedOptions.length === 1 ? '1 Service' : `${selectedOptions.length} Services`;
  const selectedTimeEnd = useMemo(() => {
    if (!selectedTime || selectedTotalDuration <= 0) return null;
    return timeFromMinutes(minutesFromTime(selectedTime) + selectedTotalDuration);
  }, [selectedTime, selectedTotalDuration]);
  const heldTimeSlotSet = useMemo(() => {
    if (!selectedTime || selectedTotalDuration <= 0) return new Set<string>();

    const startsAt = minutesFromTime(selectedTime);
    const endsAt = startsAt + selectedTotalDuration;

    return new Set(
      allTimeSlots.filter((slot) => {
        const slotStartsAt = minutesFromTime(slot);
        return slotStartsAt >= startsAt && slotStartsAt < endsAt;
      }),
    );
  }, [allTimeSlots, selectedTime, selectedTotalDuration]);
  useEffect(() => {
    if (!selectedService || selectedTotalDuration <= 0 || isUsingFallbackBookingOptions) return;

    let cancelled = false;
    const serviceId = selectedService.id;

    async function loadDurationAvailability() {
      setIsAvailabilityLoading(true);

      try {
        const params = new URLSearchParams({
          duration: String(selectedTotalDuration),
          serviceId,
        });
        const response = await fetch(`/api/availability?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? 'Unable to refresh availability.');
        }

        if (!cancelled) {
          const nextStaff = data.staff ?? [];
          setDates(data.days);
          setBarbers(nextStaff);
          setSelectedStaffId((current) => {
            if (current && nextStaff.some((member: PublicStaffMember) => member.id === current)) return current;
            return nextStaff.find((member: PublicStaffMember) => member.isMain)?.id ?? nextStaff[0]?.id ?? null;
          });
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to refresh availability.');
        }
      } finally {
        if (!cancelled) {
          setIsAvailabilityLoading(false);
        }
      }
    }

    loadDurationAvailability();

    return () => {
      cancelled = true;
    };
  }, [selectedService, selectedTotalDuration, isUsingFallbackBookingOptions]);

  useEffect(() => {
    if (selectedTime && !availableTimeSlotSet.has(selectedTime)) {
      setSelectedTime(null);
    }
  }, [availableTimeSlotSet, selectedTime]);

  const keepBookingCardInView = () => {
    if (typeof window === 'undefined') return;

    window.setTimeout(() => {
      const target = bookingCardRef.current ?? bookingSectionRef.current;
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 0);
  };

  const handleNext = () => {
    if (step < stepLabels.length) {
      setStep(step + 1);
      keepBookingCardInView();
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      keepBookingCardInView();
    }
  };
  const handleChangeService = () => {
    setSelectedService(null);
    setSelectedOptionIds([]);
    keepBookingCardInView();
  };
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
          staffId: selectedStaffId ?? undefined,
          optionIds: selectedOptionIds,
          date: selectedDate,
          time: selectedTime,
          customer: {
            name: customerDetails.name,
            phone: customerDetails.phone,
            email: customerDetails.email,
          },
          note: [
            customerDetails.note,
            selectedOptionLabels ? `Selected options: ${selectedOptionLabels}` : null,
            `Total: ${formatPrice(selectedTotalPrice)}`,
            `Estimated time: ${formatDurationLabel(selectedTotalDuration)}`,
          ].filter(Boolean).join('\n'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to submit booking.');
      }

      setBookingCode(data.booking.bookingCode);
      setIsConfirmed(true);
      keepBookingCardInView();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit booking.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNewBooking = () => {
    setStep(1); setSelectedService(null); setSelectedDate(null);
    setSelectedOptionIds([]); setSelectedTime(null); setCustomerDetails({ name: '', phone: '', email: '', note: '' });
    setBookingCode(null); setSubmitError(null); setIsConfirmed(false);
  };

  const canProceed = [
    selectedService !== null && selectedOptions.length > 0,
    selectedDate !== null && selectedTime !== null && (barbers.length === 0 || selectedStaffId !== null),
    !!(customerDetails.name && customerDetails.phone),
    true,
  ][step - 1];

  const summaryRows = [
    { icon: Scissors, label: 'Service', value: selectedService?.name ?? 'Select service' },
    { icon: CalendarIcon, label: 'Date', value: selectedDateChip?.fullLabel ?? 'Select date' },
    { icon: Clock, label: 'Time', value: selectedTime ? formatTimeLabel(selectedTime) : 'Select time' },
    { icon: User, label: selectedStaffRoleLabel, value: selectedStaff?.name ?? (barbers.length > 0 ? `Select ${selectedStaffRoleLabel.toLowerCase()}` : 'Any available') },
  ];

  const confirmRows = [
    { label: 'Service', value: selectedService?.name },
    { label: 'Options', value: selectedOptionLabels },
    { label: 'Date', value: selectedDateChip?.fullLabel },
    { label: 'Time', value: selectedTime ? formatTimeLabel(selectedTime) : null },
    { label: selectedStaffRoleLabel, value: selectedStaff?.name ?? 'Any available' },
    { label: 'Duration', value: selectedTotalDuration ? formatDurationLabel(selectedTotalDuration) : selectedService?.duration },
    { label: 'Price', value: formatPrice(selectedTotalPrice) },
    { label: 'Customer', value: customerDetails.name },
    { label: 'Contact', value: customerDetails.phone },
  ];

  if (isConfirmed) {
    return (
      <section ref={bookingSectionRef} id="booking" className="salon-booking booking-app-shell booking-confirmation-shell">
        <div className="salon-booking__inner booking-app-inner">
          <div ref={bookingCardRef} className="booking-confirmation-card booking-app-card">
            <div className="booking-confirmation-icon">
              <CheckCircle aria-hidden="true" />
            </div>
            <p className="booking-app-eyebrow">Request sent</p>
            <h2>Booking Confirmed!</h2>
            <p className="booking-confirmation-copy">
              Your appointment request has been submitted successfully.
            </p>

            <div className="booking-summary-card">
              <div className="booking-summary-row">
                <span>Booking ID</span>
                <strong>{bookingCode}</strong>
              </div>
              {confirmRows.slice(0, 7).map(({ label, value }) => (
                <div key={label} className="booking-summary-row">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
              <div className="booking-summary-row">
                <span>Status</span>
                <strong className="booking-status-pill">Pending Confirmation</strong>
              </div>
            </div>

            <p className="booking-confirmation-copy">
              The salon will contact you at <strong>{customerDetails.phone}</strong> to confirm.
            </p>

            <div className="booking-confirmation-actions">
              <button type="button" onClick={handleNewBooking} className="booking-primary-action">
                Book Another
              </button>
              <a href="tel:+94715729660" className="booking-secondary-action">
                Call Salon
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={bookingSectionRef} id="booking" className="salon-booking booking-app-shell">
      <div className="salon-booking__inner booking-app-inner">
        <div className="booking-app-header">
          <p className="booking-app-eyebrow">Easy Booking</p>
          <h2>
            Book Appointment
            <Sparkles aria-hidden="true" />
          </h2>
          <p>Choose your service, date and time.</p>
          {loadError && <p className="booking-notice">{loadError}</p>}
        </div>

        <div className="booking-app-stepper" aria-label="Booking progress">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const state = getBookingStepState(stepNumber, step);

            return (
              <div key={label} className={`booking-step booking-step--${state}`}>
                <div className="booking-step__dot" aria-current={state === 'active' ? 'step' : undefined}>
                  {state === 'completed' ? <Check size={17} aria-hidden="true" /> : stepNumber}
                </div>
                <span>{label}</span>
                {stepNumber < stepLabels.length && <div className="booking-step__line" aria-hidden="true" />}
              </div>
            );
          })}
        </div>

        <div className={selectedService ? 'booking-content-grid booking-content-grid--with-summary' : 'booking-content-grid'}>
          <div ref={bookingCardRef} className="booking-app-card">
            {step === 1 && (
              <div className="booking-step-panel">
                <div className="booking-panel-heading">
                  <Scissors aria-hidden="true" />
                  <div>
                    <p>{selectedService ? 'Selected Service' : 'Choose Service'}</p>
                    <h3>{selectedService ? selectedService.name : 'Select your salon service'}</h3>
                  </div>
                </div>

                {!selectedService ? (
                  <div className="booking-service-grid">
                    {services.map((service) => {
                      const serviceImage = getSalonService(service.id)?.image;

                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => selectService(service)}
                          className="booking-service-card"
                        >
                          {serviceImage && <img src={serviceImage} alt="" />}
                          <span>
                            <strong>{service.name}</strong>
                            <small>{service.description}</small>
                          </span>
                          <em>{service.duration}</em>
                          <b>{formatPrice(service.price)}</b>
                          <ChevronRight size={18} aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="booking-option-stack">
                    <div className="booking-selected-service">
                      {selectedServiceImage && <img src={selectedServiceImage} alt="" />}
                      <div>
                        <p>{selectedService.name}</p>
                        <span>{selectedOptionLabels || 'Choose one or more options'}</span>
                        <small>
                          <Clock size={15} aria-hidden="true" />
                          {selectedTotalDuration ? formatDurationLabel(selectedTotalDuration) : selectedService.duration}
                          <b>{formatPrice(selectedTotalPrice)}</b>
                        </small>
                      </div>
                      <span className="booking-count-pill">{selectedOptionCountLabel}</span>
                    </div>

                    <div className="booking-option-list">
                      {selectedServiceOptions.map((option) => {
                        const isChecked = selectedOptionIds.includes(option.id);

                        return (
                          <label key={option.id} className={`booking-option-row ${isChecked ? 'is-selected' : ''}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleOptionToggle(option.id)}
                            />
                            <span>
                              <strong>{option.name}</strong>
                              <small>{formatDurationLabel(option.duration)}</small>
                            </span>
                            <b>{formatPrice(option.price)}</b>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="booking-step-panel">
                <div className="booking-panel-heading">
                  <CalendarIcon aria-hidden="true" />
                  <div>
                    <p>Date & Time</p>
                    <h3>Select your appointment slot</h3>
                  </div>
                </div>

                {isAvailabilityLoading && <p className="booking-notice">Refreshing available slots...</p>}

                {selectedService && (
                  <div className="booking-selected-service booking-selected-service--compact">
                    {selectedServiceImage && <img src={selectedServiceImage} alt="" />}
                    <div>
                      <p>{selectedService.name}</p>
                      <span>{selectedOptionLabels}</span>
                    </div>
                    <span className="booking-count-pill">{selectedOptionCountLabel}</span>
                  </div>
                )}

                <div className="booking-control-block">
                  <div className="booking-control-heading">
                    <h4>Select Date</h4>
                    {selectedDateChip && <span>{selectedDateChip.month} {selectedDate?.slice(0, 4)}</span>}
                  </div>
                  <div className="booking-date-strip" role="listbox" aria-label="Available dates">
                    {dates.map((dateOption) => {
                      const chip = getDateChipParts(dateOption.date, dateOption.label);
                      const isSelected = selectedDate === dateOption.date;

                      return (
                        <button
                          key={dateOption.date}
                          type="button"
                          className={`booking-date-chip ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => {
                            setSelectedDate(dateOption.date);
                            setSelectedTime(null);
                          }}
                          aria-label={`Select ${chip.fullLabel}`}
                          aria-selected={isSelected}
                        >
                          <span>{chip.weekday}</span>
                          <strong>{chip.day || dateOption.label}</strong>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="booking-control-block">
                  <div className="booking-control-heading">
                    <h4>Select Time</h4>
                    {selectedTime && selectedTimeEnd && <span>{formatTimeLabel(selectedTime)} - {formatTimeLabel(selectedTimeEnd)}</span>}
                  </div>
                  <div className="booking-time-strip" role="listbox" aria-label="Available times">
                    {allTimeSlots.map((time) => {
                      const isAvailable = availableTimeSlotSet.has(time);
                      const isBooked = bookedTimeSlotSet.has(time);
                      const isSelected = selectedTime === time;
                      const isHeld = !isSelected && heldTimeSlotSet.has(time);

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            if (isAvailable) setSelectedTime(time);
                          }}
                          className={`booking-time-chip ${isSelected ? 'is-selected' : ''} ${isHeld ? 'is-held' : ''}`}
                          disabled={!isAvailable}
                          aria-label={`${formatTimeLabel(time)} ${isBooked ? 'booked' : isAvailable ? 'available' : 'unavailable'}`}
                          aria-selected={isSelected}
                        >
                          <strong>{formatTimeLabel(time)}</strong>
                          {!isAvailable && <span>{isBooked ? 'Booked' : 'Unavailable'}</span>}
                          {isHeld && <span>Held</span>}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedDate && <p className="booking-helper-text">Pick a date to see available time slots.</p>}
                  {selectedDate && availableTimeSlots.length === 0 && (
                    <p className="booking-helper-text">
                      No available slots for {selectedStaff?.name ?? `this ${selectedStaffRoleLabel.toLowerCase()}`} on this date. Please choose another {selectedStaffRoleLabel.toLowerCase()} or date.
                    </p>
                  )}
                </div>

                {barbers.length > 0 && (
                  <div className="booking-control-block">
                    <div className="booking-control-heading">
                      <h4>Choose Your {selectedStaffRoleLabel}</h4>
                      {selectedStaff && <span>{selectedStaff.name}</span>}
                    </div>
                    <div className="booking-stylist-strip" role="listbox" aria-label={`Choose ${selectedStaffRoleLabel}`}>
                      {barbers.map((barber) => {
                        const isSelected = selectedStaffId === barber.id;
                        const barberSlots = selectedDateOption?.staffSlots?.[barber.id] ?? [];
                        const avatarUrl = barberAvatarUrl(barber);

                        return (
                          <button
                            key={barber.id}
                            type="button"
                            className={`booking-stylist-card ${isSelected ? 'is-selected' : ''}`}
                            aria-label={`Select ${barber.name}`}
                            aria-selected={isSelected}
                            title={`${barber.name}${barber.isMain ? ` - Main ${selectedStaffRoleLabel.toLowerCase()}` : ` - ${barberSlots.length} slots available`}`}
                            onClick={() => {
                              setSelectedStaffId(barber.id);
                              if (selectedTime && !barberSlots.includes(selectedTime)) {
                                setSelectedTime(null);
                              }
                            }}
                          >
                            <span className="booking-stylist-avatar">
                              {avatarUrl ? <img src={avatarUrl} alt="" /> : <User aria-hidden="true" />}
                              {isSelected && <Check size={15} aria-hidden="true" />}
                            </span>
                            <strong>{barber.name.split(' ')[0]}</strong>
                            <small>{barber.isMain ? 'Main stylist' : `${barberSlots.length} slots`}</small>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="booking-step-panel">
                <div className="booking-panel-heading">
                  <User aria-hidden="true" />
                  <div>
                    <p>Your Details</p>
                    <h3>Where should we confirm?</h3>
                  </div>
                </div>
                <div className="booking-details-card">
                  {[
                    { label: 'Full Name *', type: 'text', key: 'name', placeholder: 'Enter your full name' },
                    { label: 'Mobile Number *', type: 'tel', key: 'phone', placeholder: '07X XXX XXXX' },
                    { label: 'Email Address (Optional)', type: 'email', key: 'email', placeholder: 'your@email.com' },
                  ].map(({ label, type, key, placeholder }) => (
                    <label key={key} className="booking-field">
                      <span>{label}</span>
                      <input
                        type={type}
                        value={customerDetails[key as keyof typeof customerDetails]}
                        onChange={(event) => setCustomerDetails({ ...customerDetails, [key]: event.target.value })}
                        placeholder={placeholder}
                      />
                    </label>
                  ))}
                  <label className="booking-field">
                    <span>Special Note (Optional)</span>
                    <textarea
                      value={customerDetails.note}
                      onChange={(event) => setCustomerDetails({ ...customerDetails, note: event.target.value })}
                      rows={4}
                      placeholder="Any special requests or requirements..."
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="booking-step-panel">
                <div className="booking-panel-heading">
                  <CheckCircle aria-hidden="true" />
                  <div>
                    <p>Confirm</p>
                    <h3>Review your booking</h3>
                  </div>
                </div>
                <div className="booking-summary-card">
                  {confirmRows.map(({ label, value }) => (
                    <div key={label} className="booking-summary-row">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                {submitError && <p className="booking-error-text">{submitError}</p>}
                {isUsingFallbackBookingOptions && (
                  <p className="booking-notice">Online booking is not connected yet. These slots are shown for preview only.</p>
                )}
              </div>
            )}

            <div className="booking-navigation">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="booking-secondary-action">
                  <ChevronLeft size={18} aria-hidden="true" />
                  Back
                </button>
              ) : selectedService ? (
                <button type="button" onClick={handleChangeService} className="booking-secondary-action">
                  <ChevronLeft size={18} aria-hidden="true" />
                  Back
                </button>
              ) : <span />}

              {step < stepLabels.length ? (
                <button type="button" onClick={handleNext} disabled={!canProceed} className="booking-primary-action">
                  Continue
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting || isUsingFallbackBookingOptions}
                  className="booking-primary-action"
                >
                  {isSubmitting ? 'Submitting...' : isUsingFallbackBookingOptions ? 'Booking Offline' : 'Confirm Booking'}
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {selectedService && (
            <aside className="booking-live-summary" aria-label="Booking summary">
              <div className="booking-live-summary__header">
                <h3>Booking Summary</h3>
                <span>Total Amount</span>
                <strong>{formatPrice(selectedTotalPrice)}</strong>
              </div>
              <div className="booking-live-summary__rows">
                {summaryRows.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="booking-live-row">
                    <Icon size={17} aria-hidden="true" />
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="booking-safety-pill">
                <ShieldCheck size={17} aria-hidden="true" />
                <strong>Hygiene First</strong>
                <span>Clean & Safe</span>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
