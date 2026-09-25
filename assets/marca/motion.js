(function () {
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(reduceQuery && reduceQuery.matches); }

  // Revelado al entrar en pantalla. Sin JS o con movimiento reducido, el contenido queda visible.
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length || reduced() || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('motion-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Parallax por capas: cada [data-parallax="velocidad"] dentro de un [data-parallax-scene]
  // se desplaza solo con transform. Escena "top" = anclada al inicio de la página (hero);
  // escena "center" = en reposo cuando la sección está centrada en la pantalla.
  function initParallax() {
    var scenes = [].slice.call(document.querySelectorAll('[data-parallax-scene]'));
    if (!scenes.length || !('IntersectionObserver' in window)) return;

    scenes.forEach(function (scene) {
      scene._layers = [].slice.call(scene.querySelectorAll('[data-parallax]')).map(function (el) {
        return { el: el, speed: parseFloat(el.getAttribute('data-parallax')) || 0 };
      });
    });

    var active = [];
    var ticking = false;
    var viewport = window.innerHeight;

    function update() {
      ticking = false;
      if (reduced()) return;
      active.forEach(function (scene) {
        var rect = scene.getBoundingClientRect();
        var offset = scene.getAttribute('data-parallax-scene') === 'top'
          ? Math.max(0, -rect.top)
          : viewport / 2 - (rect.top + rect.height / 2);
        scene._layers.forEach(function (layer) {
          layer.el.style.transform = 'translate3d(0,' + (offset * layer.speed).toFixed(1) + 'px,0)';
        });
      });
    }
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var i = active.indexOf(entry.target);
        if (entry.isIntersecting && i === -1) active.push(entry.target);
        if (!entry.isIntersecting && i !== -1) active.splice(i, 1);
      });
      requestUpdate();
    }, { rootMargin: '120px 0px' });
    scenes.forEach(function (scene) { io.observe(scene); });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', function () { viewport = window.innerHeight; requestUpdate(); });
    if (reduceQuery && reduceQuery.addEventListener) {
      reduceQuery.addEventListener('change', function () {
        if (!reduced()) { requestUpdate(); return; }
        scenes.forEach(function (scene) { scene._layers.forEach(function (layer) { layer.el.style.transform = ''; }); });
      });
    }
  }

  function init() { initReveal(); initParallax(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
