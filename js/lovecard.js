/**
 * Vietnamese Women's Day (20/10) - Love Card Component (js/lovecard.js)
 * Features 3D flip card, floating rising hearts, days together counter,
 * and animated love letter modal with typewriter text.
 */

(function () {
  'use strict';

  class LoveCardController {
    constructor() {
      this.isFlipped = false;
      this.currentLetterIndex = 0;
      this.typewriterTimeout = null;
    }

    init() {
      this.renderLoveCardSection();
      this.initDaysCounter();
      this.initFlipInteraction();
      this.initLoveLetterModal();
      this.initRisingHearts();
    }

    getRecipient() {
      const input = document.getElementById('card-recipient');
      if (input && input.value.trim()) return input.value.trim();
      return (window.CONFIG && window.CONFIG.defaultRecipientName) || "Em yêu";
    }

    getSender() {
      const input = document.getElementById('card-sender');
      if (input && input.value.trim()) return input.value.trim();
      return (window.CONFIG && window.CONFIG.senderName) || "Anh";
    }

    renderLoveCardSection() {
      const container = document.getElementById('love-card-section-content');
      if (!container) return;

      const recipient = this.getRecipient();
      const sender = this.getSender();
      const initialWish = this.formatText(
        (window.SITE_DATA.loveWishes && window.SITE_DATA.loveWishes[0].text) || 
        "Chúc {name} của anh ngày 20/10 thật ngọt ngào, rạng rỡ và mãi hạnh phúc bên anh!",
        recipient,
        sender
      );

      container.innerHTML = `
        <div class="lovecard-container">
          <!-- Days Together Counter Pill (if specialDate configured) -->
          <div class="days-together-badge" id="days-together-badge">
            <span class="heart-pulse-icon">💖</span>
            <span id="days-counter-text">Đang tính thời gian bên nhau...</span>
          </div>

          <!-- 3D Flip Card Scene -->
          <div class="flip-card-scene">
            <div class="flip-card-inner" id="love-flip-card">
              <!-- Front Side -->
              <div class="flip-card-front">
                <div class="flip-card-envelope-ornament">
                  <div class="glowing-heart-seal" id="btn-flip-trigger">
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="flip-front-title font-display">Gửi Đến Người Anh Yêu Nhất</h3>
                <p class="flip-front-sub">Dành tặng: <strong class="lovecard-recipient-name">${recipient}</strong></p>
                <div class="flip-prompt-pill">
                  <span>Chạm để lật mở thiệp tình yêu</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                </div>
              </div>

              <!-- Back Side -->
              <div class="flip-card-back">
                <div class="lovecard-inner-border">
                  <div class="lovecard-back-badge">✦ 20/10 TRỌN VẸN YÊU THƯƠNG ✦</div>
                  <h4 class="lovecard-back-recipient font-display">Thân gửi: <span class="lovecard-recipient-name">${recipient}</span></h4>
                  <div class="lovecard-back-wish" id="lovecard-back-wish-text">
                    “${initialWish}”
                  </div>
                  <div class="lovecard-signature font-script">
                    Yêu em, <span class="lovecard-sender-name">${sender}</span> ❤️
                  </div>
                </div>
              </div>
            </div>

            <!-- Floating Hearts Rising Behind Card -->
            <div class="lovecard-floating-hearts" id="lovecard-hearts-container" aria-hidden="true"></div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="lovecard-actions">
            <button type="button" class="btn btn-secondary btn-reroll-lovewish" id="btn-reroll-lovecard-wish">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Đổi lời chúc ngọt ngào</span>
            </button>

            <button type="button" class="btn btn-primary btn-glow" id="btn-open-loveletter-modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>Đọc Thư Tình Gửi Em</span>
            </button>
          </div>
        </div>

        <!-- Animated Love Letter Modal -->
        <div class="loveletter-modal-backdrop" id="loveletter-modal" role="dialog" aria-modal="true" aria-hidden="true">
          <div class="loveletter-modal-dialog">
            <div class="envelope-unfolding-container">
              <div class="modal-envelope-flap"></div>
              <div class="modal-letter-sheet">
                <button type="button" class="btn-close-modal" id="btn-close-loveletter" aria-label="Đóng thư">✕</button>
                <div class="modal-stamp">
                  <span>20/10</span>
                  <small>LOVE</small>
                </div>
                <h3 class="modal-letter-title font-display" id="modal-letter-title">Bức thư tình gửi em</h3>
                <div class="modal-letter-body" id="modal-letter-body">
                  <!-- Typewriter text inserted here -->
                </div>
                <div class="modal-letter-footer font-script">
                  Thương chúc từ: <span class="lovecard-sender-name">${sender}</span> ❤️
                </div>
                <div class="modal-controls">
                  <button type="button" class="btn btn-secondary" id="btn-next-letter">
                    <span>Đọc bức thư khác</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    formatText(template, name, sender) {
      return template.replace(/\{name\}/g, name).replace(/\{sender\}/g, sender);
    }

    initDaysCounter() {
      const badge = document.getElementById('days-together-badge');
      const textEl = document.getElementById('days-counter-text');
      if (!badge || !textEl) return;

      const specialDateStr = (window.CONFIG && window.CONFIG.specialDate) || "2024-05-20";
      const startDate = new Date(specialDateStr);
      const now = new Date();

      if (isNaN(startDate.getTime())) {
        badge.style.display = 'none';
        return;
      }

      const diffTime = Math.abs(now - startDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Animate counting up to diffDays
      let count = 0;
      const duration = 1500;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        count = Math.floor(ease * diffDays);

        textEl.innerHTML = `Đã bên nhau <strong>${count}</strong> ngày yêu thương`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          textEl.innerHTML = `Đã bên nhau <strong>${diffDays}</strong> ngày yêu thương ngọt ngào!`;
        }
      };

      requestAnimationFrame(step);
    }

    initFlipInteraction() {
      const card = document.getElementById('love-flip-card');
      const rerollBtn = document.getElementById('btn-reroll-lovewish');
      if (!card) return;

      const toggleFlip = () => {
        this.isFlipped = !this.isFlipped;
        card.classList.toggle('is-flipped', this.isFlipped);

        if (this.isFlipped && window.Confetti) {
          const rect = card.getBoundingClientRect();
          window.Confetti.burst({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            count: 35,
            velocity: 10
          });
        }
      };

      card.addEventListener('click', toggleFlip);

      if (rerollBtn) {
        rerollBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.rerollWish();
          if (!this.isFlipped) {
            toggleFlip();
          }
        });
      }
    }

    rerollWish() {
      const wishes = window.SITE_DATA.loveWishes || [];
      if (!wishes.length) return;

      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      const formatted = this.formatText(randomWish.text, this.getRecipient(), this.getSender());

      const wishEl = document.getElementById('lovecard-back-wish-text');
      if (wishEl) {
        wishEl.innerHTML = `“${formatted}”`;
        wishEl.classList.remove('card-burst-anim');
        void wishEl.offsetWidth;
        wishEl.classList.add('card-burst-anim');
      }
    }

    initLoveLetterModal() {
      const openBtn = document.getElementById('btn-open-loveletter-modal');
      const modal = document.getElementById('loveletter-modal');
      const closeBtn = document.getElementById('btn-close-loveletter');
      const nextBtn = document.getElementById('btn-next-letter');

      if (!modal) return;

      const openModal = () => {
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        this.renderCurrentLetter();
      };

      const closeModal = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);
      };

      if (openBtn) openBtn.addEventListener('click', openModal);
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const letters = window.SITE_DATA.loveLetters || [];
          this.currentLetterIndex = (this.currentLetterIndex + 1) % letters.length;
          this.renderCurrentLetter();
        });
      }
    }

    renderCurrentLetter() {
      const letters = window.SITE_DATA.loveLetters || [];
      if (!letters.length) return;

      const letter = letters[this.currentLetterIndex];
      const titleEl = document.getElementById('modal-letter-title');
      const bodyEl = document.getElementById('modal-letter-body');

      const recipient = this.getRecipient();
      const sender = this.getSender();

      const formattedTitle = this.formatText(letter.title, recipient, sender);
      const formattedBody = this.formatText(letter.body, recipient, sender);

      if (titleEl) titleEl.textContent = formattedTitle;
      if (bodyEl) {
        if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);
        bodyEl.innerHTML = '<span class="tw-content"></span><span class="type-cursor">|</span>';
        const span = bodyEl.querySelector('.tw-content');

        let charIdx = 0;
        const typeNext = () => {
          if (charIdx < formattedBody.length) {
            span.textContent += formattedBody.charAt(charIdx);
            charIdx++;
            this.typewriterTimeout = setTimeout(typeNext, 16);
          } else {
            const cursor = bodyEl.querySelector('.type-cursor');
            if (cursor) cursor.remove();
          }
        };
        typeNext();
      }
    }

    initRisingHearts() {
      const container = document.getElementById('lovecard-hearts-container');
      if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const heartSymbols = ['💖', '💕', '💗', '💓', '🌸'];

      setInterval(() => {
        if (document.hidden) return;
        const heart = document.createElement('span');
        heart.className = 'rising-heart-particle';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = `${10 + Math.random() * 80}%`;
        heart.style.animationDuration = `${3 + Math.random() * 2.5}s`;
        heart.style.fontSize = `${14 + Math.random() * 14}px`;

        container.appendChild(heart);
        setTimeout(() => heart.remove(), 5500);
      }, 700);
    }
  }

  window.LoveCard = new LoveCardController();
})();
