import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

interface TwilioError extends Error {
  code?: string;
  moreInfo?: string;
}

export async function sendMemeNotification(
  phoneNumber: string,
  imageUrls: string[]
) {
  // Format phone number to ensure E.164 format
  let formattedPhone = phoneNumber;
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+' + formattedPhone;
  }
  if (formattedPhone.startsWith('+1') && formattedPhone.length !== 12) {
    console.error('Invalid US phone number length:', formattedPhone.length);
    return false;
  }

  console.log('========= DETAILED SMS DEBUG =========');
  console.log('Original phone:', phoneNumber);
  console.log('Formatted phone:', formattedPhone);
  console.log('From number:', process.env.TWILIO_PHONE_NUMBER);

  try {
    const response = await client.messages.create({
      body: `Your memes are ready! 🎉\n\n${imageUrls
        .map((url, i) => `Meme ${i + 1}: ${url}`)
        .join("\n")}`,
      to: formattedPhone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log('Twilio Full Response:', JSON.stringify(response, null, 2));
    return true;
  } catch (error: TwilioError | unknown) {
    console.error("SMS Error Details:", {
      error: error,
      phoneNumber: formattedPhone,
      twilioNumber: process.env.TWILIO_PHONE_NUMBER
    });
    return false;
  }
}
