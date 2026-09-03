import dotenv from 'dotenv';
dotenv.config();

export const sendOTP = async (email, otp) => {
    try {
        const brevoApiKey = process.env.BREVO_API_KEY;
        const senderEmail = process.env.EMAIL_USER; // E.g., shubhamsanap880@gmail.com

        if (!brevoApiKey) {
            console.error("BREVO_API_KEY is missing from environment variables!");
            return false;
        }

        const payload = {
            sender: {
                name: "WEBMAXER",
                email: senderEmail
            },
            to: [
                {
                    email: email
                }
            ],
            subject: 'Verify your WEBMAXER Account',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Welcome to WEBMAXER!</h2>
                    <p style="color: #555; font-size: 16px; text-align: center;">Please use the verification code below to complete your registration.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; padding: 15px 30px; font-size: 32px; font-weight: bold; color: #fff; background-color: #000; border: 1px solid #22d3ee; border-radius: 8px; letter-spacing: 8px;">${otp}</span>
                    </div>
                    <p style="color: #555; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #aaa; font-size: 12px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
                </div>
            `
        };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Brevo API Error:", errorData);
            return false;
        }

        console.log('Email sent successfully via Brevo API');
        return true;
    } catch (error) {
        console.error("Email Error:", error);
        return false;
    }
}
