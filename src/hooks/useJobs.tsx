import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import useStorage from "./useStorage";

/**
 * Model of the Job
 */
export interface IJob {
  id: string;
  name: string;
  result: string;
  createdAt: Date;
  resolvedAt: null | Date;
  _estimatedResolutionAt: Date;
}

/**
 * gets random time with 5 seconds as a stepper upto 5 minutes
 * @returns {number} in milliseconds
 */
const getRandomTime = () => {
  return (
    ((Math.ceil(Math.floor(Math.random() * 10 * 1000) / 5) * 5) % 300) * 1000
  );
};

/**
 * gets a random image from unsplash api
 * @returns {string} base64 string of image
 */
const getRandomPic = () => {
  return fetch("https://source.unsplash.com/1920x1080/?food")
    .then((res) => res.blob())
    .then((res) => blobToBase64(res) as unknown as string);
};

/**
 * converts blob to base64
 * @param blob
 * @returns {Promise<string>}
 */
const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

/**
 * holds execution of the function for certain time. Cleaner than setTimeout.
 * @param {number} timeout how long should the function wait
 * @returns {void}
 */
const sleep = (timeout: number): Promise<void> =>
  new Promise((res) =>
    setTimeout(() => {
      res();
    }, timeout)
  );

function useTask() {
  // state of all the jobs
  const [jobs, setJobs] = useState<IJob[]>([]);

  // state for thr input field of jobs
  const [jobName, setJobName] = useState("");

  // store of jobs from the browser storage
  const jobStore = useStorage<IJob[]>("jobs");

  // function to execute the job called after job created
  const jobExec = useCallback(async (job: IJob) => {
    const result = await getRandomPic();
    await sleep(job._estimatedResolutionAt.getTime() - Date.now() || 0);
    setJobs((prev) => {
      const newJobs = prev.map((t) => {
        if (t.id === job.id) {
          return { ...t, resolvedAt: new Date(), result };
        }
        return t;
      });
      jobStore.set(newJobs);
      return newJobs;
    });
  }, []);

  // internal method to add a job
  // sets the new job in state and in the browser storage
  const _addJob = (job: IJob) => {
    setJobs((prev) => {
      const newJobs = [job, ...prev];
      jobStore.set(newJobs);
      return newJobs;
    });
    if (job.result === "pending") {
      jobExec(job);
    }
  };

  // add method provided to the submission of the job name from the user
  const add = (e?: any) => {
    e?.preventDefault();
    // id of the job
    const id = nanoid();
    // get a random time for the execution of the job
    const estimatedResolutionIn = getRandomTime();
    // clear the input field for job
    setJobName("");
    // add the job to state and persistant storage
    _addJob({
      id,
      name: jobName || "Unknown",
      createdAt: new Date(),
      resolvedAt: null,
      result: "pending",
      _estimatedResolutionAt: new Date(Date.now() + estimatedResolutionIn),
    });
  };

  // onmount; check if any jobs available in browser storage
  useEffect(() => {
    jobStore.get().map((j: IJob) => {
      const _estimatedResolutionAt = new Date(j._estimatedResolutionAt);
      _addJob({
        ...j,
        createdAt: new Date(j.createdAt),
        resolvedAt: j.resolvedAt ? new Date(j.resolvedAt) : j.resolvedAt,
        _estimatedResolutionAt,
      });
    });
  }, []);

  return { add, jobs, form: { name: jobName, set: setJobName } };
}

export default useTask;
