import crypto from 'crypto';

export const handler = async (event) => {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = event.headers['verif-hash'];

  if (!signature || (signature !== secretHash)) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const payload = JSON.parse(event.body);

  console.log('Received Flutterwave webhook:', payload);

  if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
    const { tx_ref, amount, currency, customer } = payload.data;
    console.log(`SUCCESS: Payment for ${tx_ref} was successful. Amount: ${amount} ${currency}.`);

    console.log(`NOTIFICATION: An email should be sent to ${customer.email}.`);
  }

  return { statusCode: 200, body: 'Webhook received.' };
};
