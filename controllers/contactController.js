const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    const { name, email, company, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, Email, and Message are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"${name}" <${email}>`, // sender address
            to: process.env.EMAIL_USER, // list of receivers (the business owner)
            replyTo: email,
            subject: `New Inquiry from ${name} - ${company || 'Portfolio Website'}`,
            text: `
        Name: ${name}
        Email: ${email}
        Company: ${company || 'N/A'}
        Phone: ${phone || 'N/A'}
        
        Message:
        ${message}
      `,
            html: `
        <h3>New Contact or Inquiry</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company || 'N/A'}</li>
          <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        res.status(200).json({ message: 'Email sent successfully!' });

    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};
