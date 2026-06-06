/* ============================================================
   AguiarXTech — script.js
   1) Céu estrelado + cometas (Canvas API)
   2) Scroll reveal (IntersectionObserver)
   3) Menu mobile + navbar com blur ao rolar
   4) Ano atual no rodapé
   Respeita prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  // Usuário prefere menos movimento? (acessibilidade)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     1) CÉU ESTRELADO + COMETAS (Canvas)
     ========================================================== */
  const canvas = document.getElementById("space-canvas");
  const ctx = canvas.getContext("2d");

  let width, height, dpr;
  let stars = [];
  let comets = [];
  let nextCometAt = 0; // momento (timestamp) do próximo cometa

  // Ajusta o canvas ao tamanho da janela (com suporte a telas retina)
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); // limita a 2x por performance
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  // Densidade de estrelas proporcional à área da tela
  function createStars() {
    const area = width * height;
    const count = Math.min(420, Math.floor(area / 4500)); // adapta ao tamanho
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,           // raio
        baseAlpha: Math.random() * 0.5 + 0.3,    // brilho base
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,      // fase do "piscar"
        // leve variação de cor: branco-azulado a ciano
        hue: 190 + Math.random() * 40
      });
    }
  }

  // Cria um cometa que cruza a tela na diagonal, com rastro.
  // Surge de posições variadas (topo, lateral esquerda ou direita) e
  // em ângulos/velocidades diferentes, para parecer mais natural.
  function spawnComet() {
    // Sorteia a direção: -1 = desce para a esquerda, 1 = desce para a direita
    const dir = Math.random() < 0.5 ? -1 : 1;

    // Sorteia de qual borda o cometa entra na tela
    const edge = Math.random();
    let startX, startY;
    if (edge < 0.55) {
      // Entra pelo topo, em qualquer posição horizontal
      startX = Math.random() * width;
      startY = -40;
    } else if (dir === 1) {
      // Entra pela lateral esquerda (vai para a direita)
      startX = -40;
      startY = Math.random() * height * 0.5;
    } else {
      // Entra pela lateral direita (vai para a esquerda)
      startX = width + 40;
      startY = Math.random() * height * 0.5;
    }

    // Ângulo entre ~25° e ~60° em relação à horizontal, na direção sorteada
    const angle = (Math.PI / 6) + Math.random() * (Math.PI / 3);
    const speed = Math.random() * 5 + 5;       // velocidade variada
    comets.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed * dir,
      vy: Math.sin(angle) * speed,
      len: Math.random() * 200 + 110,          // comprimento do rastro
      width: Math.random() * 1.4 + 1.6,        // espessura do rastro
      life: 0
    });
  }

  // Desenha as estrelas (com leve cintilação)
  function drawStars(t) {
    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 90%, 85%, ${Math.max(0, alpha)})`;
      ctx.fill();
    }
  }

  // Desenha e atualiza os cometas
  function drawComets() {
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.x += c.vx;
      c.y += c.vy;
      c.life++;

      // Ponto final do rastro (atrás do cometa)
      const tailX = c.x - c.vx * (c.len / 10);
      const tailY = c.y - c.vy * (c.len / 10);

      // Rastro com gradiente ciano → transparente
      const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
      grad.addColorStop(0, "rgba(34, 211, 238, 0.9)");
      grad.addColorStop(0.4, "rgba(59, 130, 246, 0.4)");
      grad.addColorStop(1, "rgba(59, 130, 246, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = c.width || 2.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Cabeça brilhante do cometa (glow)
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(190, 245, 255, 0.95)";
      ctx.shadowColor = "rgba(34, 211, 238, 0.9)";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Remove o cometa quando sai da tela (por qualquer borda)
      if (c.x > width + 200 || c.x < -200 || c.y > height + 200) {
        comets.splice(i, 1);
      }
    }
  }

  // Loop principal de animação
  function loop(t) {
    ctx.clearRect(0, 0, width, height);
    drawStars(t);

    // Gera cometas em intervalos aleatórios e curtos (0,8s a 3s).
    // De vez em quando dispara 2 de uma vez, em posições diferentes.
    if (t > nextCometAt) {
      spawnComet();
      if (Math.random() < 0.35) spawnComet();
      nextCometAt = t + (Math.random() * 2200 + 800);
    }
    drawComets();

    requestAnimationFrame(loop);
  }

  // Versão estática (sem movimento) para prefers-reduced-motion:
  // mostra apenas o céu estrelado, sem cometas nem cintilação.
  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 90%, 85%, ${s.baseAlpha})`;
      ctx.fill();
    }
  }

  // Inicializa o canvas
  if (canvas && ctx) {
    resize();
    window.addEventListener("resize", debounce(resize, 200));

    if (reduceMotion) {
      drawStatic(); // sem animação
    } else {
      nextCometAt = 1500; // primeiro cometa logo no início
      requestAnimationFrame(loop);
    }
  }

  /* ==========================================================
     2) SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // anima só uma vez
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Sem suporte ou movimento reduzido: mostra tudo direto
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ==========================================================
     3) NAVBAR (blur ao rolar) + MENU MOBILE
     ========================================================== */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  // Adiciona blur/fundo à navbar depois de rolar um pouco
  function onScroll() {
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Abre/fecha o menu mobile
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });

    // Fecha o menu ao clicar em um link
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ==========================================================
     4) ANO ATUAL NO RODAPÉ
     ========================================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==========================================================
     UTILITÁRIO: debounce (evita recalcular demais no resize)
     ========================================================== */
  function debounce(fn, wait) {
    let timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, wait);
    };
  }
})();
