// app/api/contact/route.ts
import { google } from "googleapis";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

// Pull from environment variables (set these in .env.local)
const CLIENT_ID = process.env.GMAIL_CLIENT_ID!;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN!;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const SENDER_EMAIL = process.env.GMAIL_SENDER!; // your gmail address

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    // Get a fresh access token
    const accessToken = await oAuth2Client.getAccessToken();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token ?? "",
      },
    });

    // Send the email
    const mailOptions = {
      from: `"${name}" <${SENDER_EMAIL}>`,
      replyTo: email,
      to: SENDER_EMAIL, // send to yourself
      subject: `New contact form submission from ${name}`,
      text: message,
      html: `<p><b>From:</b> ${name} (${email})</p><p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}