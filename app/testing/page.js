"use client"

import React, { useState } from 'react'

const page = () => {

    const [total, setTotal] = useState(0);

    const buttonClick = async (e) => {
        e.preventDefault();

        setTotal(total + 10);
    }


  return (
    <div>
        <button onClick={buttonClick} className='border border-black rounded-md'>Add To Count</button>
        <span className='font-bold text-xl'>{total}</span>
    </div>
  )
}

export default page