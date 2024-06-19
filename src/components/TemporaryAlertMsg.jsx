import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/auth-context";
const TemporaryAlert = () => {
  const { alertMsg, setAlertMsg, isSuccess ,setIsSuccess} = useContext(Context);
  const [showAlert, setShowAlert] = useState(false); 
  
  useEffect(() => {
    if (alertMsg) {
      setShowAlert(true)
    }
    const timeoutId = setTimeout(() => {
      closeAlert();
      // Hide the alert after 5 seconds
    }, 5000);

    return () => clearTimeout(timeoutId); // Cleanup function to prevent memory leaks
  }, [alertMsg]);
  const closeAlert = () => {
    setShowAlert(false);
    setAlertMsg("");
    setIsSuccess(false)
  };
  return (
    <div className={`alert ${showAlert ? "" : "hidden"} ${isSuccess&&'success'}`}>
      {alertMsg && <p>{alertMsg}</p>}
     
    </div>
  );
};

export default TemporaryAlert;
