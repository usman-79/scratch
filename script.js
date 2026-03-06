// Scroll blocking removed - allowing all navigation to work normally

// Debug logging for anchor links
console.log('Script loaded - anchor links should work');

document.addEventListener('DOMContentLoaded', () => {
    // Log when DOM is ready
    console.log('DOM loaded - setting up event listeners');
    // Budget Input Functionality
    const budgetInput = document.getElementById('budget-dynamic-text');

    if (budgetInput) {
        budgetInput.addEventListener('focus', function () {
            // Clear placeholder when focused
            if (this.value === '') {
                this.placeholder = '';
            }
        });

        budgetInput.addEventListener('blur', function () {
            // Restore placeholder if empty
            if (this.value === '') {
                this.placeholder = 'Type Budget (e.g. 700k)';
            }
        });

        // Pass budget to GHL form on Enter key
        budgetInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent accidental form submissions if any

                let rawValue = this.value.trim().toLowerCase();
                let numericValue = 0;

                // Basic parsing for 'k' and 'm'
                if (rawValue.endsWith('k')) {
                    numericValue = parseFloat(rawValue) * 1000;
                } else if (rawValue.endsWith('m')) {
                    numericValue = parseFloat(rawValue) * 1000000;
                } else {
                    numericValue = parseFloat(rawValue.replace(/[^0-9.]/g, ''));
                }

                if (numericValue && !isNaN(numericValue)) {
                    // GoHighLevel assigned a strict unique hash ID for this custom field
                    // Found via scraping: "Maximum Purchase Price" -> name="lTn6DgpJQjbTlU2m5yVX"
                    const ghlParams = `lTn6DgpJQjbTlU2m5yVX=${numericValue}`;

                    // Helper function to force-reload an iframe with new params
                    function updateIframeSrc(iframeId) {
                        const frame = document.getElementById(iframeId);
                        if (!frame) return;

                        let currentSrc = frame.getAttribute('src').split('?')[0]; // strip old params
                        let newSrc = currentSrc + '?' + ghlParams;

                        // To force GHL to re-evaluate, we often have to clone and replace the iframe
                        const newFrame = frame.cloneNode(true);
                        newFrame.setAttribute('src', newSrc);
                        frame.parentNode.replaceChild(newFrame, frame);
                    }

                    // Update both forms
                    updateIframeSrc('inline-ghl-form');
                    updateIframeSrc('inline-b7iMLSrRiqy0UkVyoRu3');

                    // Briefly flash green to indicate success
                    budgetInput.style.color = '#10b981'; // success green
                    setTimeout(() => { budgetInput.style.color = 'var(--accent-color)'; }, 800);

                    budgetInput.blur(); // Remove focus
                }
            }
        });
    }

    // Location Pill Listener
    const locationBtn = document.querySelector('.location-pill');
    if (locationBtn) {
        locationBtn.addEventListener('click', () => {
            alert("This would trigger the geolocation API to find high-growth suburbs near the user.");
        });
    }

    // GHL Modal Logic
    const modal = document.getElementById('ghl-modal');
    const closeBtn = document.querySelector('.modal-close-btn');
    const ctaButtons = document.querySelectorAll('.magnet-button'); // Target all CTA buttons

    function openModal() {
        if (modal) modal.classList.add('active');
    }

    function closeModal() {
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach to all CTA buttons
    document.querySelectorAll('.magnet-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            // Close if clicking the overlay background (not the container)
            if (e.target === modal) {
                closeModal();
            }
        });
    }

});
