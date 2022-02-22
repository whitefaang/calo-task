import { useContext, useRef } from "react";
import { notificationCtx } from "../contexts/NotificationProvider";

/**
 * useStorage hook.
 * an interface to communicate with the browser storages
 */
function useStorage<T>(
  /**
   * the key from the storage we need to interact wiith
   */
  key: string
) {
  // use a browser storage for usage
  const storage = useRef(sessionStorage);
  // const storage = useRef(localStorage);
  // notification context used to show notifications
  // used to show errors when the browser storage memory is full
  const nTx = useContext(notificationCtx);
  // get the value of particular key from the browser storage
  const get = () => {
    const values = storage.current.getItem(key);
    return values ? JSON.parse(values) : [];
  };

  // set the value of a particula key
  // and if storage full, show an error notification for the same
  const set = (jobs: T) => {
    try {
      storage.current.setItem(key, JSON.stringify(jobs));
    } catch (e) {
      console.error(e);
      nTx?.show("Persist memory exceeded! Some items may not be saved");
    }
  };
  return { set, get };
}

export default useStorage;
