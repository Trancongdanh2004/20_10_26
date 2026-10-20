/**
 * Festive Confetti Particle System
 * Features ribbons, hearts, sparkles and geometric confetti flakes.
 * High-performance 2D canvas particle physics with air resistance and angular drag.
 */

(function () {
  'use strict';

  class ConfettiSystem {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animId = null;
      this.isRunning = false;
      this.reducedMotion = false;
      this.width = 0;
      this.height = 0;

      this.colors = [
        '#ff4d8d', // rose
        '#ff758c', // blush pink
        '#ffd166', // warm gold
        '#ff9f1c', // radiant orange
        '#7209b7', // royal purple
        '#b5179e', // magenta
        '#4cc9f0', // soft cyan
        '#ffffff', // bright white
        '#f72585'  // hot pink
      ];
    }

    init(canvasId = 'confetti-canvas') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.checkReducedMotion();
      this.resize();

      window.addEventListener('resize', () => this.resize(), { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.isRunning) {
          this.pause();
        } else if (!document.hidden && this.particles.length > 0 && !this.reducedMotion) {
          this.start();
        }
      });
    }

    checkReducedMotion() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = mediaQuery.matches;
      mediaQuery.addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
        if (this.reducedMotion) {
          this.clear();
        }
      });
    }

    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    createParticle(originX, originY, options = {}) {
      const angle = options.angle !== undefined ? options.angle : (Math.random() * Math.PI * 2);
      const velocity = options.velocity || (8 + Math.random() * 12);
      const spread = options.spread || (Math.PI * 2);
      const baseAngle = options.baseAngle || -Math.PI / 2;
      const actualAngle = baseAngle + (Math.random() - 0.5) * spread;

      const shapes = ['rect', 'rect', 'circle', 'heart', 'ribbon'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];

      const speed = velocity * (0.6 + Math.random() * 0.8);

      return {
        x: originX,
        y: originY,
        vx: Math.cos(actualAngle) * speed,
        vy: Math.sin(actualAngle) * speed,
        size: shape === 'ribbon' ? (12 + Math.random() * 10) : (6 + Math.random() * 7),
        shape: shape,
        color: color,
        opacity: 1,
        fadeSpeed: 0.006 + Math.random() * 0.009,
        gravity: 0.28 + Math.random() * 0.15,
        drag: 0.965,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.08 + Math.random() * 0.1
      };
    }

    burst(opts = {}) {
      if (this.reducedMotion) return;

      const originX = opts.x !== undefined ? opts.x : (this.width / 2);
      const originY = opts.y !== undefined ? opts.y : (this.height / 2);
      const count = opts.count || 70;
      const spread = opts.spread || Math.PI * 0.8;
      const baseAngle = opts.baseAngle !== undefined ? opts.baseAngle : -Math.PI / 2;
      const velocity = opts.velocity || 14;

      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle(originX, originY, {
          spread,
          baseAngle,
          velocity
        }));
      }

      if (!this.isRunning) {
        this.start();
      }
    }

    shower(duration = 3000) {
      if (this.reducedMotion) return;

      const startTime = performance.now();
      const interval = setInterval(() => {
        const now = performance.now();
        if (now - startTime > duration) {
          clearInterval(interval);
          return;
        }

        // Emit from top left and top right
        this.burst({
          x: Math.random() * (this.width * 0.4),
          y: -10,
          count: 12,
          baseAngle: Math.PI * 0.35,
          spread: Math.PI * 0.4,
          velocity: 10
        });

        this.burst({
          x: this.width - Math.random() * (this.width * 0.4),
          y: -10,
          count: 12,
          baseAngle: Math.PI * 0.65,
          spread: Math.PI * 0.4,
          velocity: 10
        });
      }, 150);
    }

    start() {
      if (this.isRunning || this.reducedMotion) return;
      this.isRunning = true;

      const loop = () => {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        if (this.particles.length === 0) {
          this.pause();
          this.clear();
          return;
        }

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
      this.particles = [];
    }

    update() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;

        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.rotSpeed;
        p.wobble += p.wobbleSpeed;
        p.opacity -= p.fadeSpeed;

        if (p.opacity <= 0 || p.y > this.height + 50) {
          this.particles.splice(i, 1);
        }
      }
    }

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.scale(Math.cos(p.wobble), 1);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === 'circle') {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (p.shape === 'ribbon') {
          this.ctx.fillRect(-p.size / 2, -p.size * 0.15, p.size, p.size * 0.3);
        } else if (p.shape === 'heart') {
          const s = p.size * 0.45;
          this.ctx.beginPath();
          this.ctx.moveTo(0, s * 0.5);
          this.ctx.bezierCurveTo(-s, -s * 0.8, -s * 1.8, s * 0.4, 0, s * 1.6);
          this.ctx.bezierCurveTo(s * 1.8, s * 0.4, s, -s * 0.8, 0, s * 0.5);
          this.ctx.fill();
        }

        this.ctx.restore();
      }
    }
  }

  window.Confetti = new ConfettiSystem();
})();
