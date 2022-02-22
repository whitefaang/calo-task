import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Props for countown hook
 */
type Props = {
  /**
   * The last point of the counter
   */
  until: number;
};

/**
 *  convertts milliseconds to a human readable timestamp
 * @param {number} ms
 * @returns {string} timestamp
 */
const milliSecondsToTimeStamp = (ms: number) => {
  const secs = ms / 1000;
  const hours = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);
  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * useCountdown Hook
 */
function useCountdown({ until }: Props) {
  // get the initial time diffeence used to calculate the percentage of complettion of the job
  const initialTime = useRef(until - Date.now());

  // eta state maintained to keep the remaining time and percentage of completeion
  const [eta, setEta] = useState({
    time: initialTime.current,
    percent: 0,
  });
  useEffect(() => {
    // start reducing initial time by 1 second
    // and calculate percentage accordingly
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev.time <= 1000) {
          clearInterval(interval);
          return { time: 0, percent: 100 };
        }
        const time = prev.time - 1000;
        return {
          time,
          percent: parseFloat(
            (100 - (time * 100) / initialTime.current).toFixed(2)
          ),
        };
      });
    }, 1000);
  }, []);

  // get human readable countdown stamp from the remaining time to complete the job
  const countdown = useMemo(() => {
    const count = milliSecondsToTimeStamp(eta.time);
    return count;
  }, [eta.time]);

  return {
    percent: eta.percent,
    timer: countdown,
  };
}

export default useCountdown;
