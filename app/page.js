"use client"
import { useState, useEffect } from 'react'

const defaultOrder = {
  name: '',
  total: '',
  street_number: '',
  street: '',
  city: '',
  order_type: 'Credit',
  tip: '',
}

export default function Home() {

  const [order, setOrder] = useState(defaultOrder)
  const [todaysTotal, setTodaysTotal] = useState('');
  const [ordersTotal, setOrdersTotal] = useState('');
  const [numberOfOrders, setNumberOfOrders] = useState('');

  

  const [debouncedTerm, setDebouncedTerm] = useState(order.street_number);
  const [suggestions, setSuggestions] = useState([]);

  //For detecting debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(order.street_number);
    }, 500); // Delay of 500ms (you can adjust this delay)

    return () => {
      clearTimeout(timer); // Clear the timer if the user starts typing again
    };
  }, [order.street_number]);

  // Call the action when the debounced term updates
  useEffect(() => {

    const debounceAsync = async () => {
      try{

        const resp = await fetch(`/api/autoSearchAddress?address=${debouncedTerm}`);

        if(!resp.ok){
          return;
        }

        const parsedResp = await resp.json();

        setSuggestions(parsedResp);
      }catch(error){
        console.log(error)
      }
    }
    if (debouncedTerm) {
      debounceAsync();
    }
  }, [debouncedTerm]);

  
  useEffect(() => {
    const useEffectAsync = async () => {

      const todaysSummaryResp = await fetch('/api/getTodaysSummary');

      const parsedSummary = await todaysSummaryResp.json();

      setTodaysTotal(parsedSummary.totalTips.toFixed(2))
      setNumberOfOrders(parsedSummary.totalOrders);
      setOrdersTotal(parsedSummary.allOrdersTotal.toFixed(2));

      console.log(parsedSummary);
    }

    useEffectAsync();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await fetch('/api/insertOrder', {
      method: 'POST',
      body: JSON.stringify(order)
    })

    if(resp.ok){
      const resp = await fetch('/api/getTodaysSummary');
      const parsedResp = await resp.json();
      setTodaysTotal(parsedResp.totalTips)
      setNumberOfOrders(parsedResp.totalOrders);
      setOrdersTotal(parsedResp.allOrdersTotal);

      console.log('typeof parsedResp.totalTips: ', typeof parsedResp.totalTips);
      console.log('typeof parsedResp.allOrdersTotal: ', typeof parsedResp.allOrdersTotal)
      
      setOrder(defaultOrder);
    }
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

  const handleAutoCompleteSelection = async (indexOfSelection) => {
    // e.preventDefault();

    console.log('indexOfSelection: ', indexOfSelection)
    console.log(suggestions[indexOfSelection]);

    setOrder({
      ...order,
      street_number: suggestions[indexOfSelection].house_number,
      street: suggestions[indexOfSelection].street,
      city: suggestions[indexOfSelection].city
    })

    setSuggestions([]);
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="text-xl font-bold mb-4 flex flex-col w-full border border-gray-300 rounded-md px-4 py-2 shadow-md">
        <div className='w-full flex justify-between'>
          <span className='text-gray-800'>Tips:</span>{todaysTotal ? `$${todaysTotal}` : '$0.00'}
        </div>
        <div className='w-full flex justify-between'>
          <span className='text-gray-800'># of Orders:</span>{numberOfOrders ? `${numberOfOrders}` : '0'}
        </div>
        <div className='w-full flex justify-between'>
          <span className='text-gray-800'>Order Total:</span>{ordersTotal ? `$${ordersTotal}` : '$0.00'}
        </div>
      </div>

      <h1 className="text-xl font-semibold mb-4 text-gray-900">Add New Order</h1>

      <form className='flex flex-col border border-gray-300 rounded-lg w-full md:w-1/2 lg:w-1/3 bg-white p-6 shadow-md'>
        
        <div className='flex flex-col mb-4'>
          <label className='text-sm font-medium text-gray-700'>Name</label>
          <input
            value={order.name}
            name='name'
            type='text'
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col mb-4'>
          <label className='text-sm font-medium text-gray-700'>Order Total</label>
          <input
            value={order.total}
            name='total'
            type='text'
            inputMode='decimal'
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col mb-4'>
          <label className='text-sm font-medium text-gray-700'>
            Street Number
          </label>
          
          <input
            value={order.street_number}
            inputMode='numeric'
            name='street_number'
            type='text'
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          
          {suggestions.length > 0 && (
            <div className='flex flex-col border border-black'>
              {suggestions.map((item, key) => (
                <div key={key} onClick={() => {
                  handleAutoCompleteSelection(key)
                }}>
                  {`${item.house_number} ${item.street}, ${item.city}`}
                </div>
              ))}
            </div>
          )}
        </div>


        <div className='flex flex-col mb-4'>
          <label className='text-sm font-medium text-gray-700'>Street</label>
          <input
            value={order.street}
            name='street'
            type='text'
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col mb-4'>
          <label className='text-sm font-medium text-gray-700'>City</label>
          <input
            value={order.city}
            name='city'
            type='text'
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex items-center mb-4'>
          <label className='text-sm font-medium text-gray-700 mr-2'>Cash Order?</label>
          <input
            checked={order.order_type === 'Cash'}
            name='order_type'
            type='checkbox'
            onChange={handleChange}
            className='border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col mb-4'>
          <label className='text-sm font-medium text-gray-700'>Tip</label>
          <input
            value={order.tip}
            name='tip'
            type='text'
            inputMode='decimal'
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='w-full flex justify-center'>
          <button className='border border-gray-300 bg-red-500 text-white rounded-md w-full py-2 hover:bg-blue-600 transition-all' onClick={handleSubmit}>
            Add Order
          </button>
        </div>

      </form>
    </div>
  );
}
