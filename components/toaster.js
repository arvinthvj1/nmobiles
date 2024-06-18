import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function Toast({toastObj}) {
  // debugger;
  useEffect(() => {
    let {message, type} = toastObj;
    if (message?.length && type.length) {
      toast[type](message);
    }
  }, [toastObj]);

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default Toast;
