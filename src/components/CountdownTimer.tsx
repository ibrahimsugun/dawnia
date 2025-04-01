import React, { useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';

interface CountdownTimerProps {
  endTime: number;
  onComplete?: () => void;
}

export function CountdownTimer({ endTime, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const distance = endTime - now;

      if (distance <= 0) {
        setTimeLeft('Complete');
        onComplete?.();
        return;
      }

      setTimeLeft(formatDistance(now, endTime, { includeSeconds: true }));
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [endTime, onComplete]);

  return (
    <div className="text-sm text-amber-200/80">
      {timeLeft === 'Complete' ? 'Complete!' : `${timeLeft} remaining`}
    </div>
  );
}