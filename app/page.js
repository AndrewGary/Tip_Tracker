"use client"
import { useState } from 'react'

const defaultOrder = {
  name: '',
  total: 0,
  street_number: '',
  street: '',
  city: '',
  order_type: '',
  tip: 0,
}

export default function Home() {

  const [order, setOrder] = useState(defaultOrder)

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(order);
  }
  
  const handleChange = (e) => {

    if(e.target.name === 'order_type'){
      setOrder({
        ...order,
        order_type: e.target.checked ? 'Cash' : 'Credit'
      })
    }else{
      setOrder({
        ...order,
        [e.target.name]: e.target.value
      })
    }
      
  }

  return (
    <div className="w-full min-h-full flex flex-col justify-center items-center">
      <h1>Add New Order</h1>

      <form className='flex flex-col border border-black rounded-md w-11/12 px-3'>
        
        <div className='flex flex-col'>
          <span className='text-sm'>Name</span>
          <input
            value={order.name}
            name='name'
            type='text'
            onChange={handleChange}
            className='border border-black rounded-sm pl-1'
          />
        </div>

        <div className='flex flex-col'>
          <span className='text-sm'>Order Total</span>
          <input
            name='total'
            type='text'
            inputMode='decimal'
            onChange={handleChange}
            className='border border-black rounded-sm pl-1'
          />
        </div>

        <div className='flex flex-col'>
          <span className='text-sm'>Street Number</span>
          <input
            inputMode='numeric'
            name='street_number'
            type='text'
            onChange={handleChange}
            className='border border-black rounded-sm pl-1'
          />
        </div>

        <div className='flex flex-col'>
          <span className='text-sm'>Street</span>
          <input
            name='street'
            type='text'
            onChange={handleChange}
            className='border border-black rounded-sm pl-1'
          />
        </div>

        <div className='flex flex-col'>
          <span className='text-sm'>City</span>
          <input
            name='city'
            type='text'
            onChange={handleChange}
            className='border border-black rounded-sm pl-1'
          />
        </div>

        <div className='flex flex-col items-start'>
          <span className='text-sm'>Cash Order?</span>
          <input
            name='order_type'
            type='checkbox'
            onChange={handleChange}
            className='border border-black rounded-sm pl-1'
          />
        </div>

        <div className='flex flex-col'>
          <span className='text-sm'>Tip</span>
          <input
            name='tip'
            type='text'
            inputMode='decimal'
            onChange={handleChange}
            className='border border-black rounded-sm pl-1'
          />
        </div>

        <div className='w-full flex justify-center mt-4'>
          <button className='border border-black rounded-md w-4/5' onClick={handleSubmit}>
            Add Order
          </button>

        </div>
      </form>
    </div>
  );
}
