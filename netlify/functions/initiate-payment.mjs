import fetch from 'node-fetch';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { amount, currency, email, name, tier, reader, message } = JSON.parse(event.body);

  const tx_ref = `EC-${Date.now()}`;

  try {
    const payload = {
      tx_ref,
      amount,
      currency,
      redirect_url: `${process.env.URL}/booking-confirmation`,
      customer: {
        email,
        name,
      },
      meta: {
        tier,
        reader,
        message,
      },
      customizations: {
        title: 'Echoes & Cards - Tarot Reading',
        description: `Payment for ${tier} with ${reader}`,
        logo: `${process.env.URL}/favicon.svg`,
      },
    };
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status === 'success' && data.data?.link) {
      return {
        statusCode: 200,
        body: JSON.stringify({ link: data.data.link }),
      };
    } else {
            console.error('Flutterwave API error:', data);
      return {
        statusCode: data.statusCode || 500,
        body: JSON.stringify({ error: 'Could not initiate payment.' }),
      };
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};
