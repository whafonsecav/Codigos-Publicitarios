document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       1. TABS (PESTAÑAS)
       ========================================================= */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('active');
                // Reiniciar animación
                p.style.animation = 'none';
                p.offsetHeight; /* trigger reflow */
                p.style.animation = null;
            });

            // Activar actual
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* =========================================================
       2. LIGHTBOX DE IMÁGENES
       ========================================================= */
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close-modal');
    const zoomImages = document.querySelectorAll('.zoom-image, .card-image-wrapper');

    zoomImages.forEach(imgElement => {
        imgElement.addEventListener('click', (e) => {
            // Buscamos la etiqueta img contenida, o si el propio elemento es img
            let targetImg = (e.currentTarget.tagName.toLowerCase() === 'img')
                ? e.currentTarget
                : e.currentTarget.querySelector('img');

            if (targetImg) {
                modalImg.src = targetImg.src;
                modal.style.display = 'flex';
                // Trigger transition
                setTimeout(() => {
                    modal.classList.add('show');
                }, 10);
            }
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Coincide con CSS transition
    };

    closeBtn.addEventListener('click', closeModal);

    // Cerrar al clickear fuera de la imagen
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    /* =========================================================
       3. PARTÍCULAS (particles.js)
       ========================================================= */
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": { "enable": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.1,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": { "enable": false }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "bubble" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "bubble": {
                        "distance": 200,
                        "size": 6,
                        "duration": 2,
                        "opacity": 1,
                        "speed": 3
                    },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    /* =========================================================
       4. ANIMACIONES AL HACER SCROLL (Intersection Observer)
       ========================================================= */
    function setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // El elemento dispara la animación cuando el 15% es visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    // Remover clase para que se vuelva a animar si se retrocede el scroll
                    entry.target.classList.remove('in-view');
                }
            });
        }, observerOptions);

        const sections = document.querySelectorAll('.snap-section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Inicializar observador de scroll
    setupScrollAnimations();

    /* =========================================================
       5. OPTIMIZACIÓN DE VIDEO (Fullscreen Anti-Lag)
       ========================================================= */
    const videos = document.querySelectorAll('video');
    const particlesContainer = document.getElementById('particles-js');

    if (particlesContainer && videos.length > 0) {
        // Cuando cualquier elemento entra o sale de fullscreen
        document.addEventListener('fullscreenchange', handleFullscreen);
        document.addEventListener('webkitfullscreenchange', handleFullscreen); // Safari/Edge antiguos
        document.addEventListener('mozfullscreenchange', handleFullscreen);    // Firefox

        function handleFullscreen() {
            // Si hay un elemento en fullscreen (el video)
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
                // Ocultar las partículas que consumen mucha GPU por debajo
                particlesContainer.style.display = 'none';
            } else {
                // Al salir del fullscreen, volver a mostrar
                particlesContainer.style.display = 'block';
            }
        }
    }

    /* =========================================================
       6. BOTÓN SCROLL AUTOMÁTICO (Siguiente)
       ========================================================= */
    const scrollNextBtns = document.querySelectorAll('.scroll-next-btn');

    scrollNextBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Encontrar la parent article section actual
            const currentSection = this.closest('.snap-section');
            if (!currentSection) return;

            // Encontrar la TAB que contiene la sección actual
            const tabPane = currentSection.closest('.tab-pane');
            if (!tabPane) return;

            // Conseguir todas las secciones dentro de esta TAB particular
            const allSectionsInTab = Array.from(tabPane.querySelectorAll('.snap-section'));
            // Encontrar el indice de la seccion actual
            const currentIndex = allSectionsInTab.indexOf(currentSection);

            // Si hay una seccion despues de esta, scrollear suavemente a ella
            if (currentIndex !== -1 && currentIndex < allSectionsInTab.length - 1) {
                const nextSection = allSectionsInTab[currentIndex + 1];
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
