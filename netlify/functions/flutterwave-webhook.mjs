import crypto from 'crypto';
import fetch from 'node-fetch';

export const handler = async (event) => {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = event.headers['verif-hash'];

  if (!signature || (signature !== secretHash)) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  const payload = JSON.parse(event.body);

  console.log('Received Flutterwave webhook:', payload);

  if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
    const { tx_ref, amount, currency, customer, meta } = payload.data;
    console.log(`SUCCESS: Payment for ${tx_ref} was successful. Amount: ${amount} ${currency}.`);

    // Send email notification to the owner
    const ownerEmail = process.env.OWNER_EMAIL;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;

    if (ownerEmail && sendgridApiKey) {
      const emailSubject = `New Reading Booking: ${meta?.tier || 'Unknown Tier'}`;
      const emailBody = `
        <h2>New Booking Details</h2>
        <p>A new reading has been successfully booked and paid for.</p>
        <hr>
        <h3>Booking Information:</h3>
        <ul>
          <li><strong>Reader:</strong> ${meta?.readerName || 'N/A'}</li>
          <li><strong>Tier:</strong> ${meta?.tier || 'N/A'}</li>
          <li><strong>Scheduled For:</strong> ${meta?.bookingDate || 'N/A'}</li>
          <li><strong>Amount Paid:</strong> ${amount} ${currency}</li>
          <li><strong>Transaction Ref:</strong> ${tx_ref}</li>
        </ul>
        <h3>Customer Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${customer.name}</li>
          <li><strong>Email:</strong> ${customer.email}</li>
          <li><strong>Phone:</strong> ${customer.phone_number || 'N/A'}</li>
          <li><strong>Country:</strong> ${meta?.country || 'N/A'}</li>
          <li><strong>Address:</strong> ${meta?.address || 'N/A'}</li>
        </ul>
        <h3>Customer Message:</h3>
        <p>${meta?.message || 'No message provided.'}</p>
      `;

      try {
        await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: ownerEmail }] }],
            from: { email: 'noreply@echoesandcards.com', name: 'Echoes & Cards Bot' },
            subject: emailSubject,
            content: [{ type: 'text/html', value: emailBody }],
          }),
        });
        console.log(`Notification email sent to ${ownerEmail}`);
      } catch (error) {
        console.error('Error sending notification email:', error);
      }
    } else {
      console.log('Owner email or SendGrid API key not configured. Skipping email notification.');
    }
  }

  return { statusCode: 200, body: 'Webhook received.' };
};
