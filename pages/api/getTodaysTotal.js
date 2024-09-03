const {getTodaysTotal, getConnection} = require("../../dbUtils/utils")

export default async function handler (req, res){


    let connection;

    try{
        connection = await getConnection();

        // const resp = await connection.query(`insert into orders (name, total, street_number, street, city, tip_type, tip) values (?, ?, ?, ?, ?, ?,?)`, [order.name, parseFloat(order.total), order.street_number, order.street, order.city, order.order_type, parseFloat(order.tip)]);
        const resp = await getTodaysTotal();

        // console.log(resp);

        return res.status(200).json({ total: resp});
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Error Adding Order Info'});
    }finally{
        if(connection) await connection.end()
    }
    // console.log(order);

    // return res.status(200).json({ message: 'Success' });

    // let
}