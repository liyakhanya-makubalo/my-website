
'use strict';

document.addEventListener('DOMContentLoaded', function () {

    // Update copyright year
    document.querySelectorAll('footer p').forEach(function (footer) {
        footer.innerHTML = footer.innerHTML.replace(
            /©\s*\d{4}/,
            '© ' + new Date().getFullYear()
        );
    });

    // Highlight the active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a').forEach(function (link) {
        const linkPage = link.getAttribute('href').split('/').pop();

        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Search cards
    const search = document.getElementById('content-search');

    if (search) {
        const cards = document.querySelectorAll('.searchable-grid .card');
        const count = document.getElementById('search-count');

        search.addEventListener('input', function () {
            let visible = 0;

            cards.forEach(function (card) {
                const matches = card.textContent.toLowerCase()
                    .includes(search.value.toLowerCase());

                card.hidden = !matches;

                if (matches) visible++;
            });

            if (count) {
                count.textContent = visible + ' results found';
            }
        });
    }

    // Gallery lightbox
    const images = document.querySelectorAll('.card img');

    if (images.length) {
        const lightbox = document.createElement('div');

        lightbox.className = 'lightbox';

        lightbox.innerHTML =
            '<button class="lightbox-close" aria-label="Close">&times;</button>' +
            '<img alt="">' +
            '<p class="lightbox-caption"></p>';

        document.body.appendChild(lightbox);

        const largeImage = lightbox.querySelector('img');
        const caption = lightbox.querySelector('.lightbox-caption');

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }

        images.forEach(function (img) {
            img.classList.add('zoomable-image');

            function openLightbox() {
                largeImage.src = img.src;
                largeImage.alt = img.alt;
                caption.textContent = img.alt;

                lightbox.classList.add('open');
                document.body.classList.add('no-scroll');
            }

            img.addEventListener('click', openLightbox);
        });

        lightbox.querySelector('.lightbox-close')
            .addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeLightbox();
        });
    }

    // Set minimum consultation date
    const dateInput = document.getElementById('date');

    if (dateInput) {
        const today = new Date();
        const date = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split('T')[0];

        dateInput.min = date;
    }

    // Form validation only.
    // IMPORTANT: Do not use preventDefault or fetch here.
    // The browser must submit the form to FormSubmit.
    document.querySelectorAll('#contact-form, #enquiry-form')
        .forEach(function (form) {

            form.addEventListener('submit', function (event) {

                if (!form.checkValidity()) {
                    event.preventDefault();
                    form.reportValidity();
                    return;
                }

                const feedback = form.querySelector('.form-feedback');

                if (feedback) {
                    feedback.textContent =
                        'Your form is being submitted. Please wait...';
                    feedback.className = 'form-feedback success';
                }

            });

        });

    // Interactive Leaflet map
    const mapElement = document.getElementById('leaflet-map');

    if (mapElement && window.L) {

        const map = L.map(mapElement).setView([-32.847, 27.442], 13);

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }
        ).addTo(map);

        L.marker([-32.847, 27.442])
            .addTo(map)
            .bindPopup("Lilitha's Nature Relief - Bisho area");

    }

    // Back-to-top button
    const topButton = document.getElementById('back-to-top');

    if (topButton) {

        window.addEventListener('scroll', function () {
            topButton.classList.toggle('visible', window.scrollY > 300);
        });

        topButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

    }

});

