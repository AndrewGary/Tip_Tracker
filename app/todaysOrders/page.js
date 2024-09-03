import React from 'react'
const {getTodaysOrders} = require('../../dbUtils/utils');

const page = async () => {

    const orders = await getTodaysOrders();

    console.log('orders: ', orders)
  return (
    <div>
        {orders.map(item => {
            return (
                <div>
                    {item.name}
                </div>
            )
        })}
    </div>
  )
}

export default page