"use client"

import React, { useState } from 'react'

const page = () => {

    const [total, setTotal] = useState(0);

    const buttonClick = async (e) => {
        const resp = await fetch('/api/testing');
        console.log(resp);
        const parsedResp = await resp.json();
        console.log(parsedResp);
    }


  return (
    <div>
        <button onClick={buttonClick} className='border border-black rounded-md'>Add To Count</button>
        <span className='font-bold text-xl'>{total}</span>
    </div>
  )
}

export default page