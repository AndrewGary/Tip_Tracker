const {getConnection} = require('../../dbUtils/utils');

export default async function handler(req, res){

    let connection;

    let {address} = req.query;

    try{
        connection = await getConnection();

        if(address.includes(' ')){

            const values = address.split(' ');

            const hn = values[0];
            const street = values[1];

            const resp = await connection.query(`select * from addresses where house_number = '${hn}' and street like '${street}%' limit 5`);

            return res.status(200).json(resp);
        }

        const resp = await connection.query(`select * from addresses where house_number like '${address}%' limit 5`);

        console.log(resp);

        return res.status(200).json(resp);
    }catch(error){
        console.log(error)
    }finally{
        if(connection) await connection.end()
    }
}