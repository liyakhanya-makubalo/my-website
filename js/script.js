
/* ==========================================
   LILITHA'S NATURE RELIEF
   PART 3 - JAVASCRIPT
   ========================================== */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

    /* 1. AUTOMATIC FOOTER YEAR */

    document.querySelectorAll('[data-year]').forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    /* 2. MOBILE NAVIGATION */

    const menuButton = document.getElementById('menu-toggle');
    const navigation = document.querySelector('.nav-links');

    if (menuButton && navigation) {
        menuButton.addEventListener('click', function () {
            const isOpen = navigation.classList.toggle('show');

            menuButton.setAttribute('aria-expanded', isOpen);
            menuButton.textContent = isOpen ? 'Close Menu' : 'Menu';
        });
    }


    /* 3. DYNAMIC SERVICE CONTENT */

    const serviceContainer = document.getElementById('dynamic-services');

    const services = [
        {
            title: 'Soil Testing',
            description: 'Soil testing provides information about soil conditions and supports better-informed agricultural planning.'
        },
        {
            title: 'Crop Management',
            description: 'Crop management focuses on monitoring crop conditions and providing practical guidance on crop care.'
        },
        {
            title: 'Greenhouse Services',
            description: 'Greenhouse services provide support for controlled agricultural environments and greenhouse management.'
        },
        {
            title: 'Farm Maintenance',
            description: 'Farm maintenance focuses on practical agricultural maintenance activities and organised working areas.'
        },
        {
            title: 'Agricultural Consultation',
            description: 'Agricultural consultations allow clients to discuss their specific agricultural needs and possible solutions.'
        },
        {
            title: 'Technology-Based Farming Solutions',
            description: 'Technology-based solutions support agricultural activities through monitoring tools and digital information.'
        }
    ];

    if (serviceContainer) {

        serviceContainer.innerHTML = '';

        services.forEach(function (service) {

            const article = document.createElement('article');
            article.className = 'card searchable-item';

            const heading = document.createElement('h3');
            heading.textContent = service.title;

            const paragraph = document.createElement('p');
            paragraph.textContent = service.description;

            const link = document.createElement('a');
            link.href = 'enquiry.html';
            link.className = 'button';
            link.textContent = 'Enquire about this service';

            article.appendChild(heading);
            article.appendChild(paragraph);
            article.appendChild(link);

            serviceContainer.appendChild(article);

        });

    }


    /* 4. SEARCH FUNCTIONALITY */

    const searchInput = document.getElementById('site-search');
    const searchItems = document.querySelectorAll('.searchable-item');
    const searchMessage = document.getElementById('search-message');

    if (searchInput) {

        searchInput.addEventListener('input', function () {

            const searchTerm = searchInput.value.toLowerCase().trim();
            let visibleItems = 0;

            searchItems.forEach(function (item) {

                const itemText = item.textContent.toLowerCase();

                if (itemText.includes(searchTerm)) {
                    item.hidden = false;
                    visibleItems++;
                } else {
                    item.hidden = true;
                }

            });

            if (searchMessage) {
                searchMessage.textContent =
                    visibleItems + ' result(s) found.';
            }

        });

    }


    /* 5. IMAGE GALLERY LIGHTBOX */

    const galleryImages = document.querySelectorAll('.gallery-image');

    if (galleryImages.length > 0) {

        const lightbox = document.createElement('div');

        lightbox.className = 'lightbox';

        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image gallery viewer');

        lightbox.innerHTML = `
            <button class="lightbox-close"
                    aria-label="Close image">&times;</button>

            <button class="lightbox-prev"
                    aria-label="Previous image">&#10094;</button>

            <figure>
                <img class="lightbox-image" src="" alt="">
                <figcaption class="lightbox-caption"></figcaption>
            </figure>

            <button class="lightbox-next"
                    aria-label="Next image">&#10095;</button>
        `;

        document.body.appendChild(lightbox);

        const largeImage = lightbox.querySelector('.lightbox-image');
        const caption = lightbox.querySelector('.lightbox-caption');

        const closeButton = lightbox.querySelector('.lightbox-close');
        const previousButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');

        let currentIndex = 0;
        let previousFocus = null;

        function showImage(index) {

            currentIndex =
                (index + galleryImages.length) % galleryImages.length;

            const selectedImage = galleryImages[currentIndex];

            largeImage.src = selectedImage.src;
            largeImage.alt = selectedImage.alt;

            caption.textContent = selectedImage.alt;

        }

        function openLightbox(index) {

            previousFocus = document.activeElement;

            showImage(index);

            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open');

            closeButton.focus();

        }

        function closeLightbox() {

            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open');

            if (previousFocus) {
                previousFocus.focus();
            }

        }

        galleryImages.forEach(function (image, index) {

            image.setAttribute('tabindex', '0');
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', 'Open image: ' + image.alt);

            image.addEventListener('click', function () {
                openLightbox(index);
            });

            image.addEventListener('keydown', function (event) {

                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(index);
                }

            });

        });

        closeButton.addEventListener('click', closeLightbox);

        previousButton.addEventListener('click', function () {
            showImage(currentIndex - 1);
        });

        nextButton.addEventListener('click', function () {
            showImage(currentIndex + 1);
        });

        lightbox.addEventListener('click', function (event) {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });

        document.addEventListener('keydown', function (event) {

            if (!lightbox.classList.contains('active')) return;

            if (event.key === 'Escape') {
                closeLightbox();
            }

            if (event.key === 'ArrowRight') {
                showImage(currentIndex + 1);
            }

            if (event.key === 'ArrowLeft') {
                showImage(currentIndex - 1);
            }

        });

    }


    /* 6. ACCORDION FUNCTIONALITY */

    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(function (button) {

        button.addEventListener('click', function () {

            const content = button.nextElementSibling;

            const expanded =
                button.getAttribute('aria-expanded') === 'true';

            button.setAttribute('aria-expanded', String(!expanded));

            content.hidden = expanded;

        });

    });


    /* 7. LEAFLET INTERACTIVE MAP */

    const mapElement = document.getElementById('map');

    if (mapElement && typeof L !== 'undefined') {

        const map = L.map('map').setView(
            [-32.849, 27.438],
            13
        );

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }
        ).addTo(map);

        L.marker([-32.849, 27.438])
            .addTo(map)
            .bindPopup(
                "Lilitha's Nature Relief - Bisho, Eastern Cape area"
            );

    }


    /* 8. FORM VALIDATION AND AJAX SUBMISSION */

    const forms = document.querySelectorAll('.ajax-form');

    forms.forEach(function (form) {

        form.addEventListener('submit', async function (event) {

            event.preventDefault();

            const feedback = form.querySelector('.form-feedback');
            const submitButton = form.querySelector('[type="submit"]');

            feedback.textContent = '';
            feedback.className = 'form-feedback';

            if (!form.checkValidity()) {

                form.reportValidity();

                feedback.textContent =
                    'Please correct the information in the form.';

                feedback.classList.add('error');

                return;

            }

            const phone = form.querySelector('[type="tel"]');

            if (phone) {

                const phonePattern = /^\+?[0-9\s()-]{9,18}$/;

                if (!phonePattern.test(phone.value.trim())) {

                    feedback.textContent =
                        'Please enter a valid phone number.';

                    feedback.classList.add('error');

                    phone.focus();

                    return;

                }

            }

            const honeypot = form.querySelector('[name="_honey"]');

            if (honeypot && honeypot.value !== '') {
                return;
            }

            const originalText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            try {

                const formData = new FormData(form);

                const response = await fetch(form.action, {

                    method: 'POST',

                    headers: {
                        'Accept': 'application/json'
                    },

                    body: formData

                });

                if (!response.ok) {
                    throw new Error('Form submission failed.');
                }

                const result = await response.json();

                if (result.success === 'false' || result.success === false) {
                    throw new Error('The form service did not accept the submission.');
                }

                feedback.textContent = form.dataset.successMessage;

                feedback.classList.add('success');

                form.reset();

            } catch (error) {

                feedback.textContent =
                    'We could not submit your form online. Please try again or contact us by email.';

                feedback.classList.add('error');

            } finally {

                submitButton.disabled = false;
                submitButton.textContent = originalText;

            }

        });

    });


    /* 9. DATE VALIDATION */

    const dateInputs = document.querySelectorAll('input[type="date"]');

    const today = new Date();

    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split('T')[0];

    dateInputs.forEach(function (input) {
        input.min = localToday;
    });


    /* 10. ACTIVE NAVIGATION */

    const currentPath = window.location.pathname;

    document.querySelectorAll('.nav-links a').forEach(function (link) {

        const linkPath = new URL(link.href).pathname;

        if (linkPath === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }

    });

});
