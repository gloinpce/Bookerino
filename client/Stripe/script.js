// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form validation for signup and login pages
function validateForm(form) {
    const email = form.querySelector('input[type="email"]');
    const password = form.querySelector('input[type="password"]');
    let isValid = true;
    
    // Reset error states
    form.querySelectorAll('.error').forEach(error => error.remove());
    
    // Email validation
    if (!email.value || !isValidEmail(email.value)) {
        showError(email, 'Vă rugăm introduceți o adresă de email validă.');
        isValid = false;
    }
    
    // Password validation
    if (!password.value || password.value.length < 6) {
        showError(password, 'Parola trebuie să aibă cel puțin 6 caractere.');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.style.color = 'red';
    error.style.fontSize = '0.8rem';
    error.style.marginTop = '5px';
    error.textContent = message;
    
    input.parentNode.appendChild(error);
    input.style.borderColor = 'red';
}

// Stripe integration for payment processing
// NOTĂ: Aceasta este o implementare de bază. Pentru producție, utilizați Stripe.js și server-side processing
function initializeStripe() {
    // Înlocuiți cu cheia publică Stripe
    const stripe = Stripe('pk_live_51K9tbEL2d4YZA2Ui11tmdArL8VaJMsWPAavMHJqDvC3kzm52qskn5RfN7n5axLl0lue9LoXzn1cpPyGD0hiXDv3m00E2zqLmwl');
    
    // Elemente pentru formularul de plată
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    
    cardElement.mount('#card-element');
    
    // Gestionarea erorilor
    cardElement.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
    
    // Trimiterea formularului
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const {token, error} = await stripe.createToken(cardElement);
        
        if (error) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
        } else {
            // Trimite token-ul către server
            stripeTokenHandler(token);
        }
    });
    
    function stripeTokenHandler(token) {
        // Inserează token-ul în formular pentru a-l trimite către server
        const form = document.getElementById('payment-form');
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token.id);
        form.appendChild(hiddenInput);
        
        // Trimite formularul
        form.submit();
    }
}

// Verifică dacă suntem pe o pagină care necesită Stripe
if (document.getElementById('payment-form')) {
    // Încarcă scriptul Stripe.js
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = initializeStripe;
    document.head.appendChild(script);
}