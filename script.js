document.addEventListener('DOMContentLoaded', () => {

  /* 1. TEMA */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  }

  /* 2. NAVBAR E MENU */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuBtn.innerHTML = navLinks.classList.contains('open') ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  /* 3. LINK ATIVO */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) current = section.id;
    });
    navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  });

  /* 4. CURSOR */
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
  });

  function animateCursor() {
    if (outline) {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;
      outline.style.left = outlineX + 'px';
      outline.style.top = outlineY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .project-card, .skill-tags span, .sobre-card').forEach(el => {
    el.addEventListener('mouseenter', () => outline && outline.classList.add('hover'));
    el.addEventListener('mouseleave', () => outline && outline.classList.remove('hover'));
  });

  /* 5. CANVAS */
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(124, 156, 255, 0.6)'; ctx.fill(); }
    }

    const particleCount = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124, 156, 255, ${1 - dist / 120})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* 6. REVEAL */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* 7. MODAL DE PROJETOS (ATUALIZADO) */
  const projectData = {
    tongas: {
      title: 'Tongas BBQ', category: 'Restaurante', image: 'imagens/tongas-bbq.jpg',
      description: 'Website completo para restaurante de churrasco, com menu digital, sistema de pedidos e apresentação visual moderna.',
      features: ['Menu digital interativo', 'Sistema de pedidos', 'Design responsivo', 'Galeria de pratos', 'Integração WhatsApp', 'Otimizado para mobile'],
      tech: ['HTML5', 'CSS3', 'JavaScript'], link: null
    },
    calculadora: {
      title: 'Calculadora Interativa', category: 'Utilitário', image: 'imagens/calculadora.jpg',
      description: 'Uma calculadora web completa, com suporte para operações matemáticas básicas, teclado interativo e design responsivo. Desenvolvida com foco na lógica e experiência do utilizador.',
      features: ['Operações básicas (+ - * /)', 'Histórico de cálculos', 'Design responsivo', 'Suporte a teclado', 'Tema claro e escuro', 'Interface intuitiva'],
      tech: ['HTML5', 'CSS3', 'JavaScript'], link: null
    },
    tarefas: {
      title: 'Gestor de Tarefas', category: 'Produtividade', image: 'imagens/tarefas.jpg',
      description: 'Aplicação web para organizar o dia a dia. Permite criar, editar, marcar como concluída e remover tarefas, com dados guardados no navegador para não perderes nada.',
      features: ['Criar tarefas', 'Marcar como concluídas', 'Editar tarefas', 'Remover tarefas', 'Filtro por estado', 'Guarda os dados no navegador'],
      tech: ['HTML5', 'CSS3', 'JavaScript'], link: null
    }
  };

  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');

  function openModal(projectKey) {
    const p = projectData[projectKey];
    if (!p || !modal || !modalBody) return;

    const heroHTML = p.image ? `<div class="modal-hero"><img src="${p.image}" alt="${p.title}" /></div>` : `<div class="modal-hero modal-hero--placeholder"><i class="fa-solid fa-user-tie"></i></div>`;
    const featuresHTML = p.features.map(f => `<li><i class="fa-solid fa-check"></i>${f}</li>`).join('');
    const techHTML = p.tech.map(t => `<span>${t}</span>`).join('');
    const linkHTML = p.link ? `<a href="${p.link}" target="_blank" class="btn btn-primary"><i class="fa-solid fa-external-link-alt"></i> Visitar projeto</a>` : `<a href="https://wa.me/258856739601?text=Olá!%20Tenho%20interesse%20em%20saber%20mais%20sobre%20o%20projeto%20${encodeURIComponent(p.title)}" target="_blank" class="btn btn-primary"><i class="fa-brands fa-whatsapp"></i> Pedir mais info</a>`;

    modalBody.innerHTML = `
      ${heroHTML}
      <div class="modal-body-content">
        <span class="modal-category">${p.category}</span>
        <h2>${p.title}</h2>
        <p class="modal-description">${p.description}</p>
        <h4 class="modal-section-title">Funcionalidades</h4>
        <ul class="modal-features">${featuresHTML}</ul>
        <h4 class="modal-section-title">Tecnologias</h4>
        <div class="project-tags">${techHTML}</div>
        <div class="modal-actions">${linkHTML}<button class="btn btn-secondary" data-close><i class="fa-solid fa-xmark"></i> Fechar</button></div>
      </div>
    `;

    modalBody.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModal));
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.open)));
  if (modal) modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal(); });

  /* 8. FORMULÁRIO E FOOTER */
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if (form && toast && toastMessage) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      toastMessage.textContent = `Obrigado, ${nome}! Vou responder em breve. ✨`;
      toast.classList.add('show');
      form.reset();
      setTimeout(() => toast.classList.remove('show'), 4500);
    });
  }

  const yearEl = document.querySelector('.year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.opacity = '0.3'; console.warn(`Imagem não encontrada: ${img.src}`); });
  });

});