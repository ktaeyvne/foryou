// Three.js - Galaxy Love with Heart and Floating Photos
// Include Three.js from CDN

let scene, camera, renderer;
let particles, heartParticles;
let photoCards = [];
let floatingElements = [];
let starParticles = [];
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let isInitialized = false;

// Photo URLs - multiple copies for more photos (18 photos total)
const photoUrls = [
    '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg',
    '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg',
    '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg'
];

// Emoji and symbol arrays for floating elements
const floatingEmojis = ['💕', '💖', '💗', '💓', '💞', '💘', '💝', '✨', '🌟', '💫', '⭐', '🌸', '🌺', '🌹', '🥰', '😘', '❤️', '🧡', '💜', '💙'];

function initGalaxy() {
    // Prevent double initialization
    if (isInitialized) return;
    isInitialized = true;
    
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0015, 0.002);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0a0015, 1);
    
    const galaxyContainer = document.getElementById('galaxy-canvas');
    if (galaxyContainer) {
        // Clear any existing canvas
        galaxyContainer.innerHTML = '';
        galaxyContainer.appendChild(renderer.domElement);
    }
    
    // Create galaxy particles - more particles for richer look
    createGalaxyParticles();
    
    // Create heart particles - bigger heart formation
    createHeartParticles();
    
    // Create floating photo cards - more photos
    createPhotoCards();
    
    // Create floating emoji/star elements
    createFloatingElements();
    
    // Create star twinkle effects
    createStarTwinkles();
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xff4ecd, 2, 100);
    pointLight1.position.set(0, 0, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff0080, 1.5, 80);
    pointLight2.position.set(20, 20, 15);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x667eea, 1.5, 80);
    pointLight3.position.set(-20, -20, 15);
    scene.add(pointLight3);
    
    // Mouse movement
    document.addEventListener('mousemove', onMouseMove);
    
    // Touch events for mobile
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    animate();
}

function createGalaxyParticles() {
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        const radius = Math.random() * 100;
        const spinAngle = radius * 0.5;
        const branchAngle = (i % 5) / 5 * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
        
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX * 10;
        positions[i3 + 1] = Math.sin(branchAngle + spinAngle) * radius + randomY * 10;
        positions[i3 + 2] = randomZ * 25;
        
        const colorChoice = Math.random();
        if (colorChoice < 0.3) {
            colors[i3] = 1;
            colors[i3 + 1] = 1;
            colors[i3 + 2] = 1;
        } else if (colorChoice < 0.6) {
            colors[i3] = 1;
            colors[i3 + 1] = 0.3 + Math.random() * 0.4;
            colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        } else {
            colors[i3] = 0.6 + Math.random() * 0.4;
            colors[i3 + 1] = 0.2 + Math.random() * 0.3;
            colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        }
        
        sizes[i] = Math.random() * 2.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createHeartParticles() {
    const heartGeometry = new THREE.BufferGeometry();
    const particleCount = 2500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const scale = 12;
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        const t = Math.random() * Math.PI * 2;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        
        const spread = 0.5;
        x += (Math.random() - 0.5) * spread;
        y += (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * spread * 4;
        
        positions[i3] = x * scale * 0.1;
        positions[i3 + 1] = y * scale * 0.1;
        positions[i3 + 2] = z;
        
        const colorMix = Math.random();
        const colorChoice = Math.random();
        
        if (colorChoice < 0.4) {
            colors[i3] = 1;
            colors[i3 + 1] = 0.2 + colorMix * 0.3;
            colors[i3 + 2] = 0.5 + colorMix * 0.4;
        } else if (colorChoice < 0.7) {
            colors[i3] = 0.6 + colorMix * 0.3;
            colors[i3 + 1] = 0.2 + colorMix * 0.2;
            colors[i3 + 2] = 0.9 + colorMix * 0.1;
        } else {
            colors[i3] = 1;
            colors[i3 + 1] = 0.8 + colorMix * 0.2;
            colors[i3 + 2] = 0.9 + colorMix * 0.1;
        }
    }
    
    heartGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    heartGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const heartMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });
    
    heartParticles = new THREE.Points(heartGeometry, heartMaterial);
    scene.add(heartParticles);
}

function createPhotoCards() {
    const cardCount = photoUrls.length;
    
    for (let i = 0; i < cardCount; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 250;
        const ctx = canvas.getContext('2d');
        
        const borderColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#ff4ecd', '#00d2d3'];
        ctx.fillStyle = borderColors[i % borderColors.length];
        ctx.fillRect(0, 0, 200, 250);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(8, 8, 184, 200);
        
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(15, 15, 170, 170);
        
        const img = new Image();
        img.src = photoUrls[i];
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95
        });
        
        const sprite = new THREE.Sprite(material);
        
        const ringIndex = Math.floor(i / 6);
        const ringRadius = 12 + ringIndex * 8 + Math.random() * 5;
        const angle = (i / cardCount) * Math.PI * 2 + ringIndex * 0.5;
        
        sprite.position.x = Math.cos(angle) * ringRadius;
        sprite.position.y = Math.sin(angle) * ringRadius * 0.7;
        sprite.position.z = (Math.random() - 0.5) * 20 + ringIndex * 3;
        
        const scale = 3 + Math.random() * 2;
        sprite.scale.set(scale, scale * 1.25, 1);
        
        sprite.userData = {
            originalY: sprite.position.y,
            floatSpeed: 0.3 + Math.random() * 0.4,
            floatOffset: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.015,
            angle: angle,
            radius: ringRadius,
            orbitSpeed: 0.05 + Math.random() * 0.05,
            orbitDirection: Math.random() > 0.5 ? 1 : -1
        };
        
        photoCards.push(sprite);
        scene.add(sprite);
        
        img.onload = function() {
            ctx.drawImage(img, 15, 15, 170, 170);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(15, 15, 170, 170);
            texture.needsUpdate = true;
        };
        
        img.onerror = function() {
            ctx.fillStyle = borderColors[i % borderColors.length];
            ctx.fillRect(15, 15, 170, 170);
            ctx.fillStyle = '#fff';
            ctx.font = '50px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(['📸', '💕', '🌟', '✨', '💖', '❤️'][i % 6], 100, 110);
            texture.needsUpdate = true;
        };
    }
}

function createFloatingElements() {
    for (let i = 0; i < 40; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(floatingEmojis[i % floatingEmojis.length], 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.7 + Math.random() * 0.3
        });
        
        const sprite = new THREE.Sprite(material);
        
        // Random position in a sphere - fixed position
        const radius = 25 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        sprite.position.x = radius * Math.sin(phi) * Math.cos(theta);
        sprite.position.y = radius * Math.sin(phi) * Math.sin(theta) - 5;
        sprite.position.z = radius * Math.cos(phi);
        
        const size = 1 + Math.random() * 2;
        sprite.scale.set(size, size, 1);
        
        // Simple userData - just position, no animation
        sprite.userData = {
            isFloatingElement: true
        };
        
        floatingElements.push(sprite);
        scene.add(sprite);
    }
}

function createStarTwinkles() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 200;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        const radius = 30 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        const brightChoice = Math.random();
        if (brightChoice < 0.3) {
            colors[i3] = 1;
            colors[i3 + 1] = 0.9 + Math.random() * 0.1;
            colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        } else if (brightChoice < 0.6) {
            colors[i3] = 1;
            colors[i3 + 1] = 0.4 + Math.random() * 0.3;
            colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        } else {
            colors[i3] = 0.8 + Math.random() * 0.2;
            colors[i3 + 1] = 0.6 + Math.random() * 0.3;
            colors[i3 + 2] = 1;
        }
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });
    
    const starField = new THREE.Points(starGeometry, starMaterial);
    starField.userData = { isStarField: true };
    starParticles.push(starField);
    scene.add(starField);
}

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
}

// Touch support for mobile devices
let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;

function onTouchStart(event) {
    if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        isTouching = true;
    }
}

function onTouchMove(event) {
    if (isTouching && event.touches.length === 1) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        
        // Calculate delta from start position
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        
        // Update mouse values based on touch movement
        // Scale down the effect for smoother control
        mouseX += deltaX * 0.002;
        mouseY += deltaY * 0.002;
        
        // Clamp values to prevent extreme rotation
        mouseX = Math.max(-2, Math.min(2, mouseX));
        mouseY = Math.max(-2, Math.min(2, mouseY));
        
        // Reset start position for continuous movement
        touchStartX = touchX;
        touchStartY = touchY;
    }
}

function onTouchEnd() {
    isTouching = false;
    // Slowly return to center when not touching
    const returnToCenter = setInterval(() => {
        if (!isTouching) {
            mouseX *= 0.95;
            mouseY *= 0.95;
            
            // Stop when close to center
            if (Math.abs(mouseX) < 0.01 && Math.abs(mouseY) < 0.01) {
                mouseX = 0;
                mouseY = 0;
                clearInterval(returnToCenter);
            }
        }
    }, 50);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    if (particles) {
        particles.rotation.y += 0.0008;
        particles.rotation.x += 0.0003;
        particles.rotation.z += 0.0001;
    }
    
    if (heartParticles) {
        heartParticles.rotation.y = Math.sin(time * 0.4) * 0.3;
        heartParticles.position.y = Math.sin(time * 0.6) * 1;
        
        const pulse = 1 + Math.sin(time * 1.5) * 0.08;
        heartParticles.scale.set(pulse, pulse, pulse);
    }
    
    photoCards.forEach((card, index) => {
        const userData = card.userData;
        
        // Rotate around the heart
        const orbitAngle = userData.angle + time * userData.orbitSpeed * userData.orbitDirection;
        card.position.x = Math.cos(orbitAngle) * userData.radius;
        card.position.z = Math.sin(orbitAngle) * userData.radius * 0.5;
        
        // Slight vertical oscillation
        card.position.y = userData.originalY + Math.sin(time * userData.floatSpeed + userData.floatOffset) * 1.5;
        
        // Gentle rotation of the photo itself
        card.material.rotation += userData.rotationSpeed;
    });
    
    // Floating elements follow scene rotation (no individual animation)
    
    starParticles.forEach(starField => {
        starField.rotation.y += 0.0002;
        starField.rotation.x += 0.0001;
    });
    
    targetRotationX += (mouseY - targetRotationX) * 0.08;
    targetRotationY += (mouseX - targetRotationY) * 0.08;
    
    scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.15;
    scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.15;
    
    renderer.render(scene, camera);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Three.js is already loaded in index.html, just initialize
    // initGalaxy will be called when user navigates to page 5
});

