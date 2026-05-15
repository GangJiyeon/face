export const SKIN_STATUS_THRESHOLDS = {
  redness:    { good: 40, caution: 70 },
  tone:       { good: 40, caution: 70 },
  brightness: { good: 60, caution: 40 },
  trouble:    { good: 30, caution: 60 },
  moisture:   { good: 60, caution: 40 },
}

export const SKIN_LABELS = {
  redness:    { good: 'Calm', caution: 'Slightly red', bad: 'Red' },
  tone:       { good: 'Even', caution: 'Slightly uneven', bad: 'Uneven' },
  brightness: { good: 'Bright', caution: 'Moderate', bad: 'Dull' },
  trouble:    { good: 'Clear', caution: 'Slight trouble', bad: 'Trouble' },
  moisture:   { good: 'Hydrated', caution: 'Moderate', bad: 'Dry' },
}