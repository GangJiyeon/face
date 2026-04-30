export const SKIN_STATUS_THRESHOLDS = {
  redness:    { good: 40, caution: 70 },
  tone:       { good: 40, caution: 70 },
  brightness: { good: 60, caution: 40 },
  trouble:    { good: 30, caution: 60 },
  moisture:   { good: 60, caution: 40 },
}

export const SKIN_LABELS = {
  redness:    { good: '진정됨', caution: '약간 붉음', bad: '붉음' },
  tone:       { good: '균일', caution: '약간 불균일', bad: '불균일' },
  brightness: { good: '밝음', caution: '보통', bad: '칙칙함' },
  trouble:    { good: '깨끗', caution: '약간 있음', bad: '트러블' },
  moisture:   { good: '촉촉', caution: '보통', bad: '건조' },
}