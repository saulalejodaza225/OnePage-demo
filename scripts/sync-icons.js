// Carga solo los íconos de Material Symbols que usa el sitio (~10 KB en vez de ~1 MB).
// Si agregas un ícono nuevo y no ejecutas este script, se verá su nombre como texto.
// Uso: npm run build:icons
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
const sources = [...pages, 'site-nav.js', 'assets/marca/cart.js'];

const icons = new Set();
for (const file of sources) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const m of text.matchAll(/material-symbols-outlined[^>]*>\s*([a-z0-9_]+)\s*</g)) icons.add(m[1]);
  for (const m of text.matchAll(/icon\s*:\s*'([a-z0-9_]+)'/g)) icons.add(m[1]);
}
// Íconos que pedido-confirmado.html asigna en tiempo de ejecución como respaldo.
['storefront', 'receipt_long'].forEach((i) => icons.add(i));

const href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
  + '&amp;icon_names=' + [...icons].sort().join(',') + '&amp;display=block';
const link = '<link href="' + href + '" rel="stylesheet"/>';
const existing = /(<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Material\+Symbols\+Outlined[^"]*" rel="stylesheet"\/>\s*)+/;

let updated = 0;
for (const file of pages) {
  const full = path.join(root, file);
  const text = fs.readFileSync(full, 'utf8');
  if (!existing.test(text)) continue;
  const next = text.replace(existing, link + '\n');
  if (next !== text) { fs.writeFileSync(full, next); updated++; }
}
console.log(icons.size + ' íconos; ' + updated + ' páginas actualizadas.');
