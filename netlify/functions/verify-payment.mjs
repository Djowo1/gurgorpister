export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { transaction_id } = JSON.parse(event.body);

  if (!transaction_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'transaction_id is required' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (data.status === 'success' && data.data?.status === 'successful') {
      // Payment is genuinely verified on Flutterwave's servers
      return {
        statusCode: 200,
        body: JSON.stringify({
          verified: true,
          amount: data.data.amount,
          currency: data.data.currency,
          tx_ref: data.data.tx_ref,
          transaction_id: data.data.id,
        }),
      };
    } else {
      // Payment exists but is not successful (pending, failed, etc.)
      console.error('Payment verification failed:', data);
      return {
        statusCode: 200,
        body: JSON.stringify({
          verified: false,
          status: data.data?.status || 'unknown',
        }),
      };
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to verify payment.' }),
    };
  }
};
