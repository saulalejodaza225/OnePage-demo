(function () {
  var PAGES = [
    { href: 'inicio.html', label: 'Inicio' },
    { href: 'guia-de-estilo.html', label: 'Guía de Estilo' },
    { href: 'detalle-paquete.html', label: 'Detalle de Paquete' },
    { href: 'carrito.html', label: 'Carrito' },
    { href: 'checkout.html', label: 'Checkout' }
  ];

  function currentFile() {
    var path = window.location.pathname.split('/').pop();
    return path || 'inicio.html';
  }

  function buildPanel(panel) {
    var current = currentFile();
    panel.innerHTML = PAGES.map(function (p) {
      var active = p.href === current;
      var cls = active
        ? 'block px-4 py-2.5 font-label-md text-label-md text-primary font-bold bg-surface-container-high'
        : 'block px-4 py-2.5 font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors';
      return '<a href="' + p.href + '" class="' + cls + '">' + p.label + '</a>';
    }).join('');
  }

  function initMenu(btn, panel) {
    buildPanel(panel);
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', panel.classList.contains('hidden') ? 'false' : 'true');
    });

    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        panel.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('siteMenuBtn');
    var panel = document.getElementById('siteMenuPanel');
    if (btn && panel) initMenu(btn, panel);
  });
})();
