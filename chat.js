document.addEventListener('DOMContentLoaded', () => {
    const agreementOverlay = document.getElementById('agreement-overlay');
    const websiteContent = document.getElementById('website-content');
    const agreeButton = document.getElementById('agree-btn');
    const disagreeButton = document.getElementById('disagree-btn');
    const agreementKey = 'chatAgreementAccepted'; // More descriptive key

    // Check if the user has previously agreed on page load
    if (localStorage.getItem(agreementKey) === 'true') {
        if (agreementOverlay) {
            agreementOverlay.classList.add('hidden');
        }
        if (websiteContent) {
            websiteContent.classList.remove('hidden');
        }
    }

    // Event listener for the "Agree" button
    if (agreeButton) {
        agreeButton.addEventListener('click', () => {
            localStorage.setItem(agreementKey, 'true');
            if (agreementOverlay) {
                agreementOverlay.classList.add('hidden');
            }
            if (websiteContent) {
                websiteContent.classList.remove('hidden');
            }
        });
    } else {
        console.error("Error: 'Agree' button element not found.");
    }

    // Event listener for the "Disagree" button
    if (disagreeButton) {
        disagreeButton.addEventListener('click', () => {
            // Redirect the user away from the site - Consider a more user-friendly message
            window.location.href = 'https://www.google.com'; // You can customize this URL
        });
    } else {
        console.error("Error: 'Disagree' button element not found.");
    }
});
