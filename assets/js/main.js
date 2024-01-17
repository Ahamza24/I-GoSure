/**
* Template Name: Vesperr
* Updated: Jan 09 2024 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/vesperr-free-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
 
  const jsdom = require("jsdom");
  const { JSDOM } = jsdom;

  const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
  global.document = dom.window.document;
  global.window = dom.window;

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  // Your code here
  /**
   * Easy event listener function
   */

  
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });



})()


  // Import necessary modules
  const admin = require('firebase-admin');
  const PDFDocument = require('pdfkit');
  const nodemailer = require('nodemailer');
  const express = require('express');
  const app = express();
  const port = 3000;
  
  // Firebase configuration
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
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://your-database-url.firebaseio.com'
  });
  
  // Get a reference to the database service
  const database = admin.database();
  
  class ClaimNumberGenerator {
    constructor(prefix = 'IC', length = 10) {
      this.prefix = prefix;
      this.length = length;
    }
  
    generateClaimNumber() {
      const timestamp = Date.now().toString();
      const randomPart = this.generateRandomPart();
      const claimNumber = this.prefix + timestamp + randomPart;
      return claimNumber;
    }
  
    generateRandomPart() {
      const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomPart = '';
  
      for (let i = 0; i < this.length; i++) {
        const randomIndex = Math.floor(Math.random() * randomChars.length);
        randomPart += randomChars.charAt(randomIndex);
      }
  
      return randomPart;
    }
  }
  
  app.get('/checkRegistration/:registrationNumber', async (req, res) => {
    const registrationNumber = req.params.registrationNumber;
    const userRef = db.ref('users/' + registrationNumber);
    
    userRef.once('value', snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        res.json({ 
          message: 'User registration input found in the database.',
          claimNumber: userData.claimNumber,
          carDetails: userData.carDetails
        });
      } else {
        res.json({ message: 'User registration input not found in the database.' });
      }
    });
  });
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  async function handleStripePayment(amount, token) {
    try {
      const charge = await stripe.charges.create({
        amount: amount,
        currency: 'gdp',
        description: 'Insurance Claim',
        source: token,
      });
      return charge;
    } catch (error) {
      console.error('Error handling Stripe payment:', error.message);
      throw error;
    }
  }
  
  const fetch = require('node-fetch');
  async function handlePaymentAndGeneratePDF(registrationNumber, token) {
    try {
      // Validate registration number
      if (!registrationNumber) {
        throw new Error('Registration number is required');
      }
  
      // Call the registration validation API
      const apiKey = 3196|pJIwJd8qbCbUeZzwYBqmOFD3tKPhXRcnUqpXDAmJ; // Replace with your actual API key
      const response = await fetch(`https://api.example.com/regcheck?reg=${registrationNumber}&api_key=${apiKey}`);
      const data = await response.json();
  
      if (!data.isValid) {
        throw new Error('Invalid registration number');
      }
  
      // Calculate price based on car age and contract length
      const price = calculatePrice(data.carAge, data.contractLength);
  
      // Handle payment using Stripe
      const charge = await handleStripePayment(price, token);
  
      // Generate claim number
      const claimNumberGenerator = new ClaimNumberGenerator();
      const claimNumber = claimNumberGenerator.generateClaimNumber();
  
      // Store personal and car details in Firebase
      await storePersonalDetails(registrationNumber, personalDetails);
      await storeCarDetails(registrationNumber, carDetails);
  
      // Generate PDF
      const doc = new PDFDocument();
      doc.text(`Claim Number: ${claimNumber}`);
      
      return claimNumber;
    } catch (error) {function calculatePrice(carAge, coverLength) {
    if (coverLength === '1 day') {
      if (carAge < 5) {
        return 20.56;
      } else {
        return 29.99;
      }
    } else if (coverLength === '1 week') {
      if (carAge < 5) {
        return 60.29;
      } else {
        return 71.99;
      }
    } else if (coverLength === '1 month') {
      if (carAge < 5) {
        return 201.99;
      } else {
        return 250.99;
      }
    } else {
      throw new Error('Invalid cover length');
    }
  }
      console.error('Error handling payment and generating PDF:', error.message);
      throw error;
    }
  }
  async function storePersonalDetails(registrationNumber, personalDetails) {
    try {
      const personalDetailsRef = database.ref(`insurance-quotes/${registrationNumber}/personalDetails`);
      await personalDetailsRef.set(personalDetails);
    } catch (error) {
      console.error('Error storing personal details:', error.message);
      throw error;
    }
  }
  
  // Declare and assign a value to 'claimNumber'
  const claimNumber = 'IC1625678901';
  
  // Generate PDF
  const doc = new PDFDocument(); 
  doc.text(`Claim Number: ${claimNumber}`);
  
  async function storeCarDetails(registrationNumber, carDetails) {
    try {
      const carDetailsRef = database.ref(`insurance-quotes/${registrationNumber}/carDetails`);
      await carDetailsRef.set(carDetails);
    } catch (error) {
      console.error('Error storing car details:', error.message);
      throw error;
    }
  }



  let transporter = nodemailer.createTransport({
    service: 'gmail', // use 'gmail' or any other mail service
    auth: {
      user: 'fill this in with your Gmail', // your email
      pass: 'Gmail Password here' // your email password
    }
  });

  async function sendEmailWithPDF(email, pdfPath) {
    let mailOptions = {
      from: 'adamu44341@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Insurance PDF', // Subject line
      text: 'Please find attached the Insurance PDF.', // plain text body
      attachments: [
        {
          path: pdfPath
        }
      ]
    };

    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email with PDF:', error.message);
      throw error;
    }
  }
  
  app.post('/handlePayment', async (req, res) => {
    try {
      const { registrationNumber, token } = req.body;
  
      // Handle payment and generate PDF
      const claimNumber = await handlePaymentAndGeneratePDF(registrationNumber, token);
  
      // Send response
      res.json({ claimNumber });
    } catch (error) {
      console.error('Error handling payment and generating PDF:', error.message);
      res.status(500).json({ error: 'An error occurred while handling payment and generating PDF' });
    }
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  
  // End the PDF document
  doc.end();if (typeof window !== 'undefined') {
    window.String.prototype.randomPart = String.prototype.randomPart;
  }
  
 



