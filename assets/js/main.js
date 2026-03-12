/**
 * WEDDING INVITATION - script.js
 * Wuang & Dunn | 18.04.2026
 */

/* ============================================================
   1. OPEN INVITATION
============================================================ */
function openInvitation() {
  const overlay = document.getElementById('coverOverlay');
  const invitation = document.getElementById('invitation');

  overlay.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  overlay.style.opacity = '0';
  overlay.style.transform = 'scale(1.08)';

  setTimeout(() => {
    overlay.style.display = 'none';
    invitation.style.display = 'block';
    // Trigger scroll reveal for visible sections
    revealOnScroll();
    // Start countdown
    startCountdown();
    // Attempt auto-play music
    tryAutoplay();
  }, 800);
}

/* ============================================================
   2. SCROLL REVEAL
============================================================ */
function revealOnScroll() {
  const targets = document.querySelectorAll('.reveal, .reveal-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   3. COUNTDOWN TIMER
   Wedding: Saturday, April 18, 2026 at 18:00 (Ho Chi Minh City, UTC+7)
============================================================ */
const WEDDING_DATE = new Date('2026-04-18T18:00:00+07:00');

function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent  = '00';
    document.getElementById('cd-secs').textContent  = '00';
    const label = document.querySelector('.countdown-label');
    if (label) label.textContent = '🎉 CHÚC MỪNG ĐÁM CƯỚI!';
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  setCounterEl('cd-days',  days);
  setCounterEl('cd-hours', hours);
  setCounterEl('cd-mins',  mins);
  setCounterEl('cd-secs',  secs);
}

function setCounterEl(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const str = String(value).padStart(2, '0');
  if (el.textContent !== str) {
    el.textContent = str;
    el.classList.remove('tick');
    void el.offsetWidth; // reflow
    el.classList.add('tick');
  }
}

/* ============================================================
   4. MUSIC PLAYER
============================================================ */
let isPlaying = false;
const audio = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const musicRings = document.getElementById('musicRings');

function toggleMusic() {
  if (isPlaying) {
    audio.pause();
    musicIcon.textContent = '▶';
    musicRings.classList.remove('playing');
    isPlaying = false;
  } else {
    audio.play().then(() => {
      musicIcon.textContent = '⏸';
      musicRings.classList.add('playing');
      isPlaying = true;
    }).catch(() => {
      // Autoplay blocked, user manually triggered - try again
      audio.play();
      musicIcon.textContent = '⏸';
      musicRings.classList.add('playing');
      isPlaying = true;
    });
  }
}

function tryAutoplay() {
  audio.volume = 0.4;
  audio.play().then(() => {
    musicIcon.textContent = '⏸';
    musicRings.classList.add('playing');
    isPlaying = true;
  }).catch(() => {
    // Autoplay blocked by browser policy - user must click
    isPlaying = false;
  });
}

/* ============================================================
   5. GUESTBOOK
============================================================ */
function submitGuestbook(event) {
  event.preventDefault();

  const nameEl = document.getElementById('gbName');
  const msgEl  = document.getElementById('gbMessage');
  const name   = nameEl.value.trim();
  const message = msgEl.value.trim();

  if (!name || !message) return;

  const container = document.getElementById('guestbookMessages');
  const now = new Date();
  const timeStr = now.toLocaleString('vi-VN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    day: 'numeric', month: 'numeric', year: 'numeric'
  });

  const msgDiv = document.createElement('div');
  msgDiv.className = 'gb-msg';
  msgDiv.innerHTML = `
    <div class="gb-msg-header">
      <span class="gb-author">${escapeHtml(name)}</span>
      <span class="gb-time">${timeStr}</span>
    </div>
    <p class="gb-text">${escapeHtml(message)}</p>
  `;

  container.insertBefore(msgDiv, container.firstChild);

  // Clear form
  nameEl.value = '';
  msgEl.value = '';

  // Smooth scroll to message
  msgDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  showToast('Đã gửi lời chúc thành công! 💌');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

/* ============================================================
   6. ADD TO CALENDAR
============================================================ */
function addToCalendar() {
  const start = '20260418T110000';  // 18:00 ICT = 11:00 UTC
  const end   = '20260418T140000';  // ~21:00 ICT
  const title = encodeURIComponent('Đám Cưới Wuang & Dunn');
  const details = encodeURIComponent('Tiệc cưới tại Trung Tâm Hội Nghị ABC, 789 Điện Biên Phủ, Quận 3, TP. Hồ Chí Minh');
  const location = encodeURIComponent('789 Điện Biên Phủ, Quận 3, TP. Hồ Chí Minh');

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(url, '_blank');
}

/* ============================================================
   7. INJECT TOAST STYLES (dynamic)
============================================================ */
(function injectToastCss() {
  const style = document.createElement('style');
  style.textContent = `
    .toast {
      position: fixed;
      bottom: 100px;
      right: 24px;
      z-index: 9999;
      background: linear-gradient(135deg, #8B1A1A, #6B0F1A);
      color: #F5E6AC;
      padding: 14px 24px;
      border-radius: 50px;
      font-family: 'Roboto', sans-serif;
      font-size: 0.88rem;
      box-shadow: 0 8px 30px rgba(0,0,0,0.35);
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      transition: opacity 0.4s ease, transform 0.4s ease;
      pointer-events: none;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    .cd-num.tick {
      animation: numTick 0.3s ease;
    }
    @keyframes numTick {
      0%  { transform: translateY(-6px); opacity: 0.4; }
      100%{ transform: translateY(0);    opacity: 1; }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   8. PARALLAX FLOATING COVER ELEMENTS (on mousemove)
============================================================ */
document.addEventListener('mousemove', (e) => {
  const overlay = document.getElementById('coverOverlay');
  if (!overlay || overlay.style.display === 'none') return;

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  const floaters = document.querySelectorAll('.floating-xi');
  floaters.forEach((el, i) => {
    const factor = (i + 1) * 5;
    el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});
