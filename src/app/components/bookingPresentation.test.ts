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
