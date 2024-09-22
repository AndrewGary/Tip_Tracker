const {getConnection} = require('../../dbUtils/utils')

export default async function handler(req, res){

    if(req.method !== 'POST'){
        return res.status(400).json({ message: 'Incorrect request method.'})
    }

    const {startDate, endDate} = req.body;

    if(!startDate || !endDate){
        return res.status(400).json({ message: 'You must provide a valid start date and end date'})
    }

    if(startDate.length !== 10 || endDate.length !== 10){
        return res.status(400).json({ message: 'The start date and end date should be in the following format: YYYY-MM-DD'});
    }

    let connection;

    try{
        connection = await getConnection();

        const resp = await connection.query(`select * from orders where order_date >= '${startDate}' and order_date <= '${endDate}' order by order_date, order_time`);

        return res.status(200).json({ message: 'finished' })
    }catch(error){
        return res.status(500).json({ message: 'Server Error' })
    }finally{
        if(connection) await connection.end()
    }
}