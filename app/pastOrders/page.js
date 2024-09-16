import React from 'react';
const { getXDaysOrders } = require('../../dbUtils/utils');
import DatePickerComponent from '../../components/DatePickerComponent'

const Page = async ({ searchParams }) => {
    const date = searchParams.date || '';
    const orders = await getXDaysOrders(date);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">
                Orders for {date || 'Recent Days'}
            </h1>

            <DatePickerComponent />
            {orders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold">Name</th>
                                <th className="py-3 px-4 text-left font-semibold">Total</th>
                                <th className="py-3 px-4 text-left font-semibold">Address</th>
                                <th className="py-3 px-4 text-left font-semibold">Tip Type</th>
                                <th className="py-3 px-4 text-left font-semibold">Tip Amount</th>
                                <th className="py-3 px-4 text-left font-semibold">Order Date</th>
                                <th className="py-3 px-4 text-left font-semibold">Order Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="py-3 px-4">{order.name}</td>
                                    <td className="py-3 px-4">${order.total}</td>
                                    <td className="py-3 px-4">
                                        {order.street_number} {order.street}, {order.city}
                                    </td>
                                    <td className="py-3 px-4">{order.tip_type}</td>
                                    <td className="py-3 px-4">${order.tip}</td>
                                    <td className="py-3 px-4">
                                        {new Date(order.order_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(order.order_time).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600">No orders found for the specified date.</p>
            )}
        </div>
    );
};

export default Page;
