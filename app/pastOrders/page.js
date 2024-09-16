import React from 'react'
const {getXDaysOrders} = require('../../dbUtils/utils');

const page = async ({ searchParams}) => {

    const date = searchParams.date ? searchParams.date : '';
    const orders = await getXDaysOrders(date);

    console.log(orders);
    console.log(orders.length);


    return (
        <div>
            Testing
        </div>
    )

//     const orders = await getTodaysOrders();

//     console.log('orders: ', orders)
//   return (
//     <div>
//         {orders.map(item => {
//             return (
//                 <div>
//                     {item.name}
//                 </div>
//             )
//         })}
//     </div>
//   )
}

export default page