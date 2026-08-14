/**
 * Centralized Semantic Design Tokens for StudyMap Learning Map
 * 80% Neutral / 20% Semantic Color
 */

export const LEARNING_STATE_COLORS = {
  learned: {
    primary: '#6F8F78',
    text: '#506858',
    light: '#E8EFE9',
    icon: '✓',
    label: 'LEARNED',
  },
  current: {
    primary: '#F4C94A',
    text: '#2B2925',
    light: '#FFF9E6',
    icon: '●',
    label: 'CURRENT',
  },
  available: {
    primary: '#5C7FA3',
    text: '#4A6987',
    light: '#E9F0F6',
    icon: '○',
    label: 'READY NEXT',
  },
  locked: {
    primary: '#A8A6A1',
    text: '#8F8C87',
    light: '#F1EFEB',
    icon: '—',
    label: 'LOCKED',
  },
};

export const CONNECTION_COLORS = {
  activeThread: {
    stroke: '#5A5750',
    strokeWidth: 2.5,
    dasharray: 'none',
  },
  selected: {
    stroke: '#4A4844',
    strokeWidth: 1.5,
    dasharray: 'none',
  },
  normal: {
    stroke: '#D4D1CB',
    strokeWidth: 1,
    dasharray: 'none',
  },
  locked: {
    stroke: '#DDDAD4',
    strokeWidth: 1,
    dasharray: '4 5',
  },
};

export const COURSE_STAGES = [
  { id: 'foundations', title: 'FOUNDATIONS', week: 'Week 01' },
  { id: 'optimization', title: 'OPTIMIZATION', week: 'Week 02' },
  { id: 'generalization', title: 'GENERALIZATION', week: 'Week 03' },
];
