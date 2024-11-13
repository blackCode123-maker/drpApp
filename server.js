const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('Email server error:', error);
    } else {
        console.log('Email server is ready');
    }
});

// Handle form submission
app.post('/submit-form', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            carMake,
            carModel,
            carYear
        } = req.body;

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Dr Pepper Vehicle Wrap Application',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #c81533;">New Vehicle Wrap Application</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #2d3436;">Personal Information</h3>
                        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Address:</strong> ${address}</p>
                        <p><strong>City:</strong> ${city}</p>
                        <p><strong>State:</strong> ${state}</p>
                        <p><strong>ZIP Code:</strong> ${zipCode}</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #2d3436;">Vehicle Information</h3>
                        <p><strong>Car Make:</strong> ${carMake}</p>
                        <p><strong>Car Model:</strong> ${carModel}</p>
                        <p><strong>Car Year:</strong> ${carYear}</p>
                    </div>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Thank you! Your application has been submitted successfully.'
        });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to submit your application. Please try again later.',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 