import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import Job from "../components/Job";
import useJobs from "../hooks/useJobs";

/**
 * Dashboard page
 */
function Dashboard() {
  // gets all the necessary states from the useJobs hook
  const jobCtrl = useJobs();

  // input ref for the new task name input field used to focus on the input field
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="container px-3 mx-auto flex flex-wrap h-full py-7">
      {/* job images section */}
      <div id="jobImages" className="flex-1 md:pr-5 h-full flex flex-col">
        <div className="flex">
          {/* job name input field */}
          <form className="flex-1" onSubmit={jobCtrl.add}>
            <div className="flex items-center border-2 border-color focus-within:outline rounded-lg overflow-hidden">
              <input
                type="text"
                required
                className="flex-1 p-3 w-full text-3xl font-title bg-primary focus:outline-none placeholder:text-color placeholder:text-opacity-80"
                placeholder="Enter Job Name.."
                ref={inputRef}
                onChange={(e) => jobCtrl.form.set(e.target.value)}
                value={jobCtrl.form.name}
              />
              <div
                className=" mx-3 cursor-pointer"
                title={jobCtrl.form.name ? "Press Enter" : "Add Task"}
              >
                {jobCtrl.form.name ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 transform duration-100 rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={jobCtrl.add}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 transform duration-100 rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => inputRef.current?.focus()}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                )}
              </div>
            </div>
          </form>
        </div>
        {/* images grid for the list of jobs */}
        <div className="flex-1 relative">
          <div className="absolute w-full h-full py-5">
            <div className="h-full px-3 md:pl-0 md:pr-5 overflow-y-auto">
              <div className="grid md:grid-cols-3 gap-4">
                {jobCtrl.jobs.map((t) => (
                  <div key={t.id}>
                    <div className="border-2 shadow-md rounded-lg overflow-hidden">
                      {t.result === "pending" ? (
                        <div className="bg-gray animate-pulse h-full min-h-[180px]"></div>
                      ) : (
                        <img src={t.result} alt={t.name} />
                      )}
                    </div>
                    <p className="font-bold my-2 text-center md:text-left">
                      {t.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {jobCtrl.jobs.length === 0 && (
            <div className="w-10/12 md:w-1/2 mx-auto h-full flex items-center">
              <div className="text-center">
                <img src="empty.svg" alt="" />
                <p className="font-bold text-xl my-5">No Jobs available</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* list of jobs in tab form */}
      <div
        id="jobList"
        className={classNames("w-full md:w-1/3 md:pl-5 h-full flex flex-col", {
          "w-0 hidden": jobCtrl.jobs.length === 0,
        })}
      >
        <div className="p-5 md:p-4 text-3xl md:text-xl md:text-right font-bold">
          All Jobs ({jobCtrl.jobs.length})
        </div>
        <div className="flex-1 relative">
          <div className="absolute p-3 h-full w-full overflow-y-auto">
            {jobCtrl.jobs.map((t) => (
              <Job key={t.id} {...t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
