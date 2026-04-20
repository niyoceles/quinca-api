import {
  uuid
} from 'uuidv4';

const stripe = require('stripe')(process.env.SECRET_KEY); // Add your Secret Key Here

const idempontencyKey = uuid();

const payWithStripe = (req, res) => {
  const {
    token, productname, amount
  } = req.body;
  if (!token.id) {
    res.status(400).json({
      error: 'Token is required'
    });
  }
  try {
    stripe.customers
      .create({
        name: token.name,
        email: token.email,
        source: token.id,
      })
      .then((customer) => stripe.charges.create(
        {
          amount: amount * 100,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token.email,
          receipt_number: token.phone,
          description: productname,
        },
        {
          idempontencyKey,
        }
      ))
      .then((result) => {
        res.status(200).json({
          result
        });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    res.send(err);
  }
};

export default payWithStripe;
