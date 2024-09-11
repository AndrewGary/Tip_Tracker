const {getConnection} = require('../../dbUtils/utils')
export default async function handler(req, res){

    let connection;
    try{
        connection = await getConnection();

        // const today = new Date().toISOString().split('T')[0];
        const today = new Date().toLocaleDateString('en-CA')

        const query = await connection.query(`select * from orders where order_date = '${today}'`);

        let totalTipAmountForTheDay = 0;
        let allOrdersTotalAmount = 0;

        query.forEach(item => {
            const tip = parseFloat(item.tip);
            totalTipAmountForTheDay += tip;

            const orderTotal = parseFloat(item.total);
            allOrdersTotalAmount += orderTotal
        })

        return res.status(200).json({
             totalOrders: query.length,
             totalTips: totalTipAmountForTheDay,
             allOrdersTotal: allOrdersTotalAmount
        })
    }catch(error){
        console.log(error)
    }finally{
        if(connection) await connection.end()
    }
}