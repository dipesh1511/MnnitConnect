import { fileURLToPath } from 'url';
import path from 'path';
import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const signupEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    // Check if email ends with @mnnit.ac.in
    if (!email.endsWith('@mnnit.ac.in')) {
      return res.status(400).json({ error: 'Email must end with @mnnit.ac.in' });
    }

    console.log('Email:', email);
    console.log('Code:', code);

    // Create the email transporter
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
    });

    console.log('Transporter created.');

    // Read the HTML template for the email
    const templatePath = path.join(__dirname, '../emails/signup.html');
    console.log('Template Path:', templatePath);

    // Check if the template exists and read it
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({ error: 'Email template not found' });
    }

    let emailTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Replace the OTP placeholder in the template with the actual code
    emailTemplate = emailTemplate.replace('{{OTP}}', code);

    console.log('Email template prepared.');

    // Set up email options
    const mailOptions = {
      from: process.env.GMAIL_USER, // Sender address
      to: email,  // Recipient's email
      subject: 'Registration OTP', // Subject line
      html: emailTemplate, // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');

    // Send response to the client
    return res.status(200).json({ message: 'Verification code sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Error sending email' });
  }
};
