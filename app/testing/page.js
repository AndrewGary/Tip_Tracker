"use client"

import React, { useState, useEffect } from 'react'

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Function that is called after the user stops typing
  const performAction = (term) => {
    console.log(`User stopped typing. Performing action with: ${term}`);
    // You can perform your desired action here, e.g., fetching data or updating state
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // Delay of 500ms (you can adjust this delay)

    return () => {
      clearTimeout(timer); // Clear the timer if the user starts typing again
    };
  }, [searchTerm]);

  // Call the action when the debounced term updates
  useEffect(() => {

    const debounceAsync = async () => {
      try{

        const resp = await fetch(`/api/autoSearchAddress?address=${debouncedTerm}`);

        if(!resp.ok){
          return;
        }

        const parsedResp = await resp.json();

        console.log(parsedResp);
      }catch(error){
        console.log(error)
      }
    }
    if (debouncedTerm) {
      debounceAsync();
    }
  }, [debouncedTerm]);

  return (
    <div>
      <input
        className='border border-black pl-1'
        type='text'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type something..."
      />
    </div>
  )
}

export default Page;
