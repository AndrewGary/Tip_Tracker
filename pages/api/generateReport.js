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

        //Total amount collected from customer.
        const totalAmount = resp.reduce((accumulator, currentItem) => {
            return parseFloat((accumulator + parseFloat((parseFloat(currentItem.total)).toFixed(2))).toFixed(2))
        }, 0)

        //Total amount of tips
        const totalTips = resp.reduce((accumulator, item) => {
            return parseFloat((accumulator + parseFloat((parseFloat(item.tip)).toFixed(2))).toFixed(2));
        }, 0)

        //Total amount of credit card tip fees.
        const creditCardFees = resp.filter(item => item.tip_type === 'Credit').reduce((accumulator, item) => {
            const fee = parseFloat((parseFloat(item.tip) * .04).toFixed(2))
            console.log('fee: ', fee);
            return parseFloat((accumulator + fee).toFixed(2))
        }, 0)

        const totalDeliveryFees = resp.reduce((accumulator, item) => {
            if(item.over_5_miles){
                return accumulator + 7
            }
            return accumulator + 5
        }, 0)

        
        //We are going to calulate the total amount earned by using the following formula.
        const totalEarned = parseFloat(((totalTips + totalDeliveryFees) - creditCardFees).toFixed(2));
        
        //Calculate the total days worked
        //We are going to query the database table to get the number of days worked between the startDate and endDate

        const numberOfDaysQuery = await connection.query(`select distinct order_date from orders where order_date >= '${startDate}' and order_date <= '${endDate}'`);
        const numberOfDaysWorked = numberOfDaysQuery.length;
        


        console.log('totalAmount: ', totalAmount);
        console.log('totalTips: ', totalTips);
        console.log('creditCardFees: ', creditCardFees);
        console.log('totalDeliveryFees: ', totalDeliveryFees);
        console.log('totalEarned: ', totalEarned)
        console.log('numberOfDaysWorked: ', numberOfDaysWorked)
        // console.log('creditCardFees: ', creditCardFees) //float 12.3420000000002
        // console.log('parseFloat(creditCardFees.toFixed(2)): ', parseFloat(creditCardFees.toFixed(2)));

        // const totalNumberOfOrders = resp.length;

        // console.log('totalNumberOfOrders; ', totalNumberOfOrders);




        return res.status(200).json({ message: 'Temp' })
    }catch(error){
        return res.status(500).json({ message: 'Server Error' })
    }finally{
        if(connection) await connection.end()
    }
}