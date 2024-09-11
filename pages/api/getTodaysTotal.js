const { getConnection} = require("../../dbUtils/utils")

export default async function handler (req, res){

    let connection;

    try{
        connection = await getConnection();
        const query = await connection.query(`select sum(tip) as total from orders where order_date = '2024-09-10'`);
        // console.log(Object.keys(query[0]));
        console.log(query);

        if(!query[0].total){
            return res.status(200).json({ total: '0'})
        }

        return res.status(200).json({ total: query[0].total});

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Error Adding Order Info'});
    }finally{
        if(connection) await connection.end()
    }
}