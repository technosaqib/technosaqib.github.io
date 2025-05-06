document.addEventListener('DOMContentLoaded', () => {
    const agreementOverlay = document.getElementById('agreement-overlay');
    const websiteContent = document.getElementById('website-content');
    const agreeButton = document.getElementById('agree-btn');
    const disagreeButton = document.getElementById('disagree-btn');
    const agreementKey = 'chatAgreementAccepted'; // More descriptive key

    // Check if the user has previously agreed on page load
    if (localStorage.getItem(agreementKey) === 'true') {
        agreementOverlay.classList.add('hidden');
        websiteContent.classList.remove('hidden');
    }

    agreeButton.addEventListener('click', () => {
        localStorage.setItem(agreementKey, 'true');
        agreementOverlay.classList.add('hidden');
        websiteContent.classList.remove('hidden');
    });

    disagreeButton.addEventListener('click', () => {
        // Redirect the user away from the site - Consider a more user-friendly message
        window.location.href = 'https://www.google.com'; // You can customize this URL
    });
});
