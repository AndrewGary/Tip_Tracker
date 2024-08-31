import {db} from '../../dbUtils/utils';

export default function handler(req, res) {

    try{
        const body = JSON.parse(req.body);

        console.log(body);

        const formattedDate = new Date().toISOString().split('T')[0];


        const resp = db.prepare('insert into orders (name, total, street_number, street, city, tip_type, tip, order_date) values (?, ?, ?, ?, ?, ?, ?, ?)');
        resp.run(body.name, parseFloat(body.total), body.street_number, body.street, body.city, body.order_type, parseFloat(body.tip), formattedDate);


        console.log(resp);
        return res.status(200).json({ message: 'Finished' });
    }catch(error){
        console.log(error)
    }
    // res.status(200).json({ message: 'Hello, world!' });
  }
  