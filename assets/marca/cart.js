(function (global) {
  'use strict';

  var STORAGE_KEY = 'onepage_carrito';

  // Catálogo: mismos nombres, precios y tiempos de entrega ya publicados en inicio.html#catalogo
  var CATALOG = {
    landing: {
      id: 'landing',
      nombre: 'Landing Page',
      resumen: 'Página única de alto impacto, ideal para empezar a recibir clientes',
      entrega: '5 días hábiles',
      precio: 637500,
      precioOriginal: 750000,
      fotos: 15,
      tipo: 'paquete',
      icon: 'rocket_launch'
    },
    pyme: {
      id: 'pyme',
      nombre: 'Página PYME',
      resumen: 'CMS administrador y blog, ideal para actualizar la web tú mismo',
      entrega: '8 días hábiles',
      precio: 1020000,
      precioOriginal: 1200000,
      fotos: 20,
      tipo: 'paquete',
      icon: 'edit_note'
    },
    empresarial: {
      id: 'empresarial',
      nombre: 'Página Empresarial',
      resumen: 'Catálogo de hasta 50 productos con buscador interno',
      entrega: '12 días hábiles',
      precio: 1530000,
      precioOriginal: 1800000,
      fotos: 35,
      tipo: 'paquete',
      icon: 'dataset'
    },
    tienda: {
      id: 'tienda',
      nombre: 'Tienda Online',
      resumen: 'Catálogo con checkout, carrito y pagos en línea (PSE, Nequi, Tarjetas)',
      entrega: '15 días hábiles',
      precio: 2040000,
      precioOriginal: 2400000,
      fotos: 50,
      tipo: 'paquete',
      icon: 'payments'
    },
    'complemento-bronce': {
      id: 'complemento-bronce',
      nombre: 'Acompañamiento de Marketing Bronce',
      resumen: '1 sesión de grabación (2h) + 4 Reels editados al mes + Mantenimiento VIP de tu página',
      entrega: 'Facturación mensual',
      precio: 499000,
      precioOriginal: 499000,
      fotos: 0,
      tipo: 'complemento',
      icon: 'redeem'
    },
    'complemento-plata': {
      id: 'complemento-plata',
      nombre: 'Acompañamiento de Marketing Plata',
      resumen: '1 sesión de grabación (3h) + 8 Reels editados al mes + Mantenimiento VIP de tu página',
      entrega: 'Facturación mensual',
      precio: 699000,
      precioOriginal: 699000,
      fotos: 0,
      tipo: 'complemento',
      icon: 'redeem'
    },
    'complemento-oro': {
      id: 'complemento-oro',
      nombre: 'Acompañamiento de Marketing Oro',
      resumen: '2 sesiones de grabación (3h c/u) + 12 Reels editados al mes + Mantenimiento VIP de tu página',
      entrega: 'Facturación mensual',
      precio: 1149000,
      precioOriginal: 1149000,
      fotos: 0,
      tipo: 'complemento',
      icon: 'workspace_premium'
    },
    'combo-impulso-rapido': {
      id: 'combo-impulso-rapido',
      nombre: 'Plan Impulso Rápido',
      resumen: 'Landing Page + 2 meses de Mantenimiento VIP incluidos, para lanzar y afinar tu página sin pagar aparte las primeras semanas',
      entrega: '5 días hábiles',
      precio: 890000,
      precioOriginal: 935500,
      fotos: 15,
      tipo: 'paquete',
      icon: 'bolt'
    }
  };

  function readRaw() {
    var rows;
    try {
      rows = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      rows = [];
    }
    if (!Array.isArray(rows)) return [];
    return rows.filter(function (row) {
      return row && CATALOG[row.id] && Number.isInteger(row.qty) && row.qty > 0;
    });
  }

  function writeRaw(rows) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch (e) {}
    notify();
  }

  function notify() {
    var detail = { items: getItems() };
    try {
      global.dispatchEvent(new CustomEvent('onepage:cart-updated', { detail: detail }));
    } catch (e) {}
  }

  function getItems() {
    return readRaw().map(function (row) {
      var pkg = CATALOG[row.id];
      return {
        id: pkg.id,
        nombre: pkg.nombre,
        resumen: pkg.resumen,
        entrega: pkg.entrega,
        icon: pkg.icon,
        tipo: pkg.tipo,
        precio: pkg.precio,
        precioOriginal: pkg.precioOriginal,
        fotos: pkg.fotos,
        qty: row.qty,
        subtotal: pkg.precio * row.qty,
        fotosSubtotal: pkg.fotos * row.qty
      };
    });
  }

  function add(id, qty) {
    if (!CATALOG[id]) return;
    qty = Number.isInteger(qty) && qty > 0 ? qty : 1;
    var rows = readRaw();
    var row = rows.filter(function (r) { return r.id === id; })[0];
    if (row) {
      row.qty += qty;
    } else {
      rows.push({ id: id, qty: qty });
    }
    writeRaw(rows);
  }

  // Los complementos (Bronce/Plata/Oro) son excluyentes entre sí: agregar uno reemplaza cualquier otro.
  function setComplemento(id) {
    if (!CATALOG[id] || CATALOG[id].tipo !== 'complemento') return;
    var rows = readRaw().filter(function (r) {
      return !CATALOG[r.id] || CATALOG[r.id].tipo !== 'complemento';
    });
    rows.push({ id: id, qty: 1 });
    writeRaw(rows);
  }

  function setQty(id, qty) {
    var rows = readRaw();
    if (qty <= 0) {
      rows = rows.filter(function (r) { return r.id !== id; });
    } else {
      var row = rows.filter(function (r) { return r.id === id; })[0];
      if (row) row.qty = qty;
    }
    writeRaw(rows);
  }

  function removeItem(id) {
    writeRaw(readRaw().filter(function (r) { return r.id !== id; }));
  }

  function clear() {
    writeRaw([]);
  }

  function getCount() {
    return readRaw().reduce(function (sum, r) { return sum + r.qty; }, 0);
  }

  function getTotals() {
    var items = getItems();
    var total = items.reduce(function (sum, it) { return sum + it.subtotal; }, 0);
    var totalOriginal = items.reduce(function (sum, it) { return sum + it.precioOriginal * it.qty; }, 0);
    var fotosTotal = items.reduce(function (sum, it) { return sum + it.fotosSubtotal; }, 0);
    // 50% del valor total ahora (sin importar cuántos productos o de qué tipo), 50% restante al publicar.
    var anticipo = Math.round(total / 2);
    return {
      items: items,
      total: total,
      totalOriginal: totalOriginal,
      ahorro: totalOriginal - total,
      fotosTotal: fotosTotal,
      anticipo: anticipo,
      saldo: total - anticipo
    };
  }

  function formatCOP(n) {
    return '$' + Math.round(n || 0).toLocaleString('es-CO');
  }

  // Nombre corto para títulos: "Landing Page", "Landing Page + Página PYME" o "Landing Page + 2 más"
  function describe(items) {
    if (!items.length) return '';
    if (items.length === 1) return items[0].nombre;
    if (items.length === 2) return items[0].nombre + ' + ' + items[1].nombre;
    return items[0].nombre + ' + ' + (items.length - 1) + ' más';
  }

  // Número de pedido único por compra (no hay backend: se deriva del instante exacto de la compra)
  function generarNumeroPedido() {
    return 'OP-' + String(Date.now()).slice(-6);
  }

  global.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) notify();
  });

  global.OnePageCart = {
    CATALOG: CATALOG,
    add: add,
    removeItem: removeItem,
    setQty: setQty,
    setComplemento: setComplemento,
    clear: clear,
    getItems: getItems,
    getCount: getCount,
    getTotals: getTotals,
    formatCOP: formatCOP,
    describe: describe,
    generarNumeroPedido: generarNumeroPedido
  };
})(window);
