import { formatDuration, intervalToDuration, isBefore } from 'date-fns';

export const getTimeRemaining = (endTime: string): string => {
  const now = new Date();
  const end = new Date(endTime);

  if (isBefore(end, now)) return '00:00:00';

  const duration = intervalToDuration({ start: now, end });

  return formatDuration(duration, {
    format: ['hours', 'minutes', 'seconds'],
    zero: true,
  });
};
