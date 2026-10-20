/**
 * Vietnamese Women's Day (20/10) - Random Gift Box Component (js/giftbox.js)
 * Dedicated edition for Em gái Hoàng Yến Nhi
 * Weighted random gift selection (60/30/10), interactive 3D gift boxes,
 * collection drawer with localStorage persistence, legendary golden flash,
 * canvas voucher exporter, and embedded mini-game widgets.
 */

(function () {
  'use strict';

  class GiftBoxController {
    constructor() {
      this.boxesCount = 4;
      this.openedInSession = new Set();
      this.collectedGifts = [];
      this.currentOpenedGift = null;
      this.storageKey = 'vietnamese_2010_gifts_collected_yen_nhi';
    }

    init() {
      this.loadCollectedFromStorage();
      this.renderGiftBoxesSection();
      this.setupDrawerEvents();
    }

    loadCollectedFromStorage() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          this.collectedGifts = JSON.parse(saved);
        }
      } catch (err) {
        console.warn('LocalStorage unavailable for gifts:', err);
      }
    }

    saveCollectedToStorage() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.collectedGifts));
      } catch (err) {
        console.warn('LocalStorage write failed:', err);
      }
    }

    renderGiftBoxesSection() {
      const container = document.getElementById('giftbox-section-content');
      if (!container) return;

      const totalGifts = (window.SITE_DATA.gifts && window.SITE_DATA.gifts.length) || 18;
      const collectedCount = this.collectedGifts.length;

      container.innerHTML = `
        <div class="giftbox-hub-wrap">
          <div class="giftbox-hub-header">
            <div class="gift-collection-pill" id="btn-toggle-drawer">
              <span>🎁 Túi Quà Của Yến Nhi: <strong id="drawer-counter-badge">${collectedCount}/${totalGifts}</strong></span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <p class="gift-hub-hint">Chạm vào một trong các hộp quà để mở bất ngờ dành riêng cho em gái!</p>
          </div>

          <!-- 4 Floating Gift Boxes Grid -->
          <div class="gift-boxes-grid" id="gift-boxes-grid">
            ${this.generateBoxesHTML()}
          </div>

          <!-- Opened Gift Card Modal -->
          <div class="gift-reveal-modal" id="gift-reveal-modal" role="dialog" aria-modal="true" aria-hidden="true">
            <div class="gift-reveal-backdrop" id="gift-modal-backdrop"></div>
            <div class="gift-card-dialog" id="gift-card-dialog">
              <div class="gift-card-content" id="gift-card-content">
                <!-- Dynamically populated when opened -->
              </div>
            </div>
          </div>

          <!-- Collection Drawer -->
          <div class="gift-drawer" id="gift-collection-drawer">
            <div class="drawer-header">
              <h4 class="drawer-title font-display">Bộ Sưu Tập Quà Tặng Của Yến Nhi 🌸</h4>
              <button type="button" class="btn-close-drawer" id="btn-close-drawer">✕</button>
            </div>
            <p class="drawer-sub">Chụp màn hình những phiếu này để đòi quà anh trai bất cứ lúc nào nhé!</p>
            <div class="drawer-list" id="drawer-gifts-list">
              <!-- Populated from collectedGifts -->
            </div>
          </div>
        </div>
      `;

      this.bindBoxClickEvents();
    }

    generateBoxesHTML() {
      const boxStyles = [
        { colorClass: 'box-rose', ribbon: '#ffcf6e', bow: '🎀' },
        { colorClass: 'box-purple', ribbon: '#ffd6e0', bow: '✨' },
        { colorClass: 'box-gold', ribbon: '#ff4d8d', bow: '🌸' },
        { colorClass: 'box-ruby', ribbon: '#ffd166', bow: '🎁' }
      ];

      return boxStyles.map((b, idx) => `
        <div class="interactive-gift-box ${b.colorClass}" data-box-index="${idx}" role="button" tabindex="0" aria-label="Hộp quà ${idx + 1}">
          <div class="ibox-lid">
            <div class="ibox-bow">${b.bow}</div>
            <div class="ibox-ribbon-h" style="background: ${b.ribbon}"></div>
          </div>
          <div class="ibox-body">
            <div class="ibox-ribbon-v" style="background: ${b.ribbon}"></div>
            <span class="ibox-tag">20/10 CHO NHI</span>
          </div>
        </div>
      `).join('');
    }

    bindBoxClickEvents() {
      const boxes = document.querySelectorAll('.interactive-gift-box');
      boxes.forEach(box => {
        box.addEventListener('click', () => {
          this.openGiftBox(box);
        });
      });

      const modalBackdrop = document.getElementById('gift-modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => this.closeGiftModal());
      }
    }

    // Weighted random selection: common (60%), rare (30%), legendary (10%)
    pickWeightedGift() {
      const allGifts = window.SITE_DATA.gifts || [];
      const rarities = window.SITE_DATA.giftRarity || { common: 60, rare: 30, legendary: 10 };

      // Filter out gifts opened in this session
      let candidates = allGifts.filter(g => !this.openedInSession.has(g.id));
      if (!candidates.length) {
        this.openedInSession.clear();
        candidates = allGifts;
      }

      // Roll a percentage 0 - 100
      const roll = Math.random() * 100;
      let targetRarity = 'common';
      if (roll <= rarities.legendary) {
        targetRarity = 'legendary';
      } else if (roll <= rarities.legendary + rarities.rare) {
        targetRarity = 'rare';
      } else {
        targetRarity = 'common';
      }

      let matches = candidates.filter(g => g.rarity === targetRarity);
      if (!matches.length) matches = candidates; // fallback

      const selected = matches[Math.floor(Math.random() * matches.length)];
      this.openedInSession.add(selected.id);
      return selected;
    }

    openGiftBox(boxElement) {
      boxElement.classList.add('is-popped');

      const gift = this.pickWeightedGift();
      this.currentOpenedGift = gift;

      // Add to collected if not already present
      if (!this.collectedGifts.find(g => g.id === gift.id)) {
        this.collectedGifts.unshift(gift);
        this.saveCollectedToStorage();
        this.updateDrawerCounter();
      }

      // Confetti burst
      if (window.Confetti) {
        const rect = boxElement.getBoundingClientRect();
        window.Confetti.burst({
          x: rect.left + rect.width / 2,
          y: rect.top + 20,
          count: gift.rarity === 'legendary' ? 90 : 50,
          velocity: gift.rarity === 'legendary' ? 16 : 11
        });
      }

      // Legendary special effect
      if (gift.rarity === 'legendary') {
        this.triggerLegendaryEffect();
      }

      // Delay modal opening slightly for pop animation
      setTimeout(() => {
        this.showGiftModal(gift);
        boxElement.classList.remove('is-popped');
      }, 500);
    }

    triggerLegendaryEffect() {
      // Golden screen flash
      const flash = document.createElement('div');
      flash.className = 'legendary-gold-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1200);

      // Vibration on supported mobile devices
      if (navigator.vibrate) {
        navigator.vibrate([100, 60, 200]);
      }

      // Petal burst
      if (window.Petals) {
        window.Petals.burst(30);
      }
    }

    showGiftModal(gift) {
      const modal = document.getElementById('gift-reveal-modal');
      const content = document.getElementById('gift-card-content');
      if (!modal || !content) return;

      const rarityLabels = {
        'common': { name: 'PHỔ BIẾN (COMMON)', class: 'badge-common', glow: 'glow-common' },
        'rare': { name: 'HIẾM (RARE) ✨', class: 'badge-rare', glow: 'glow-rare' },
        'legendary': { name: 'HUYỀN THOẠI (LEGENDARY) 👑', class: 'badge-legendary', glow: 'glow-legendary' }
      };

      const rInfo = rarityLabels[gift.rarity] || rarityLabels['common'];

      content.innerHTML = `
        <div class="gift-dialog-card ${rInfo.glow}">
          <button type="button" class="btn-close-gift-dialog" id="btn-close-gift-card">✕</button>
          
          <div class="gift-card-badge-row">
            <span class="gift-rarity-badge ${rInfo.class}">${rInfo.name}</span>
            <span class="gift-type-tag">#${gift.type}</span>
          </div>

          <div class="gift-icon-container">
            ${this.getGiftIconSVG(gift.icon, gift.rarity)}
          </div>

          <h3 class="gift-dialog-title font-display">${gift.title}</h3>
          <p class="gift-dialog-desc">${gift.description}</p>

          ${gift.miniGameType ? this.renderMiniGame(gift.miniGameType) : ''}

          <div class="gift-redeem-box">
            <span class="redeem-icon">🎟️</span>
            <span class="redeem-text"><strong>${gift.redeemText}</strong></span>
          </div>

          <p class="gift-screenshot-hint">💡 Hãy chụp màn hình lại phiếu này để đòi quà anh trai nhé!</p>

          <div class="gift-dialog-actions">
            <button type="button" class="btn btn-secondary" id="btn-download-gift-png">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              <span>Tải Phiếu Quà PNG</span>
            </button>
            <button type="button" class="btn btn-primary" id="btn-next-gift-box">
              <span>Mở thêm quà</span>
            </button>
          </div>
        </div>
      `;

      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');

      // Bind actions
      const closeBtn = document.getElementById('btn-close-gift-card');
      const nextBtn = document.getElementById('btn-next-gift-box');
      const downloadBtn = document.getElementById('btn-download-gift-png');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeGiftModal());
      if (nextBtn) nextBtn.addEventListener('click', () => this.closeGiftModal());
      if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadVoucherPNG(gift));

      if (gift.miniGameType === 'slider') {
        this.initLoveMeterWidget();
      } else if (gift.miniGameType === 'quiz') {
        this.initLoveQuizWidget();
      }
    }

    closeGiftModal() {
      const modal = document.getElementById('gift-reveal-modal');
      if (modal) {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    getGiftIconSVG(iconKey, rarity) {
      if (rarity === 'legendary') {
        return `<span class="gift-large-symbol">👑</span>`;
      }
      return `<span class="gift-large-symbol">🎁</span>`;
    }

    renderMiniGame(type) {
      if (type === 'slider') {
        return `
          <div class="mini-game-box love-slider-widget">
            <label for="love-meter-slider" class="mini-game-label">Thước đo: "Anh trai thương em gái bao nhiêu %?"</label>
            <input type="range" id="love-meter-slider" min="100" max="3000" value="100" class="love-meter-range">
            <div class="love-meter-readout">
              <span id="love-meter-number">100%</span>
              <p id="love-meter-comment" class="font-script">Mức khởi điểm: Thương em gái trọn vẹn!</p>
            </div>
          </div>
        `;
      } else if (type === 'quiz') {
        return `
          <div class="mini-game-box love-quiz-widget">
            <p class="mini-game-label">Câu hỏi: <strong>"Ai là cô em gái đáng yêu và ngoan nhất của anh?"</strong></p>
            <div class="quiz-options">
              <button type="button" class="quiz-btn-opt" data-correct="true">A. Hoàng Yến Nhi</button>
              <button type="button" class="quiz-btn-opt" data-correct="true">B. Cô em gái nhỏ của anh</button>
              <button type="button" class="quiz-btn-opt" data-correct="true">C. Cả 2 đều chuẩn 100%!</button>
            </div>
            <p class="quiz-result-msg" id="quiz-msg"></p>
          </div>
        `;
      }
      return '';
    }

    initLoveMeterWidget() {
      const slider = document.getElementById('love-meter-slider');
      const numEl = document.getElementById('love-meter-number');
      const commentEl = document.getElementById('love-meter-comment');

      if (!slider || !numEl || !commentEl) return;

      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        numEl.textContent = val >= 3000 ? "∞ VÔ CỰC %" : `${val}%`;

        if (val < 500) {
          commentEl.textContent = "Thương em gái nhỏ ngoan ngoãn!";
        } else if (val < 1500) {
          commentEl.textContent = "Thương em gái chạm đến mây xanh!";
        } else if (val < 2900) {
          commentEl.textContent = "Em gái cần gì anh trai bảo kê tới đó!";
        } else {
          commentEl.textContent = "Tình anh em gia đình bất tận không gì so sánh được! 💖";
          if (window.Confetti) {
            window.Confetti.burst({ count: 25 });
          }
        }
      });
    }

    initLoveQuizWidget() {
      const btns = document.querySelectorAll('.quiz-btn-opt');
      const msg = document.getElementById('quiz-msg');

      btns.forEach(b => {
        b.addEventListener('click', () => {
          btns.forEach(btn => btn.classList.add('selected-correct'));
          if (msg) {
            msg.textContent = "Chính xác 100%! Hoàng Yến Nhi mãi là cô em gái cưng nhất trần đời! 🎉";
          }
          if (window.Confetti) window.Confetti.burst({ count: 30 });
        });
      });
    }

    setupDrawerEvents() {
      const toggleBtn = document.getElementById('btn-toggle-drawer');
      const drawer = document.getElementById('gift-collection-drawer');
      const closeBtn = document.getElementById('btn-close-drawer');

      if (toggleBtn && drawer) {
        toggleBtn.addEventListener('click', () => {
          this.renderDrawerList();
          drawer.classList.add('is-open');
        });
      }

      if (closeBtn && drawer) {
        closeBtn.addEventListener('click', () => {
          drawer.classList.remove('is-open');
        });
      }
    }

    updateDrawerCounter() {
      const badge = document.getElementById('drawer-counter-badge');
      const totalGifts = (window.SITE_DATA.gifts && window.SITE_DATA.gifts.length) || 18;
      if (badge) {
        badge.textContent = `${this.collectedGifts.length}/${totalGifts}`;
      }
    }

    renderDrawerList() {
      const listEl = document.getElementById('drawer-gifts-list');
      if (!listEl) return;

      if (!this.collectedGifts.length) {
        listEl.innerHTML = `<div class="empty-drawer-note">Em gái chưa mở hộp quà nào. Hãy chạm vào các hộp quà bên trên để sưu tập phiếu nhé!</div>`;
        return;
      }

      listEl.innerHTML = this.collectedGifts.map((g, idx) => `
        <div class="collected-gift-item item-${g.rarity}">
          <div class="cgi-top">
            <span class="cgi-rarity">${g.rarity.toUpperCase()}</span>
            <span class="cgi-title">${g.title}</span>
          </div>
          <p class="cgi-desc">${g.description}</p>
          <div class="cgi-redeem">${g.redeemText}</div>
        </div>
      `).join('');
    }

    // Canvas PNG generator for the gift card
    downloadVoucherPNG(gift) {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 560;
      const ctx = canvas.getContext('2d');

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 900, 560);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#fff0f5');
      grad.addColorStop(1, '#ffe3ec');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 900, 560);

      // Border
      ctx.strokeStyle = gift.rarity === 'legendary' ? '#d4af37' : '#ff4d8d';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 840, 500);

      // Inner dashed line
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
      ctx.lineWidth = 2;
      ctx.strokeRect(42, 42, 816, 476);
      ctx.setLineDash([]);

      // Badge
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff4d8d';
      ctx.font = 'bold 20px "Be Vietnam Pro", sans-serif';
      ctx.fillText(`✦ PHIẾU ĐẶC QUYỀN 20/10 [${gift.rarity.toUpperCase()}] ✦`, 450, 95);

      // Title
      ctx.fillStyle = '#2c0b24';
      ctx.font = 'bold 30px "Playfair Display", Georgia, serif';
      ctx.fillText(gift.title, 450, 175);

      // Description
      ctx.fillStyle = '#5a264e';
      ctx.font = 'italic 19px "Be Vietnam Pro", sans-serif';
      ctx.fillText(`“${gift.description}”`, 450, 245);

      // Redeem text box
      ctx.fillStyle = '#e62e5c';
      ctx.font = 'bold 21px "Be Vietnam Pro", sans-serif';
      ctx.fillText(gift.redeemText, 450, 355);

      // Footer
      ctx.fillStyle = '#8e7087';
      ctx.font = '16px "Dancing Script", cursive';
      ctx.fillText('Phiếu quà tặng đặc quyền từ Anh Trai dành riêng cho Hoàng Yến Nhi 🌸', 450, 460);

      try {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `Phieu_Qua_20_10_Yen_Nhi_${gift.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error('Download PNG failed', err);
      }
    }
  }

  window.GiftBox = new GiftBoxController();
})();
