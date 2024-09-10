const mariadb = require('mariadb');

export default async function handler (req, res){


    let connection;

    try{
        return res.status(200).json({
            host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST_PUBLIC : process.env.DB_HOST_LOCAL,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        })
        connection = await mariadb.createConnection({
            host: process.env.NODE_ENV === 'production' ? process.env.DB_HOST_PUBLIC : process.env.DB_HOST_LOCAL,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        })
    }catch(error){
        console.log(error)
    }finally{
        if(connection) await connection.end()
    }
    // console.log(order);

    // return res.status(200).json({ message: 'Success' });

    // let
}