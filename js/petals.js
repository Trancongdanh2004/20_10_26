/**
 * Falling Petals Canvas Effect
 * Simulates gentle drifting rose/sakura petals in 3D-like perspective.
 * Fully responsive, performant, and pauses when tab is hidden or reduced motion is active.
 */

(function () {
  'use strict';

  class PetalSystem {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.petals = [];
      this.maxPetals = 50;
      this.animId = null;
      this.isRunning = false;
      this.isTabVisible = true;
      this.reducedMotion = false;
      this.wind = 0;
      this.targetWind = 0;
      this.mouseX = 0;
      this.width = 0;
      this.height = 0;

      // Color variations for petals
      this.petalColors = [
        { fill: '#ff758c', stroke: '#ff5376', shadow: 'rgba(255, 117, 140, 0.3)' },
        { fill: '#ff8da1', stroke: '#ff6b85', shadow: 'rgba(255, 141, 161, 0.25)' },
        { fill: '#ffa8ba', stroke: '#ff859c', shadow: 'rgba(255, 168, 186, 0.25)' },
        { fill: '#ffb3c6', stroke: '#ff9ebb', shadow: 'rgba(255, 179, 198, 0.2)' },
        { fill: '#f7cad0', stroke: '#f4acb7', shadow: 'rgba(247, 202, 208, 0.2)' },
        { fill: '#e63968', stroke: '#c2185b', shadow: 'rgba(230, 57, 104, 0.3)' }
      ];
    }

    init(canvasId = 'petals-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.checkReducedMotion();
      this.resize();

      // Adjust max petals based on screen width
      if (window.innerWidth < 768) {
        this.maxPetals = 30;
      } else if (window.innerWidth < 1200) {
        this.maxPetals = 50;
      } else {
        this.maxPetals = 70;
      }

      // Populate petals
      this.petals = [];
      for (let i = 0; i < this.maxPetals; i++) {
        this.petals.push(this.createPetal(true));
      }

      // Event listeners
      window.addEventListener('resize', () => this.resize(), { passive: true });
      
      document.addEventListener('visibilitychange', () => {
        this.isTabVisible = !document.hidden;
        if (this.isTabVisible && !this.reducedMotion && !this.isRunning) {
          this.start();
        } else if (!this.isTabVisible && this.isRunning) {
          this.pause();
        }
      });

      // Mouse influence on wind
      window.addEventListener('mousemove', (e) => {
        if (this.reducedMotion) return;
        const normalized = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
        this.targetWind = normalized * 1.2;
      }, { passive: true });

      if (!this.reducedMotion) {
        this.start();
      }
    }

    checkReducedMotion() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = mediaQuery.matches;
      mediaQuery.addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
        if (this.reducedMotion) {
          this.pause();
          this.clear();
        } else if (this.isTabVisible) {
          this.start();
        }
      });
    }

    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    createPetal(randomY = false) {
      const colorScheme = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
      const depth = Math.random(); // 0 (far) to 1 (near)
      const scale = 0.5 + depth * 0.7; // size scaling

      return {
        x: Math.random() * (this.width + 200) - 100,
        y: randomY ? Math.random() * this.height : -30 - Math.random() * 50,
        size: (12 + Math.random() * 10) * scale,
        speedY: (1.0 + Math.random() * 1.6) * (0.6 + depth * 0.7),
        speedX: (Math.random() - 0.5) * 0.8,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayDistance: 1.2 + Math.random() * 2,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.03,
        color: colorScheme,
        opacity: 0.5 + depth * 0.45,
        depth: depth
      };
    }

    start() {
      if (this.isRunning || this.reducedMotion) return;
      this.isRunning = true;
      let lastTime = performance.now();

      const loop = (currentTime) => {
        if (!this.isRunning) return;
        const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        this.update(delta);
        this.draw();
        this.animId = requestAnimationFrame(loop);
      };

      this.animId = requestAnimationFrame(loop);
    }

    pause() {
      this.isRunning = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    clear() {
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }

    update(delta) {
      // Smooth wind interpolation
      this.wind += (this.targetWind - this.wind) * 0.05;

      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.swayOffset += p.swaySpeed;
        p.flip += p.flipSpeed;
        p.rotation += p.rotSpeed;

        // Apply wind and sine sway
        const sway = Math.sin(p.swayOffset) * p.swayDistance;
        p.x += (p.speedX + this.wind + sway) * (delta * 60);
        p.y += p.speedY * (delta * 60);

        // Reset if petal exits viewport
        if (p.y > this.height + 40 || p.x < -120 || p.x > this.width + 120) {
          this.petals[i] = this.createPetal(false);
        }
      }
    }

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);

        // 3D flip effect via scale
        const scaleX = Math.cos(p.flip);
        const scaleY = 1;
        this.ctx.scale(scaleX, scaleY);

        this.ctx.globalAlpha = p.opacity;

        // Draw organic petal path
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size * 1.1);
        this.ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.7, p.size * 0.8, p.size * 0.6, 0, p.size * 1.2);
        this.ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.9, -p.size * 0.7, 0, -p.size * 1.1);
        this.ctx.closePath();

        // Subtle gradient on petal
        const grad = this.ctx.createLinearGradient(0, -p.size, 0, p.size);
        grad.addColorStop(0, p.color.fill);
        grad.addColorStop(1, p.color.stroke);

        this.ctx.fillStyle = grad;
        this.ctx.fill();

        // Delicate inner spine line
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size * 0.8);
        this.ctx.quadraticCurveTo(p.size * 0.1, 0, 0, p.size * 0.8);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();

        this.ctx.restore();
      }
    }

    // Trigger a temporary burst of extra falling petals
    burst(count = 25) {
      if (this.reducedMotion) return;
      for (let i = 0; i < count; i++) {
        const p = this.createPetal(false);
        p.y = Math.random() * (this.height * 0.4); // spawn in upper screen
        p.speedY *= 1.8;
        this.petals.push(p);
      }
      // prune extra petals after 6 seconds
      setTimeout(() => {
        if (this.petals.length > this.maxPetals) {
          this.petals.splice(this.maxPetals);
        }
      }, 6000);
    }
  }

  window.Petals = new PetalSystem();
})();
