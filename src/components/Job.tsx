import React, { useMemo } from "react";
import useCountdown from "../hooks/useCountdown";
import { IJob } from "../hooks/useJobs";

/**
 * Job component
 */
function Job({ name, resolvedAt, _estimatedResolutionAt }: IJob) {
  // countdown control used to get the timer and the percentage of the job
  const countdownCtrl = useCountdown({
    until: _estimatedResolutionAt.getTime(),
  });

  // when the countdown timer reaches "0:0:0", show a custom message instead of time
  // custom message goes "Completed on <timestamp>"
  const countdown = useMemo(() => {
    if (countdownCtrl.timer === "0:0:0") {
      return `Completed on ${resolvedAt?.toLocaleDateString()}, ${resolvedAt?.toLocaleTimeString()}`;
    }
    return countdownCtrl.timer;
  }, [countdownCtrl.timer]);

  return (
    <div
      className="p-5 border mb-3 rounded-lg relative overflow-hidden"
      title={name}
    >
      <div
        className="absolute h-full bg-color top-0 left-0 bg-opacity-20"
        style={{ width: `${countdownCtrl.percent}%` }}
      ></div>
      <p className="text-3xl font-title truncate">{name}</p>
      <div className="flex flex-col md:flex-row justify-between">
        <span className="font-bold">{countdownCtrl.percent}%</span>
        <span className="font-bold">{countdown}</span>
      </div>
    </div>
  );
}

export default Job;
