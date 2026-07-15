import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  CheckCircle,
  Crown,
  Droplet,
  Hand,
  Heart,
  List,
  Mail,
  NotebookPen,
  Palette,
  Phone,
  Scissors,
  Sparkles,
  Tag,
  Wind,
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
  onFlowActiveChange?: (isActive: boolean) => void;
};

const fallbackServices: PublicService[] = publicSalonServices;

const stepLabels = ['Service', 'Date & Time', 'Details', 'Confirm'];

const bookingServiceIcons = {
  'hair-cutting': Scissors,
  'hair-styling': Sparkles,
  'manicure-pedicure': Hand,
  'waxing-threading': Wind,
  'fire-cut-dreadlocks': Droplet,
  'tattoo-piercing': Heart,
  makeup: Palette,
  'bridal-dressing': Crown,
  'groom-dressing': Crown,
  'facial-cleanup': Sparkles,
};

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

export function Booking({ requestedService, onFlowActiveChange }: BookingProps) {
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
          setSelectedStaffId((current) => current ?? null);
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
    setStep(2);
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

  const handleServiceSelect = (service: PublicService) => {
    selectService(service);
    setStep(2);
    keepBookingCardInView();
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
    if (barbers.length > 0 && !selectedStaffId) return [];
    return selectedStaffId ? (day.staffSlots?.[selectedStaffId] ?? []) : day.slots;
  }, [barbers.length, dates, selectedDate, selectedStaffId]);
  const allTimeSlots = useMemo(() => {
    return dates.find((date) => date.date === selectedDate)?.allSlots ?? (selectedDate ? defaultTimeSlots : []);
  }, [dates, selectedDate]);
  const bookedTimeSlots = useMemo(() => {
    const day = dates.find((date) => date.date === selectedDate);
    if (!day) return [];
    if (barbers.length > 0 && !selectedStaffId) return [];
    return selectedStaffId ? (day.staffBookedSlots?.[selectedStaffId] ?? []) : day.bookedSlots;
  }, [barbers.length, dates, selectedDate, selectedStaffId]);
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
  const shouldChooseStaffFirst = barbers.length > 0;
  const staffSlotTotals = useMemo(() => {
    return barbers.reduce<Record<string, number>>((totals, barber) => {
      totals[barber.id] = dates.reduce((count, date) => count + (date.staffSlots?.[barber.id]?.length ?? 0), 0);
      return totals;
    }, {});
  }, [barbers, dates]);
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
            return null;
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

  useEffect(() => {
    if (!shouldChooseStaffFirst) return;

    if (!selectedStaffId) {
      if (selectedDate) setSelectedDate(null);
      if (selectedTime) setSelectedTime(null);
      return;
    }

    if (selectedDate) {
      const slots = selectedDateOption?.staffSlots?.[selectedStaffId] ?? [];
      if (slots.length === 0) {
        setSelectedDate(null);
        setSelectedTime(null);
      }
    }
  }, [selectedDate, selectedDateOption, selectedStaffId, selectedTime, shouldChooseStaffFirst]);

  const keepBookingCardInView = (align: 'start' | 'card' = 'card') => {
    if (typeof window === 'undefined') return;

    window.setTimeout(() => {
      const target = bookingCardRef.current ?? bookingSectionRef.current;
      if (!target) return;

      const scrollParent = target.closest('.mobile-section-view') as HTMLElement | null;

      if (scrollParent) {
        if (align === 'start') {
          scrollParent.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const parentRect = scrollParent.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const nextTop = scrollParent.scrollTop + (targetRect.top - parentRect.top) - 12;
        scrollParent.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' });
        return;
      }

      if (align === 'start') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 50);
  };

  const handleNext = () => {
    if (step < stepLabels.length) {
      setStep(step + 1);
      keepBookingCardInView();
    }
  };

  const handleStepNext = () => {
    if (step === stepLabels.length) {
      handleConfirmBooking();
      return;
    }

    handleNext();
  };
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedService(null);
      setSelectedOptionIds([]);
      setSelectedDate(null);
      setSelectedTime(null);
      keepBookingCardInView();
      return;
    }

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
      keepBookingCardInView('start');
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
  const isBookingFlowActive = step > 1 || selectedService !== null;

  useEffect(() => {
    onFlowActiveChange?.(isBookingFlowActive);
  }, [isBookingFlowActive, onFlowActiveChange]);

  useEffect(() => () => {
    onFlowActiveChange?.(false);
  }, [onFlowActiveChange]);

  const summaryRows = [
    { icon: Scissors, label: 'Service', value: selectedService?.name ?? 'Select service' },
    { icon: CalendarIcon, label: 'Date', value: selectedDateChip?.fullLabel ?? 'Select date' },
    { icon: Clock, label: 'Time', value: selectedTime ? formatTimeLabel(selectedTime) : 'Select time' },
    { icon: User, label: 'Staff', value: selectedStaff?.name ?? (barbers.length > 0 ? `Select ${selectedStaffRoleLabel.toLowerCase()}` : 'Any available') },
  ];

  const confirmRows = [
    { icon: Scissors, label: 'Service', value: selectedService?.name },
    { icon: List, label: 'Options', value: selectedOptionLabels },
    { icon: CalendarIcon, label: 'Date', value: selectedDateChip?.fullLabel },
    { icon: Clock, label: 'Time', value: selectedTime ? formatTimeLabel(selectedTime) : null },
    { icon: User, label: selectedStaffRoleLabel, value: selectedStaff?.name ?? 'Any available' },
    { icon: Clock, label: 'Duration', value: selectedTotalDuration ? formatDurationLabel(selectedTotalDuration) : selectedService?.duration },
    { icon: User, label: 'Customer', value: customerDetails.name },
    { icon: Phone, label: 'Contact', value: customerDetails.phone },
  ];

  if (isConfirmed) {
    return (
      <section ref={bookingSectionRef} id="booking" className="salon-booking booking-app-shell booking-confirmation-shell mobile-booking-page">
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
    <section ref={bookingSectionRef} id="booking" className="salon-booking booking-app-shell mobile-booking-page">
      <div className="salon-booking__inner booking-app-inner">
        <div className="booking-app-header">
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

        {isBookingFlowActive && (
          <div className="booking-step-actions">
            <button
              type="button"
              onClick={step > 1 ? handleBack : handleChangeService}
              className="booking-secondary-action"
            >
              <ChevronLeft size={18} aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              onClick={handleStepNext}
              disabled={
                step === stepLabels.length
                  ? isSubmitting || isUsingFallbackBookingOptions
                  : !canProceed
              }
              className="booking-primary-action"
            >
              Next
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}

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
                      const ServiceIcon = bookingServiceIcons[service.id as keyof typeof bookingServiceIcons] ?? Sparkles;

                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleServiceSelect(service)}
                          className="booking-service-card"
                        >
                          {serviceImage && <img src={serviceImage} alt="" />}
                          <span className="booking-service-card__copy">
                            <span className="booking-service-card__icon">
                              <ServiceIcon size={15} aria-hidden="true" />
                            </span>
                            <strong>{service.name}</strong>
                          </span>
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
                  <div className="booking-selected-service booking-selected-service--compact booking-selected-service--with-options">
                    <div className="booking-selected-service__main">
                      {selectedServiceImage && <img src={selectedServiceImage} alt="" />}
                      <div className="booking-selected-service__copy">
                        <p>{selectedService.name}</p>
                        <span className="booking-selected-service__description">{selectedService.description}</span>
                        <small className="booking-selected-service__meta">
                          <Clock size={13} aria-hidden="true" />
                          {formatDurationLabel(selectedTotalDuration)}
                          <b>{formatPrice(selectedTotalPrice)}</b>
                        </small>
                      </div>
                      <div className="booking-selected-service__side">
                        <span className="booking-count-pill">{selectedOptionCountLabel}</span>
                        <ChevronRight size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <div className="booking-service-options" aria-label={`${selectedService.name} options`}>
                      {selectedServiceOptions.map((option) => {
                        const isChecked = selectedOptionIds.includes(option.id);

                        return (
                          <label key={option.id} className={`booking-service-option-row ${isChecked ? 'is-selected' : ''}`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleOptionToggle(option.id)}
                            />
                            <span>{option.name}</span>
                            <small>{formatDurationLabel(option.duration)}</small>
                            <b>{formatPrice(option.price)}</b>
                          </label>
                        );
                      })}
                      <div className="booking-service-total-row">
                        <span>
                          <Tag size={14} aria-hidden="true" />
                          Total
                        </span>
                        <small>{formatDurationLabel(selectedTotalDuration)}</small>
                        <b>{formatPrice(selectedTotalPrice)}</b>
                      </div>
                    </div>
                  </div>
                )}

                {barbers.length > 0 && (
                  <div className="booking-control-block booking-control-block--picker-card booking-control-block--staff-card">
                    <div className="booking-control-heading">
                      <h4>Choose Your {selectedStaffRoleLabel}</h4>
                    </div>
                    <div className="booking-stylist-strip" role="listbox" aria-label={`Choose ${selectedStaffRoleLabel}`}>
                      {barbers.map((barber) => {
                        const isSelected = selectedStaffId === barber.id;
                        const dateSlots = selectedDateOption?.staffSlots?.[barber.id] ?? [];
                        const availableSlotCount = selectedDate ? dateSlots.length : (staffSlotTotals[barber.id] ?? 0);
                        const avatarUrl = barberAvatarUrl(barber);

                        return (
                          <button
                            key={barber.id}
                            type="button"
                            className={`booking-stylist-card ${isSelected ? 'is-selected' : ''}`}
                            aria-label={`Select ${barber.name}`}
                            aria-selected={isSelected}
                            aria-pressed={isSelected}
                            title={`${barber.name} - ${availableSlotCount} slots available`}
                            onClick={() => {
                              setSelectedStaffId(barber.id);
                              if (selectedDate && dateSlots.length === 0) {
                                setSelectedDate(null);
                              }
                              if (selectedTime && !dateSlots.includes(selectedTime)) {
                                setSelectedTime(null);
                              }
                            }}
                          >
                            <span className="booking-stylist-avatar">
                              {avatarUrl ? <img src={avatarUrl} alt="" /> : <User aria-hidden="true" />}
                              {isSelected && <Check size={15} aria-hidden="true" />}
                            </span>
                            <strong>{barber.name.split(' ')[0]}</strong>
                            <small>{barber.isMain ? `Main ${selectedStaffRoleLabel.toLowerCase()}` : `${availableSlotCount} slots`}</small>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className={`booking-control-block booking-control-block--picker-card ${shouldChooseStaffFirst && !selectedStaffId ? 'is-disabled' : ''}`}>
                  <div className="booking-control-heading">
                    <h4>Select Date</h4>
                    {selectedDateChip && <span>{selectedDateChip.month} {selectedDate?.slice(0, 4)}</span>}
                  </div>
                  {shouldChooseStaffFirst && !selectedStaffId ? (
                    <p className="booking-helper-text">Choose your {selectedStaffRoleLabel.toLowerCase()} to see available dates.</p>
                  ) : (
                    <div className="booking-date-strip" role="listbox" aria-label="Available dates">
                      {dates.map((dateOption) => {
                        const chip = getDateChipParts(dateOption.date, dateOption.label);
                        const isSelected = selectedDate === dateOption.date;
                        const isAvailableForStaff = !selectedStaffId || (dateOption.staffSlots?.[selectedStaffId]?.length ?? 0) > 0;
                        const isDisabled = shouldChooseStaffFirst ? (!selectedStaffId || !isAvailableForStaff) : false;

                        return (
                          <button
                            key={dateOption.date}
                            type="button"
                            className={`booking-date-chip ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => {
                              if (isDisabled) return;
                              setSelectedDate(dateOption.date);
                              setSelectedTime(null);
                            }}
                            disabled={isDisabled}
                            aria-label={`Select ${chip.fullLabel}`}
                            aria-selected={isSelected}
                            aria-pressed={isSelected}
                          >
                            <span>{chip.weekday}</span>
                            <strong>{chip.day || dateOption.label}</strong>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={`booking-control-block booking-control-block--picker-card ${shouldChooseStaffFirst && (!selectedStaffId || !selectedDate) ? 'is-disabled' : ''}`}>
                  <div className="booking-control-heading">
                    <h4>Select Time</h4>
                    {selectedTime && selectedTimeEnd && <span>{formatTimeLabel(selectedTime)} - {formatTimeLabel(selectedTimeEnd)}</span>}
                  </div>
                  {shouldChooseStaffFirst && !selectedStaffId ? (
                    <p className="booking-helper-text">Choose your {selectedStaffRoleLabel.toLowerCase()} before selecting a time.</p>
                  ) : (
                    <div className="booking-time-strip" role="listbox" aria-label="Available times">
                      {allTimeSlots.map((time) => {
                        const isAvailable = availableTimeSlotSet.has(time);
                        const isBooked = bookedTimeSlotSet.has(time);
                        const isSelected = selectedTime === time;
                        const isHeld = !isSelected && heldTimeSlotSet.has(time);
                        const isDisabled = !selectedDate || (shouldChooseStaffFirst && !selectedStaffId) || !isAvailable;

                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedTime(time);
                              }
                            }}
                            className={`booking-time-chip ${isSelected ? 'is-selected' : ''} ${isHeld ? 'is-held' : ''}`}
                            disabled={isDisabled}
                            aria-label={`${formatTimeLabel(time)} ${isBooked ? 'booked' : isAvailable ? 'available' : 'unavailable'}`}
                            aria-selected={isSelected}
                            aria-pressed={isSelected}
                          >
                            <strong>{formatTimeLabel(time)}</strong>
                            {!isAvailable && <span>{isBooked ? 'Booked' : 'Unavailable'}</span>}
                            {isHeld && <span>Held</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {selectedStaffId && !selectedDate && <p className="booking-helper-text">Pick a date to see available time slots.</p>}
                  {selectedDate && availableTimeSlots.length === 0 && (
                    <p className="booking-helper-text">
                      No available slots for {selectedStaff?.name ?? `this ${selectedStaffRoleLabel.toLowerCase()}`} on this date. Please choose another {selectedStaffRoleLabel.toLowerCase()} or date.
                    </p>
                  )}
                </div>
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
                    { icon: User, label: 'Full Name *', type: 'text', key: 'name', placeholder: 'Enter your full name' },
                    { icon: Phone, label: 'Mobile Number *', type: 'tel', key: 'phone', placeholder: '07X XXX XXXX' },
                    { icon: Mail, label: 'Email Address (Optional)', type: 'email', key: 'email', placeholder: 'your@email.com' },
                  ].map(({ icon: Icon, label, type, key, placeholder }) => (
                    <label key={key} className="booking-field">
                      <span>{label}</span>
                      <span className="booking-field__control">
                        <Icon aria-hidden="true" />
                        <input
                          type={type}
                          value={customerDetails[key as keyof typeof customerDetails]}
                          onChange={(event) => setCustomerDetails({ ...customerDetails, [key]: event.target.value })}
                          placeholder={placeholder}
                        />
                      </span>
                    </label>
                  ))}
                  <label className="booking-field">
                    <span>Special Note (Optional)</span>
                    <span className="booking-field__control booking-field__control--textarea">
                      <NotebookPen aria-hidden="true" />
                      <textarea
                        value={customerDetails.note}
                        onChange={(event) => setCustomerDetails({ ...customerDetails, note: event.target.value })}
                        rows={4}
                        placeholder="Any special requests or requirements..."
                      />
                    </span>
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
                <div className="booking-confirm-review-card">
                  {confirmRows.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="booking-confirm-review-row">
                      <span className="booking-confirm-review-row__icon">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="booking-confirm-review-row__label">{label}</span>
                      <strong>{value ?? '-'}</strong>
                    </div>
                  ))}
                </div>
                {submitError && <p className="booking-error-text">{submitError}</p>}
                {isUsingFallbackBookingOptions && (
                  <p className="booking-notice">Online booking is not connected yet. These slots are shown for preview only.</p>
                )}
              </div>
            )}

          </div>

          {selectedService && step !== 4 && (
            <aside className="booking-live-summary" aria-label="Booking summary">
              <div className="booking-live-summary__header">
                <h3>Booking Summary</h3>
                <div className="booking-live-summary__amount">
                  <span>Total Amount</span>
                  <strong>{formatPrice(selectedTotalPrice)}</strong>
                </div>
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
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
