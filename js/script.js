/* Lilitha's Nature Relief - Part 3 interactive features */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

    // Display the current date and time using South African Standard Time.
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');

    function updateSouthAfricanClock() {
        const now = new Date();

        const dateOptions = {
            timeZone: 'Africa/Johannesburg',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        };

        const timeOptions = {
            timeZone: 'Africa/Johannesburg',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        if (dateElement) {
            dateElement.textContent =
                new Intl.DateTimeFormat('en-ZA', dateOptions).format(now);
        }

        if (timeElement) {
            timeElement.textContent =
                new Intl.DateTimeFormat('en-ZA', timeOptions).format(now);
        }
    }

    updateSouthAfricanClock();
    window.setInterval(updateSouthAfricanClock, 1000);

    // Update the copyright year automatically.
    document.querySelectorAll('footer p').forEach(function (footer) {
        footer.innerHTML = footer.innerHTML.replace(
            /©\s*\d{4}/,
            '© ' + new Date().getFullYear()
        );
    });

    // Highlight the current page in the navigation.
    const currentFile =
        window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a').forEach(function (link) {
        const linkFile = link.getAttribute('href').split('/').pop();

        if (linkFile === currentFile) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });

    // Live search for service and project cards.
    const search = document.getElementById('content-search');

    if (search) {
        const cards = Array.from(
            document.querySelectorAll('.searchable-grid .card')
        );

        const count = document.getElementById('search-count');

        function filterCards() {
            const term = search.value.trim().toLocaleLowerCase();
            let visible = 0;

            cards.forEach(function (card) {
                const matches = card.textContent
                    .toLocaleLowerCase()
                    .includes(term);

                card.hidden = !matches;

                if (matches) {
                    visible++;
                }
            });

            if (count) {
                count.textContent =
                    visible + ' item' + (visible === 1 ? '' : 's') + ' shown';
            }
        }

        search.addEventListener('input', filterCards);
        filterCards();
    }

    // Accessible image lightbox for project/gallery images.
    const images = document.querySelectorAll('.card img, .gallery-image');

    if (images.length) {
        const lightbox = document.createElement('div');

        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Enlarged image preview');

        lightbox.innerHTML = `
            <button type="button" class="lightbox-close"
                aria-label="Close image preview">&times;</button>
            <img alt="">
            <p class="lightbox-caption"></p>
        `;

        document.body.appendChild(lightbox);

        const preview = lightbox.querySelector('img');
        const caption = lightbox.querySelector('.lightbox-caption');

        let previousFocus = null;

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');

            if (previousFocus) {
                previousFocus.focus();
            }
        }

        images.forEach(function (img) {
            img.classList.add('zoomable-image');
            img.tabIndex = 0;
            img.setAttribute('role', 'button');

            img.setAttribute(
                'aria-label',
                'View larger image: ' + (img.alt || 'Website image')
            );

            function openLightbox() {
                previousFocus = img;
                preview.src = img.currentSrc || img.src;
                preview.alt = img.alt || 'Enlarged website image';
                caption.textContent = img.alt || '';

                lightbox.classList.add('open');
                document.body.classList.add('no-scroll');

                lightbox.querySelector('.lightbox-close').focus();
            }

            img.addEventListener('click', openLightbox);

            img.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox();
                }
            });
        });

        lightbox.querySelector('.lightbox-close')
            .addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (
                event.key === 'Escape' &&
                lightbox.classList.contains('open')
            ) {
                closeLightbox();
            }
        });
    }

    // Prevent consultation dates in the past.
    const dateInput = document.getElementById('date');

    if (dateInput) {
        const southAfricanToday = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Johannesburg',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date());

        dateInput.min = southAfricanToday;
    }

    // Validate and submit forms through FormSubmit's AJAX endpoint.
    function setupAjaxForm(formId, feedbackId) {
        const form = document.getElementById(formId);
        const feedback = document.getElementById(feedbackId);

        if (!form || !feedback) {
            return;
        }

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            feedback.textContent = '';
            feedback.className = 'form-feedback';

            if (!form.checkValidity()) {
                form.reportValidity();

                feedback.textContent =
                    'Please complete all required fields and correct any invalid information.';

                feedback.classList.add('error');
                return;
            }

            const phone = form.querySelector('input[type="tel"]');

            if (phone) {
                const digits = phone.value.replace(/\D/g, '');

                if (digits.length < 9 || digits.length > 12) {
                    phone.setCustomValidity(
                        'Enter a valid South African or international phone number.'
                    );

                    phone.reportValidity();
                    phone.setCustomValidity('');
                    return;
                }
            }

            const submitButton =
                form.querySelector('button[type="submit"]');

            const originalLabel = submitButton
                ? submitButton.textContent
                : '';

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            try {
                const data = Object.fromEntries(
                    new FormData(form).entries()
                );

                const email = form.querySelector('input[type="email"]');

                if (email) {
                    data._replyto = email.value.trim();
                }

                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json().catch(function () {
                    return {};
                });

                if (
                    !response.ok ||
                    result.success === false ||
                    result.success === 'false'
                ) {
                    throw new Error(
                        result.message ||
                        'The form service did not accept the submission.'
                    );
                }

                feedback.textContent =
                    formId === 'enquiry-form'
                        ? 'Thank you. Your consultation request has been sent. We will contact you to discuss availability.'
                        : 'Thank you. Your message has been sent successfully.';

                feedback.classList.add('success');
                form.reset();

                if (dateInput) {
                    dateInput.min = new Intl.DateTimeFormat('en-CA', {
                        timeZone: 'Africa/Johannesburg',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).format(new Date());
                }

            } catch (error) {
                feedback.textContent =
                    'We could not confirm that your message was delivered. Please email makubaloliyakhanya@gmail.com directly. ' +
                    error.message;

                feedback.classList.add('error');

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalLabel;
                }
            }
        });
    }

    setupAjaxForm('enquiry-form', 'enquiry-feedback');
    setupAjaxForm('contact-form', 'contact-feedback');

    // Leaflet map. The marker is an approximate point in Bisho.
    const mapElement = document.getElementById('leaflet-map');

    if (mapElement) {
        if (window.L) {
            const bisho = [-32.847, 27.442];

            const map = L.map(mapElement).setView(bisho, 14);

            L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
            ).addTo(map);

            L.marker(bisho)
                .addTo(map)
                .bindPopup(
                    '<strong>Lilitha\'s Nature Relief</strong><br>Approximate Bisho area'
                )
                .openPopup();

        } else {
            mapElement.textContent =
                'The interactive map could not load. Please check your internet connection.';
        }
    }

    // Back-to-top button.
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        function updateBackToTop() {
            backToTop.classList.toggle(
                'visible',
                window.scrollY > 350
            );
        }

        window.addEventListener(
            'scroll',
            updateBackToTop,
            { passive: true }
        );

        updateBackToTop();

        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
