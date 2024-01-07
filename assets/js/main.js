// Import necessary Firebase and Stripe modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_51OVGz7A4i0UX7TF4QLUHVlpsDG7aPDFoZefO9eCarGvj0KJQyyfH0TtdmfMZzlv4drM8GtKuIcySYqj5ZBMbH1aP00OmeKkhBC'); // Replace with your actual Stripe secret key
const nodemailer = require('nodemailer');

// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA-iruf5t3PN3nSUNa7hHPwO1v-qS63Rs",
  authDomain: "i-gosure.firebaseapp.com",
  databaseURL: "https://i-gosure-default-rtdb.firebaseio.com",
  projectId: "i-gosure",
  storageBucket: "i-gosure.appspot.com",
  messagingSenderId: "938934389841",
  appId: "1:938934389841:web:92187069449c10b980bc70",
  measurementId: "G-3GTNX2147D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://i-gosure-default-rtdb.firebaseio.com"
});

// Initialize Firebase (remove redundant initialization)
const firebase = require('firebase/app');
require('firebase/database');
firebase.initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = firebase.database();

// Firebase Cloud Function to create a Payment Intent
exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  try {
    // Extract payment details from the request
    const { amount, currency, customerId } = req.body;

    // Create a Payment Intent on Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
    });

    // Respond with the client secret
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error.message);
    res.status(500).send('Error creating Payment Intent');
  }
});

// Function to check registration
function checkRegistration() {
  const registrationNumber = document.getElementById('registration').value;
  const apiUrl = 'https://api.vehicle-search.co.uk/#/';

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ registration: registrationNumber }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.valid) {
        displayQuotation(data);
        displayCarDetailsAndStore(data.carDetails, true);
        displayPaymentForm(data.amount);
      } else {
        displayError("Invalid Registration Number. Please try again.");
      }
    })
    .catch(error => {
      console.error('Error checking registration:', error.message);
      displayError(error.message);
    });
}

// Function to display car details and store in Firebase
function displayCarDetailsAndStore(carDetails, paymentSuccessful) {
  const resultContainer = document.getElementById('quotationResult');

  // Display the car details
  resultContainer.innerHTML += `
    <h2>Car Details</h2>
    <p><strong>Make:</strong> ${carDetails.make}</p>
    <p><strong>Model:</strong> ${carDetails.model}</p>
    <p><strong>Color:</strong> ${carDetails.color}</p>
    <p><strong>Chassis Number:</strong> ${carDetails.chassisNumber}</p>
  `;

  // Check if payment was successful before storing in Firebase
  if (paymentSuccessful) {
    // Replace this with your actual Firebase code
    const paymentsRef = ref(database, 'payments');

    // Push the car details to Firebase
    push(paymentsRef, {
      make: carDetails.make,
      model: carDetails.model,
      color: carDetails.color,
      chassisNumber: carDetails.chassisNumber,
      // Add any other relevant information
    });

    console.log('Car details saved to Firebase:', carDetails);
  }
}

// Additional functions...

// Assume you have a successful payment callback function
function handleSuccessfulPayment(paymentInfo) {
  // Make a request to the server to generate the PDF
  fetch('/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentInfo }),
  })
    .then(response => response.blob())
    .then(blob => {
      // Create a link element to download the PDF
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'receipt.pdf';
      link.click();
    })
    .catch(error => console.error('Error generating PDF:', error));
}

// Claim and Policy Number Generator
exports.generateClaimAndPolicyNumbers = functions.https.onRequest((req, res) => {
  // Generate claim and policy numbers logic
  // ...

  // Send the generated numbers in response
  res.json({ claimNumber: 'generated_claim_number', policyNumber: 'generated_policy_number' });
});

// Firebase Cloud Function for HTML page
exports.serveHtmlPage = functions.https.onRequest((req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
exports.submitContactForm = functions.https.onRequest((req, res) => {
  const { name, email, message } = req.body;

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // replace with your email
      pass: 'your-password' // replace with your email password or use an app-specific password
    }
  });

  // Define email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@example.com', // replace with the recipient's email
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email Sent');
    }
  });
});

const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.createQuotation = functions.https.onRequest(async (req, res) => {
  try {
    const { additionalDetails, amount, registration, customer, carDetails, payment } = req.body;

    // Add timestamp to the quotation
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Create a new quotation in Firestore
    const newQuotationRef = await admin.firestore().collection('quotations').add({
      additionalDetails,
      amount,
      registration,
      timestamp,
      customer,
      carDetails,
      payment,
      // Add any other fields as needed
    });

    res.json({ quotationID: newQuotationRef.id });
  } catch (error) {
    console.error('Error creating quotation:', error.message);
    res.status(500).send('Error creating quotation');
  }
});

