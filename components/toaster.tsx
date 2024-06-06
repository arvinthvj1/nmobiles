import React, { useEffect } from 'react';

  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  
  function Toaster({message, type}:any){

    useEffect(()=>{
        if(message?.length){
            toast(message)
        }
    },[message]);

    return (
      <div>
        <ToastContainer theme={type}  />
      </div>
    );
  }


  export default Toaster;