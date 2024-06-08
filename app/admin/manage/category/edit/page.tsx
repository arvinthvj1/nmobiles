
"use client"
import React from 'react'
import AddOrEdit from '../add/page'
import { useRouter } from 'next/navigation';

const Edit = () => {
    debugger
  let router = useRouter();
  const { data } = router?.query?.state || {};
  debugger
  return (
    <AddOrEdit editData={data}/>
  )
}

export default Edit
