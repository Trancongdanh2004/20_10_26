/**
 * Vietnamese Women's Day (20/10) - Dedicated Controller for Em Gái Hoàng Yến Nhi
 * Focused on:
 * 1. Interactive Greeting Card for Hoàng Yến Nhi (typewriter, re-roll, copy, PNG download, letter modal)
 * 2. Surprise Gift Box for Hoàng Yến Nhi (weighted random gifts, vouchers, mini-games, collection drawer)
 * 3. Background Audio Player (Hóa Ra... mp3 with autoplay & mobile touch-unlock fallback)
 */

(function () {
  'use strict';

  const DATA = window.SITE_DATA || {};
  const CONFIG = window.CONFIG || {
    senderName: "Anh trai",
    defaultRecipientName: "Hoàng Yến Nhi",
    relationship: "Em gái",
    songTitle: "Hóa Ra...",
    audioSrc: "audio/hoa-ra.mp3"
  };

  const state = {
    currentTheme: 'theme-ruby',
    currentWishText: '',
    recipientName: CONFIG.defaultRecipientName || 'Hoàng Yến Nhi',
    senderName: CONFIG.senderName || 'Anh trai',
    isTypewriting: false,
    typewriterTimeout: null,
    musicPlaying: false,
    audioElement: null,
    audioCtx: null,
    synthTimer: null,
    lastWishId: null,
    currentLetterIndex: 0
  };

  /* ==========================================================================
     DOM Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initCountdownBanner();
    initCardGenerator();
    initLoveLetterModal();
    initCelebrationButtons();
    initCursorSparkles();
    initMobileNav();
    initAudioPlayer();

    // Canvas Backgrounds
    if (window.Petals) window.Petals.init('petals-canvas');
    if (window.Confetti) window.Confetti.init('confetti-canvas');
    if (window.GiftBox) window.GiftBox.init();
    if (window.RevealController) window.RevealController.init();
  });

  /* ==========================================================================
     Hero Section
     ========================================================================== */
  function initHero() {
    const heroTitle = document.getElementById('hero-main-title');
    if (!heroTitle) return;

    const words = heroTitle.textContent.trim().split(' ');
    heroTitle.innerHTML = '';
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'hero-word';
      span.style.animationDelay = `${0.12 + index * 0.1}s`;
      span.textContent = word + ' ';
      heroTitle.appendChild(span);
    });

    const heroSection = document.getElementById('hero');
    const floatingElements = document.querySelectorAll('.hero-floating-item');

    if (heroSection && floatingElements.length) {
      heroSection.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = heroSection.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        floatingElements.forEach((el, idx) => {
          const speed = (idx + 1) * 14;
          el.style.transform = `translate3d(${mouseX * speed}px, ${mouseY * speed}px, 0)`;
        });
      }, { passive: true });
    }
  }

  /* ==========================================================================
     Countdown / Today Banner
     ========================================================================== */
  function initCountdownBanner() {
    const bannerContainer = document.getElementById('event-banner-content');
    if (!bannerContainer) return;

    const now = new Date();
    const isToday2010 = (now.getMonth() === 9 && now.getDate() === 20);

    if (isToday2010) {
      bannerContainer.innerHTML = `
        <div class="today-celebration-banner reveal-scale">
          <div class="today-badge">
            <span class="pulse-dot"></span>
            Hôm nay là Ngày 20/10 của Em Gái Yến Nhi!
          </div>
          <h2 class="today-title">Chúc Mừng Ngày 20/10 Cô Em Gái Nhỏ Của Anh! 🌸</h2>
          <p class="today-desc">
            Chúc Yến Nhi luôn rạng ngời như đóa hoa hướng dương, học tập và công việc luôn hanh thông, ngập tràn niềm vui và may mắn. Anh trai luôn tự hào và ở bên che chở cho em!
          </p>
          <div class="today-action">
            <a href="#card-sec" class="btn btn-primary btn-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              Xem thiệp chúc mừng
            </a>
          </div>
        </div>
      `;

      setTimeout(() => {
        if (window.Confetti) {
          window.Confetti.burst({ count: 90, spread: Math.PI * 0.9, velocity: 16 });
        }
      }, 700);

    } else {
      let targetYear = now.getFullYear();
      let targetDate = new Date(targetYear, 9, 20, 0, 0, 0);

      if (now > targetDate) {
        targetYear += 1;
        targetDate = new Date(targetYear, 9, 20, 0, 0, 0);
      }

      bannerContainer.innerHTML = `
        <div class="countdown-banner reveal-up">
          <div class="countdown-header">
            <span class="countdown-sub">Đếm ngược cùng Em Gái Hoàng Yến Nhi</span>
            <h3 class="countdown-title">Ngày Phụ Nữ Việt Nam 20/10/${targetYear}</h3>
          </div>
          <div class="countdown-grid" id="countdown-grid">
            <div class="countdown-box">
              <span class="cd-num" id="cd-days">00</span>
              <span class="cd-label">Ngày</span>
            </div>
            <div class="countdown-box">
              <span class="cd-num" id="cd-hours">00</span>
              <span class="cd-label">Giờ</span>
            </div>
            <div class="countdown-box">
              <span class="cd-num" id="cd-minutes">00</span>
              <span class="cd-label">Phút</span>
            </div>
            <div class="countdown-box">
              <span class="cd-num" id="cd-seconds">00</span>
              <span class="cd-label">Giây</span>
            </div>
          </div>
        </div>
      `;

      function updateCountdown() {
        const currentTime = new Date().getTime();
        const distance = targetDate.getTime() - currentTime;

        if (distance <= 0) {
          initCountdownBanner();
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-minutes');
        const sEl = document.getElementById('cd-seconds');

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }

  /* ==========================================================================
     Interactive Greeting Card for Em Gái Hoàng Yến Nhi
     ========================================================================== */
  function initCardGenerator() {
    const recipientInput = document.getElementById('card-recipient');
    const senderInput = document.getElementById('card-sender');
    const themeContainer = document.getElementById('theme-selectors');
    const generateBtn = document.getElementById('btn-generate-card');
    const rerollBtn = document.getElementById('btn-reroll-wish');
    const copyBtn = document.getElementById('btn-copy-wish');
    const downloadBtn = document.getElementById('btn-download-card');

    if (recipientInput) recipientInput.value = state.recipientName;
    if (senderInput) senderInput.value = state.senderName;

    // Populate Theme swatches
    if (themeContainer && DATA.cardThemes) {
      themeContainer.innerHTML = DATA.cardThemes.map((t, idx) => `
        <button type="button" class="theme-choice-btn ${idx === 0 ? 'active' : ''}" data-theme-id="${t.id}" title="${t.name}">
          <span class="theme-swatch" style="background: ${t.gradient}"></span>
          <span class="theme-name">${t.name}</span>
        </button>
      `).join('');

      themeContainer.querySelectorAll('.theme-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          themeContainer.querySelectorAll('.theme-choice-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const themeId = btn.getAttribute('data-theme-id');
          applyCardTheme(themeId);
        });
      });
    }

    if (recipientInput) {
      recipientInput.addEventListener('input', (e) => {
        state.recipientName = e.target.value.trim() || 'Hoàng Yến Nhi';
        const displayEl = document.getElementById('card-display-recipient');
        if (displayEl) displayEl.textContent = state.recipientName;
      });
    }

    if (senderInput) {
      senderInput.addEventListener('input', (e) => {
        state.senderName = e.target.value.trim() || 'Anh trai';
        const displayEl = document.getElementById('card-display-sender');
        if (displayEl) displayEl.textContent = state.senderName;
      });
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        updateCardContent(true);
        triggerCardCelebration();
      });
    }

    if (rerollBtn) {
      rerollBtn.addEventListener('click', () => updateCardContent(true));
    }

    if (copyBtn) copyBtn.addEventListener('click', copyWishToClipboard);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadCardAsPNG);

    updateCardContent(false);
  }

  function applyCardTheme(themeId) {
    state.currentTheme = themeId;
    const cardElement = document.getElementById('greeting-card-preview');
    if (!cardElement) return;

    DATA.cardThemes.forEach(t => cardElement.classList.remove(t.bgClass));
    const selected = DATA.cardThemes.find(t => t.id === themeId);
    if (selected) {
      cardElement.classList.add(selected.bgClass);
      cardElement.style.setProperty('--card-accent', selected.primaryColor);
    }
  }

  function pickRandomWish() {
    const pool = DATA.loveWishes || [];
    if (!pool.length) {
      return "Chúc Hoàng Yến Nhi ngày 20/10 ngập tràn hạnh phúc và luôn rạng ngời!";
    }

    let candidates = pool.filter(w => w.id !== state.lastWishId);
    if (!candidates.length) candidates = pool;

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    state.lastWishId = chosen.id;

    return chosen.text
      .replace(/\{name\}/g, state.recipientName)
      .replace(/\{sender\}/g, state.senderName);
  }

  function updateCardContent(animateTypewriter = true) {
    const wish = pickRandomWish();
    state.currentWishText = wish;

    const displayRecipient = document.getElementById('card-display-recipient');
    const displaySender = document.getElementById('card-display-sender');
    const displayWish = document.getElementById('card-display-text');
    const badge = document.getElementById('card-display-badge');

    if (badge) badge.textContent = 'Dành Tặng Em Gái Hoàng Yến Nhi 🌸';
    if (displayRecipient) displayRecipient.textContent = state.recipientName;
    if (displaySender) displaySender.textContent = state.senderName;

    if (displayWish) {
      if (animateTypewriter && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        runTypewriter(displayWish, wish);
      } else {
        displayWish.innerHTML = escapeHTML(wish);
      }
    }
  }

  function runTypewriter(element, text) {
    if (state.typewriterTimeout) {
      clearTimeout(state.typewriterTimeout);
    }

    element.innerHTML = '<span class="tw-content"></span><span class="type-cursor">|</span>';
    const contentSpan = element.querySelector('.tw-content');
    let idx = 0;

    function typeNextChar() {
      if (idx < text.length) {
        contentSpan.textContent += text.charAt(idx);
        idx++;
        state.typewriterTimeout = setTimeout(typeNextChar, 18);
      } else {
        const cursor = element.querySelector('.type-cursor');
        if (cursor) cursor.remove();
      }
    }

    typeNextChar();
  }

  function triggerCardCelebration() {
    if (window.Confetti) {
      const card = document.getElementById('greeting-card-preview');
      if (card) {
        const rect = card.getBoundingClientRect();
        window.Confetti.burst({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 3,
          count: 55,
          velocity: 13
        });
      }
    }
    if (window.Petals) {
      window.Petals.burst(25);
    }
    showToast('Đã tạo lời chúc mới tặng em gái Yến Nhi! 🌸');
  }

  function copyWishToClipboard() {
    const fullText = `Gửi em gái: ${state.recipientName}\n\n"${state.currentWishText}"\n\nThương chúc từ: ${state.senderName} ❤️`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText)
        .then(() => showToast('Đã sao chép lời chúc vào khay nhớ tạm! ✨'))
        .catch(() => fallbackCopy(fullText));
    } else {
      fallbackCopy(fullText);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Đã sao chép lời chúc vào khay nhớ tạm! ✨');
    } catch (e) {
      showToast('Không thể tự sao chép, bạn hãy bôi đen lời chúc nhé!');
    }
    document.body.removeChild(textarea);
  }

  function showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff4d8d"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      <span>${message}</span>
    `;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ==========================================================================
     Canvas PNG Card Exporter for Em Gái Hoàng Yến Nhi
     ========================================================================== */
  function downloadCardAsPNG() {
    showToast('Đang kết xuất thiệp 20/10 cho em gái Yến Nhi...');

    const theme = DATA.cardThemes.find(t => t.id === state.currentTheme) || DATA.cardThemes[0];
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.5, theme.canvasBg || '#fff5f8');
    bgGrad.addColorStop(1, '#ffe8ef');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Borders
    const margin = 36;
    ctx.strokeStyle = theme.canvasBorder || '#e62e5c';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, margin, margin, 1200 - margin * 2, 800 - margin * 2, 28);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.75)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, margin + 12, margin + 12, 1200 - (margin + 12) * 2, 800 - (margin + 12) * 2, 20);
    ctx.stroke();

    // Header badge
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.canvasAccent || '#e62e5c';
    ctx.font = '600 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText('✦ KỶ NIỆM NGÀY PHỤ NỮ VIỆT NAM 20/10 ✦', 600, 105);

    // Title / Recipient
    ctx.font = 'bold 42px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#2c0b24';
    ctx.fillText(`Thân gửi em gái: ${state.recipientName} 🌸`, 600, 175);

    // Divider
    ctx.strokeStyle = 'rgba(230, 46, 92, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(460, 205);
    ctx.lineTo(740, 205);
    ctx.stroke();

    // Wish text
    ctx.font = 'italic 25px/1.85 "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#3a1030';
    const lines = wrapText(ctx, `“${state.currentWishText}”`, 960);
    const startY = 275 + (4 - Math.min(lines.length, 4)) * 12;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 600, startY + i * 46);
    }

    // Signature
    const footerY = 800 - 145;
    ctx.font = 'bold italic 26px "Dancing Script", cursive, Georgia, serif';
    ctx.fillStyle = theme.canvasAccent || '#e62e5c';
    ctx.fillText(`Thương chúc từ: ${state.senderName} ❤️`, 600, footerY);

    // Watermark
    ctx.font = '500 15px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#8e7087';
    ctx.fillText('Anh trai mãi yêu thương, tự hào và che chở Hoàng Yến Nhi trên mọi bước đường 🌸', 600, footerY + 45);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Thiep_20_10_Em_Gai_Hoang_Yen_Nhi.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast('Đã tải ảnh thiệp chúc mừng PNG thành công! 🖼️');
      if (window.Confetti) window.Confetti.burst({ count: 30 });
    } catch (err) {
      console.error('PNG export failed', err);
      showToast('Có lỗi xảy ra khi tạo ảnh PNG.');
    }
  }

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ==========================================================================
     Sister Love Letter Modal for Hoàng Yến Nhi
     ========================================================================== */
  function initLoveLetterModal() {
    const openBtn = document.getElementById('btn-open-letter-from-card');
    const modal = document.getElementById('loveletter-modal');
    const closeBtn = document.getElementById('btn-close-loveletter');
    const nextBtn = document.getElementById('btn-next-letter');

    if (!modal) return;

    const openModal = () => {
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      renderCurrentLetter();
      if (window.Confetti) window.Confetti.burst({ count: 35, velocity: 10 });
    };

    const closeModal = () => {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (state.typewriterTimeout) clearTimeout(state.typewriterTimeout);
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const letters = DATA.loveLetters || [];
        state.currentLetterIndex = (state.currentLetterIndex + 1) % letters.length;
        renderCurrentLetter();
      });
    }
  }

  function renderCurrentLetter() {
    const letters = DATA.loveLetters || [];
    if (!letters.length) return;

    const letter = letters[state.currentLetterIndex];
    const titleEl = document.getElementById('modal-letter-title');
    const bodyEl = document.getElementById('modal-letter-body');

    const formattedTitle = letter.title.replace(/\{name\}/g, state.recipientName).replace(/\{sender\}/g, state.senderName);
    const formattedBody = letter.body.replace(/\{name\}/g, state.recipientName).replace(/\{sender\}/g, state.senderName);

    if (titleEl) titleEl.textContent = formattedTitle;
    if (bodyEl) {
      if (state.typewriterTimeout) clearTimeout(state.typewriterTimeout);
      bodyEl.innerHTML = '<span class="tw-content"></span><span class="type-cursor">|</span>';
      const span = bodyEl.querySelector('.tw-content');

      let charIdx = 0;
      const typeNext = () => {
        if (charIdx < formattedBody.length) {
          span.textContent += formattedBody.charAt(charIdx);
          charIdx++;
          state.typewriterTimeout = setTimeout(typeNext, 16);
        } else {
          const cursor = bodyEl.querySelector('.type-cursor');
          if (cursor) cursor.remove();
        }
      };
      typeNext();
    }
  }

  /* ==========================================================================
     Background Audio Player (Hóa Ra... mp3 with Autoplay & Fallback)
     ========================================================================== */
  function initAudioPlayer() {
    const musicBtn = document.getElementById('btn-romantic-music');
    const promptPill = document.getElementById('audio-prompt-pill');
    const promptPlayBtn = document.getElementById('btn-prompt-play');

    // Create or retrieve HTML5 Audio
    let audio = document.getElementById('bg-music');
    if (!audio) {
      audio = new Audio(CONFIG.audioSrc || 'audio/hoa-ra.mp3');
      audio.id = 'bg-music';
      audio.loop = true;
      audio.preload = 'auto';
      document.body.appendChild(audio);
    }
    state.audioElement = audio;

    function updateMusicUI(isPlaying) {
      state.musicPlaying = isPlaying;
      if (musicBtn) {
        if (isPlaying) {
          musicBtn.classList.add('is-playing');
          musicBtn.innerHTML = `
            <span class="music-wave" aria-hidden="true">
              <span class="m-bar"></span>
              <span class="m-bar"></span>
              <span class="m-bar"></span>
            </span>
            <span id="music-btn-text">Hóa Ra... 🎶</span>
          `;
          musicBtn.title = "Đang phát bài hát 'Hóa Ra...' tặng em gái - Chạm để tạm dừng";
        } else {
          musicBtn.classList.remove('is-playing');
          musicBtn.innerHTML = `
            <span class="music-note-icon">🎵</span>
            <span id="music-btn-text">Bật Nhạc</span>
          `;
          musicBtn.title = "Bật bài hát 'Hóa Ra...' tặng em gái";
        }
      }

      if (promptPill && isPlaying) {
        promptPill.classList.add('fade-out');
        setTimeout(() => {
          promptPill.style.display = 'none';
        }, 500);
      }
    }

    function playAudioTrack() {
      if (!audio) return;
      audio.play().then(() => {
        updateMusicUI(true);
      }).catch((err) => {
        console.log('Autoplay deferred until user interaction:', err);
        updateMusicUI(false);
        // Show gentle floating prompt on mobile/desktop
        if (promptPill) {
          promptPill.classList.add('is-visible');
        }
      });
    }

    function pauseAudioTrack() {
      if (audio) audio.pause();
      if (state.synthTimer) clearTimeout(state.synthTimer);
      updateMusicUI(false);
    }

    function toggleAudio() {
      if (state.musicPlaying) {
        pauseAudioTrack();
        showToast('Đã tạm dừng bài hát.');
      } else {
        playAudioTrack();
        showToast('Đang phát bài hát: "Hóa Ra..." tặng em gái Yến Nhi 🎶');
      }
    }

    if (musicBtn) {
      musicBtn.addEventListener('click', toggleAudio);
    }

    if (promptPlayBtn) {
      promptPlayBtn.addEventListener('click', () => {
        playAudioTrack();
        showToast('Đang phát bài hát: "Hóa Ra..." tặng em gái Yến Nhi 🎶');
      });
    }

    // Try autoplay immediately on page load
    playAudioTrack();

    // Browser autoplay policy fallback: unlock on first touch or click anywhere
    const unlockOnGesture = () => {
      if (!state.musicPlaying) {
        playAudioTrack();
      }
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('click', unlockOnGesture);
    };

    window.addEventListener('pointerdown', unlockOnGesture, { once: true, passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { once: true, passive: true });
    window.addEventListener('click', unlockOnGesture, { once: true, passive: true });
  }

  /* ==========================================================================
     Celebration Showers & Cursor Sparkles
     ========================================================================== */
  function initCelebrationButtons() {
    const triggerBtn = document.getElementById('btn-celebrate-shower');
    if (!triggerBtn) return;

    triggerBtn.addEventListener('click', () => {
      showToast('Gửi ngàn yêu thương & lời chúc tốt đẹp nhất đến em gái Hoàng Yến Nhi! 🌸✨');
      if (window.Confetti) window.Confetti.shower(3800);
      if (window.Petals) window.Petals.burst(45);
    });
  }

  function initCursorSparkles() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lastSparkleTime = 0;
    const colors = ['#ff4d8d', '#ff758c', '#ffcf6e', '#ffd6e0'];

    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSparkleTime < 45) return;
      lastSparkleTime = now;

      const sparkle = document.createElement('div');
      sparkle.className = 'cursor-sparkle';
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 5 + Math.random() * 6;
      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.backgroundColor = color;
      sparkle.style.boxShadow = `0 0 6px ${color}`;

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 700);
    }, { passive: true });
  }

  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (toggle && navMenu) {
      toggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen);
        toggle.classList.toggle('is-active', isOpen);
      });

      links.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('is-open');
          toggle.classList.remove('is-active');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

})();
