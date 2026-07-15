export type BookingStepState = 'completed' | 'active' | 'upcoming';

export type DateChipParts = {
  weekday: string;
  day: string;
  month: string;
  fullLabel: string;
};

export function getBookingStepState(stepNumber: number, currentStep: number): BookingStepState {
  if (stepNumber < currentStep) return 'completed';
  if (stepNumber === currentStep) return 'active';
  return 'upcoming';
}

export function getDateChipParts(date: string, fallbackLabel = date): DateChipParts {
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
