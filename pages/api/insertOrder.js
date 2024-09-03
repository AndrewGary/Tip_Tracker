const {getConnection} = require("../../dbUtils/utils")

export default async function handler (req, res){

    let order = JSON.parse(req.body);


    let connection;

    try{
        connection = await getConnection();

        const resp = await connection.query(`insert into orders (name, total, street_number, street, city, tip_type, tip) values (?, ?, ?, ?, ?, ?,?)`, [order.name, parseFloat(order.total), order.street_number, order.street, order.city, order.order_type, parseFloat(order.tip)]);

        console.log(resp);

        return res.status(200).json({ message: 'Success' });
    }catch(error){
        return res.status(500).json({ message: 'Error Adding Order Info'});
    }finally{
        if(connection) await connection.end()
    }
    // console.log(order);

    // return res.status(200).json({ message: 'Success' });

    // let
}