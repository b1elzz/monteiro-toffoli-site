(function () {
  'use strict';
  var WA = '555189538750';
  var root = document.documentElement;
  root.classList.add('js');

  // menu em tela cheia
  var menu = document.getElementById('menu');
  var openBtn = document.getElementById('menu-open');
  var closeBtn = document.getElementById('menu-close');
  var lastFocus = null;
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { lastFocus = document.activeElement; closeBtn.focus(); }
    else if (lastFocus) { lastFocus.focus(); }
  }
  if (menu && openBtn && closeBtn) {
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setMenu(false); return; }
      if (e.key === 'Tab') {
        var f = menu.querySelectorAll('a,button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width:1280px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  // revelar ao rolar
  var els = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        if (it.isIntersecting) { it.target.classList.add('is-in'); io.unobserve(it.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }

  // formulário: monta a mensagem e abre o WhatsApp (nada é armazenado)
  var form = document.getElementById('contato-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var parts = ['Olá, meu nome é ' + d.get('nome') + '.', 'Telefone: ' + d.get('telefone') + '.', 'Assunto: ' + d.get('assunto') + '.'];
      var resumo = (d.get('resumo') || '').toString().trim();
      if (resumo) parts.push('Resumo: ' + resumo);
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(parts.join(' ')), '_blank', 'noopener');
    });
  }
})();
