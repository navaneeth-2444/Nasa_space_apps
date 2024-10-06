const button = document.getElementById('playButton');
        const container = document.querySelector('.button-container');

        function createRipple() {
            const ripple = document.createElement('div');
            ripple.classList.add('glow');
            container.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 3000);
        }

        setInterval(createRipple, 1500);

        button.addEventListener('click', () => {
            window.location.href = 'your-game-page.html';
        });

        button.addEventListener('mouseover', () => {
            button.style.transform = 'translate(-50%, -50%) scale(1.1)';
            button.style.backgroundColor = 'rgba(26, 26, 26, 0.2)';
            button.querySelector('span').style.fontSize = '30px';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'translate(-50%, -50%) scale(1)';
            button.style.backgroundColor = 'rgba(26, 26, 26, 0.1)';
            button.querySelector('span').style.fontSize = '28px';
        });

        // Particle.js configuration
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#1a1a1a' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#1a1a1a', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });