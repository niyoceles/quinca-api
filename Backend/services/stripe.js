import 'dotenv/config';
import { v4 as uuid } from 'uuid';
import Stripe from 'stripe';

const secretKey = process.env.SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(secretKey);

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
      .catch((err) => res.status(500).json({ error: 'Payment service failed' }));
  } catch (err) {
    res.send(err);
  }
};

export default payWithStripe;
