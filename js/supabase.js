/* =====================================================
   Supabase Integration for thehitchedstories
   Handles: Contact Forms, Booking Inquiries, Newsletter
   ===================================================== */

// Supabase Configuration
const SUPABASE_URL = "https://ppendsipdmdydjgpimqm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZW5kc2lwZG1keWRqZ3BpbXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MDc0NDQsImV4cCI6MjA4MjE4MzQ0NH0.15HobrSwCl2VNVKfsnTbS39pt6Mr5HNpvEyGavZ2hdQ";

// EmailJS Configuration
const EMAILJS_SERVICE_ID = "service_j7phpc5";
const EMAILJS_TEMPLATE_ID = "template_nsdhrs8";
const EMAILJS_PUBLIC_KEY = "vIgzuSyqQZn93Za4-";

// API Headers for Supabase
const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
};

/**
 * Submit Contact Form to Supabase
 * Table: contacts
 */
async function submitContactForm(formData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                wedding_date: formData.weddingDate || null,
                location: formData.location || null,
                service: formData.service || null,
                message: formData.message,
                created_at: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { success: true, message: "Message sent successfully!" };
    } catch (error) {
        console.error("Error submitting contact form:", error);
        return { success: false, message: "Failed to send message. Please try again." };
    }
}

/**
 * Submit Newsletter Subscription to Supabase
 * Table: newsletter
 */
async function submitNewsletter(email) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/newsletter`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                email: email,
                subscribed_at: new Date().toISOString(),
                status: "active"
            })
        });

        if (!response.ok) {
            // Check if it's a duplicate email
            if (response.status === 409) {
                return { success: false, message: "This email is already subscribed!" };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { success: true, message: "Successfully subscribed to newsletter!" };
    } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        return { success: false, message: "Failed to subscribe. Please try again." };
    }
}

/**
 * Submit Booking Inquiry to Supabase
 * Table: bookings
 */
async function submitBookingInquiry(bookingData) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                name: bookingData.name,
                email: bookingData.email,
                phone: bookingData.phone || null,
                wedding_date: bookingData.weddingDate || null,
                location: bookingData.location || null,
                service_type: bookingData.serviceType || null,
                budget: bookingData.budget || null,
                message: bookingData.message || null,
                status: "pending",
                created_at: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { success: true, message: "Booking inquiry submitted successfully!" };
    } catch (error) {
        console.error("Error submitting booking inquiry:", error);
        return { success: false, message: "Failed to submit inquiry. Please try again." };
    }
}

/**
 * Send Email via EmailJS
 */
async function sendEmailNotification(formData) {
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: {
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone || 'Not provided',
                    wedding_date: formData.weddingDate || 'Not provided',
                    location: formData.location || 'Not provided',
                    service: formData.service || 'Not specified',
                    message: formData.message,
                    email: formData.email
                }
            })
        });

        if (!response.ok) {
            throw new Error('Email send failed');
        }

        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false };
    }
}

/**
 * Initialize Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone')?.value || '',
            weddingDate: document.getElementById('weddingDate')?.value || '',
            location: document.getElementById('location')?.value || '',
            service: document.getElementById('service')?.value || '',
            message: document.getElementById('message').value
        };

        // Save to Supabase AND send email notification
        const [supabaseResult, emailResult] = await Promise.all([
            submitContactForm(formData),
            sendEmailNotification(formData)
        ]);

        // Show result
        if (supabaseResult.success) {
            if (emailResult.success) {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            } else {
                showNotification('Message saved! Email notification may be delayed.', 'success');
            }
            form.reset();
        } else {
            showNotification(supabaseResult.message, 'error');
        }

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

/**
 * Initialize Newsletter Form Handler
 */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const emailInput = form.querySelector('input[type="email"]');
        const originalText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        const result = await submitNewsletter(emailInput.value);

        // Show result
        if (result.success) {
            showNotification(result.message, 'success');
            form.reset();
        } else {
            showNotification(result.message, 'error');
        }

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

/**
 * Show Notification Toast
 */
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-toast--${type}`;
    notification.innerHTML = `
        <span class="notification-toast__message">${message}</span>
        <button class="notification-toast__close" onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('notification-toast--hide');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize forms when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
    initNewsletterForm();
});
