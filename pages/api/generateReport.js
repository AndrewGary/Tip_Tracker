const {getConnection} = require('../../dbUtils/utils')

export default async function handler(req, res){

    //Make sure the request method is POST
    if(req.method !== 'POST'){
        return res.status(400).json({ message: 'Incorrect request method.'})
    }

    let {startDate, endDate, options} = req.body;

    //Make sure the request body includes a startDate and an endDate variable.
    if(!startDate || !endDate){
        return res.status(400).json({ message: 'You must provide a valid start date and end date'})
    }

    //Validate that both the startDate and endDate is 10 chars long.
    if(startDate.length !== 10 || endDate.length !== 10){
        return res.status(400).json({ message: 'The start date and end date should be in the following format: YYYY-MM-DD'});
    }

    //Check to see if the endDate is in the future, and if it is, set the date to the current date.
    const today = new Date();
    const inputEndDate = new Date(endDate);

    if(inputEndDate > today){
        console.log('The endDate is in the future');
        console.log(`old endDate: ${endDate}`)
        endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    }

    //Check to make sure that the startDate !> endDate
    const inputStartDate = new Date(startDate);
    if(inputStartDate > inputEndDate){
        return res.status(400).json({ message: 'The start date can not be after the end date' })
    }

    //END of validation section.

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
        
        //Get the total number of deliveries in report
        const totalNumberOfDeliveries = resp.length;


        console.log('totalAmount: ', totalAmount);
        console.log('totalTips: ', totalTips);
        console.log('creditCardFees: ', creditCardFees);
        console.log('totalDeliveryFees: ', totalDeliveryFees);
        console.log('totalEarned: ', totalEarned);
        console.log('numberOfDaysWorked: ', numberOfDaysWorked);
        console.log('totalNumberOfDeliveries: ', totalNumberOfDeliveries);


        //Check to see if the user sent some options over in the request to the endpoint and send the response accordingly.
        if(options){
            const returnObject = {

            }

            if(options.includes('totalAmount')) returnObject.totalAmount = totalAmount;
            if(options.includes('totalTips')) returnObject.totalTips = totalTips;
            if(options.includes('creditCardFees')) returnObject.creditCardFees = creditCardFees;
            if(options.includes('totalDeliveryFees')) returnObject.totalDeliveryFees = totalDeliveryFees
            if(options.includes('totalEarned')) returnObject.totalEarned = totalEarned
            if(options.includes('numberOfDaysWorked')) returnObject.numberOfDaysWorked = numberOfDaysWorked
            if(options.includes('totalNumberOfDeliveries')) returnObject.totalNumberOfDeliveries = totalNumberOfDeliveries

            return res.status(200).json(returnObject);
        }else{
            return res.status(200).json({
                totalAmount,
                totalTips,
                creditCardFees,
                totalDeliveryFees,
                totalEarned,
                numberOfDaysWorked,
                totalNumberOfDeliveries
            })
        }
    }catch(error){
        return res.status(500).json({ message: 'Server Error' })
    }finally{
        if(connection) await connection.end()
    }
}