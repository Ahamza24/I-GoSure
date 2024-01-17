
const admin = require('firebase-admin');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');



/**
* Template Name: Vesperr
* Updated: Sep 18 2023 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/vesperr-free-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

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

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})()

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA-iruf5t3PN3nSUNa7hHPwO1v-qS63Rs",
  authDomain: "i-gosure.firebaseapp.com",
  databaseURL: "https://i-gosure-default-rtdb.firebaseio.com", // Replace with your actual Firebase database URL
  projectId: "i-gosure",
  storageBucket: "i-gosure.appspot.com",
  messagingSenderId: "938934389841",
  appId: "1:938934389841:web:92187069449c10b980bc70",
  measurementId: "G-3GTNX2147D"
};

// Example: Writing insurance quote data
const quoteData = {
  registration: "<registrationNumber>",
  claimNumber: "<claimNumber>",
  carDetails: {
    make: "<carMake>",
    model: "<carModel>",
    year: "<carYear>",
    color: "<carColor>",
    // ...
  },
  amount: "<quoteAmount>",
  timestamp: firebase.database.ServerValue.TIMESTAMP,
  paymentStatus: "Pending",
};

// Write to the database
database.ref('insurance-quotes').push(quoteData);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const database = firebase.database();

// Assuming you have an HTML form with input fields for registration, personal details, and bank details

// Function to handle the registration check and display car details
// Function to check registration against an API
async function checkRegistration(registrationNumber) {
  try {
    // Use your registration API here
    // Replace 'your_registration_api_url' with the actual URL of your registration API
    const response = await fetch('9134bdee-2490-4f76-ae30-fc01736f9b80', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registrationNumber }),
    });

    if (!response.ok) {
      throw new Error('Registration API failed');
    }

    // Assuming the API response contains car details in JSON format
    const carDetails = await response.json();
    return carDetails;
  } catch (error) {
    console.error('Error checking registration:', error.message);
    // Handle error on the UI or throw an error to be caught in the calling function
    throw error;
  }
}

// Function to handle registration check and display car details
async function handleRegistrationCheck() {
  const registrationNumber = document.getElementById('registrationInput').value;

  try {
    // Check registration against an API
    const carDetails = await checkRegistration(registrationNumber);

    // Display car details (you can update this part based on your UI)
    console.log('Car Details:', carDetails);

    // After displaying car details, you can request personal and bank details
    // (assuming you have a function for this on your UI)
    requestPersonalAndBankDetails(registrationNumber);
  } catch (error) {
    console.error('Error checking registration:', error.message);
    // Handle error on the UI
  }
}

// Function to handle payment and generate PDF after successful payment
async function handlePaymentAndGeneratePDF() {
  const registrationNumber = document.getElementById('registrationInput').value;
  const personalDetails = getPersonalDetails(); // Implement this function to get personal details
  const bankDetails = getBankDetails(); // Implement this function to get bank details

  try {
    // Generate insurance quote and claim number
    const { quoteID, claimNumber } = await generateInsuranceQuote(registrationNumber, quoteData.amount); // Fix: Use quoteData.amount instead of amount

    // Display quote information on the UI (you can update this part based on your UI)
    console.log('Quote Information:', { quoteID, claimNumber });

    // Assuming you have a function to handle payment with Stripe on your UI
    const token = await handleStripePayment(); // Implement this function on your UI

    // After successful payment, store personal details and car details
    if (token) {
      // Store personal details in Realtime Database
      await storePersonalDetails(registrationNumber, personalDetails);

      // Store car details in Realtime Database
      const carDetails = await checkRegistration(registrationNumber);
      await storeCarDetails(registrationNumber, carDetails);

      // Generate PDF
      const pdfContent = `Welcome to I-GoSure Insurance. Your claim number is: ${claimNumber}`;
      generateAndSendPDF(pdfContent, personalDetails.email);

      // You can also update the UI to show that the process is complete
      console.log('Process completed successfully!');
    }
  } catch (error) {
    console.error('Error processing payment:', error.message);
    // Handle error on the UI
  }
}


// Function to store personal details in Realtime Database
async function storePersonalDetails(registrationNumber, personalDetails) {
  try {
    // Get a reference to the Realtime Database
    const database = firebase.database();

    // Store personal details under a path specific to the registration number
    const personalDetailsRef = database.ref(`personal-details/${registrationNumber}`);
    await personalDetailsRef.set(personalDetails);

    console.log('Personal details stored in Realtime Database.');
  } catch (error) {
    console.error('Error storing personal details:', error.message);
    // Handle error on the UI
  }
}


// Function to generate and send PDF
async function generateAndSendPDF(content, email) {
  try {
    // Create PDF using a library like pdfkit
    const pdfDoc = new PDFDocument();
    pdfDoc.text(content);
    const pdfBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      pdfDoc.on('data', buffers.push.bind(buffers));
      pdfDoc.on('end', () => resolve(Buffer.concat(buffers)));
      pdfDoc.end();
    });

    // Send email with PDF attachment
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Replace with your actual Gmail account
        pass: 'your-password', // Replace with your email password or use an app-specific password
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Welcome to I-GoSure Insurance',
      text: `Thank you for choosing I-GoSure Insurance. Your claim number is: ${claimNumber}`,
      attachments: [
        {
          filename: 'welcome_letter.pdf',
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error generating or sending PDF:', error.message);
    // Handle error on the UI
  }
}

// Function to fetch claim number from Realtime Database
async function fetchClaimNumber(registrationNumber) {
  try {
    // Get a reference to the Realtime Database
    const database = firebase.database();

    // Retrieve claim number based on registration number
    const claimNumberRef = database.ref(`insurance-quotes/${registrationNumber}/claimNumber`);
    const snapshot = await claimNumberRef.once('value');

    const claimNumber = snapshot.val();
    return claimNumber;
  } catch (error) {
    console.error('Error fetching claim number:', error.message);
    // Handle error on the UI
  }
}

// Function to store car details in Realtime Database
async function storeCarDetails(registrationNumber, carDetails) {
  try {
    // Get a reference to the Realtime Database
    const database = firebase.database();

    // Store car details under a path specific to the registration number
    const carDetailsRef = database.ref(`car-details/${registrationNumber}`);
    await carDetailsRef.set(carDetails);

    console.log('Car details stored in Realtime Database.');
  } catch (error) {
    console.error('Error storing car details:', error.message);
    // Handle error on the UI
  }
}

// Modify the handlePaymentAndGeneratePDF function to store car details
async function handlePaymentAndGeneratePDF() {
  const registrationNumber = document.getElementById('registrationInput').value;
  const personalDetails = getPersonalDetails(); // Implement this function to get personal details
  const bankDetails = getBankDetails(); // Implement this function to get bank details

  try {
    // Generate insurance quote and claim number
    const { quoteID, claimNumber } = await generateInsuranceQuote(registrationNumber, amount);

    // Display quote information on the UI (you can update this part based on your UI)
    console.log('Quote Information:', { quoteID, claimNumber });

    // Assuming you have a function to handle payment with Stripe on your UI
    const token = await handleStripePayment(); // Implement this function on your UI

    // After successful payment, store personal details and car details
    if (token) {
      // Store personal details in Realtime Database
      await storePersonalDetails(registrationNumber, personalDetails);

      // Store car details in Realtime Database
      const carDetails = await checkRegistration(registrationNumber);
      await storeCarDetails(registrationNumber, carDetails);

      // Generate PDF
      const pdfContent = `Welcome to I-GoSure Insurance. Your claim number is: ${claimNumber}`;
      generateAndSendPDF(pdfContent, personalDetails.email);

      // You can also update the UI to show that the process is complete
      console.log('Process completed successfully!');
    }
  } catch (error) {
    console.error('Error processing payment:', error.message);
    // Handle error on the UI
  }
}

// Usage example to fetch claim number
const registrationNumber = 'your_registration_number';
const fetchedClaimNumber = await fetchClaimNumber(registrationNumber);
console.log('Fetched Claim Number:', fetchedClaimNumber);

