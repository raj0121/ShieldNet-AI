const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('Email function called at:', new Date().toISOString());
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { to, subject, html } = JSON.parse(event.body);
    console.log('Sending email to:', to);

    // Create transporter with your Gmail credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vag.raj947@gmail.com', // Your Gmail
        pass: 'szse krqc kxgz zorl',  // Your app password
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: '"ShieldNet AI Security" <vag.raj947@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    });

    console.log('Email sent successfully! Message ID:', info.messageId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        messageId: info.messageId,
        message: 'Email sent successfully'
      }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.message,
        message: 'Failed to send email. Check function logs.'
      }),
    };
  }
};