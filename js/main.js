(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  // cada bloco é independente: se um falhar, os outros continuam (o conteúdo nunca fica escondido)

  // largura útil sem a barra de rolagem: mantém as margens esquerda e direita idênticas
  try {
    var setVw = function () { root.style.setProperty('--vw', root.clientWidth + 'px'); };
    setVw();
    window.addEventListener('resize', setVw, { passive: true });
  } catch (e) { /* o CSS usa 100vw como alternativa */ }

  // revelar ao rolar
  try {
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
  } catch (e) {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('is-in'); });
  }

  // menu em tela cheia
  try {
    var menu = document.getElementById('menu');
    var openBtn = document.getElementById('menu-open');
    var closeBtn = document.getElementById('menu-close');
    var lastFocus = null;
    var setMenu = function (open) {
      if (!menu) return;
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) { lastFocus = document.activeElement; closeBtn.focus({ preventScroll: true }); }
      else if (lastFocus) { lastFocus.focus({ preventScroll: true }); }
    };
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
      var mq = window.matchMedia('(min-width:1280px)');
      var onMq = function (m) { if (m.matches) setMenu(false); };
      if (mq.addEventListener) { mq.addEventListener('change', onMq); } else if (mq.addListener) { mq.addListener(onMq); }
    }
  } catch (e) { /* sem menu: a página continua navegável pelas âncoras */ }

  // barra fixa do celular: aparece quando o leitor chega ao Método (depois de ver quem atende e em quê) e some no bloco de contato
  try {
    var bar = document.getElementById('bar');
    var heroCta = document.getElementById('metodo') || document.getElementById('hero-cta');
    var fim = document.querySelector('#contato .panel') || document.getElementById('contato') || document.querySelector('.ftr');
    if (bar && 'IntersectionObserver' in window) {
      var past = !heroCta, atEnd = false;
      var sync = function () { bar.classList.toggle('on', past && !atEnd); };
      if (heroCta) {
        new IntersectionObserver(function (i) { past = i[0].isIntersecting || i[0].boundingClientRect.top < 0; sync(); },
          { rootMargin: '0px 0px -30% 0px' }).observe(heroCta);
      }
      if (fim) {
        new IntersectionObserver(function (i) { atEnd = i[0].isIntersecting; sync(); },
          { rootMargin: '0px 0px -84px 0px' }).observe(fim);
      }
      sync();
    } else if (bar) { bar.classList.add('on'); }
  } catch (e) {
    var b = document.getElementById('bar'); if (b) b.classList.add('on');
  }
})();
