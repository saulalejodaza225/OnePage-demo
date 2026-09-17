// One Page · Paleta "Noche Real" para tailwind.config (theme.extend)
// Uso: bg-op-medianoche, text-op-azul-real, bg-op-oro-real, text-op-oro-antiguo, etc.
export const onePageTheme = {
  colors: {
    'op-medianoche': '#070E1B',
    'op-azul-real': '#0B1D33',
    'op-azul-profundo': '#12233B',
    'op-borde-noche': '#22334D',
    'op-oro-real': '#F4B63F',
    'op-oro-antiguo': '#8A6212',
    'op-marfil': '#FAF8F3',
    'op-blanco': '#FFFFFF',
    'op-lino': '#ECE6DA',
    'op-borde-claro': '#E3DCCF',
    'op-pizarra': '#4E5968',
    'op-niebla': '#B4BECC',
    'op-violeta': '#5E3AA8',
    'op-whatsapp': '#25D366',
    'op-exito': '#1B7F52',
    'op-error': '#B3261E',
  },
  fontFamily: {
    titulos: ['Lora', 'Georgia', 'serif'],
    ui: ['Poppins', 'system-ui', 'sans-serif'],
    texto: ['Inter', 'system-ui', 'sans-serif'],
  },
  borderRadius: { boton: '10px', tarjeta: '16px' },
};
// Si el proyecto usa el Tailwind del CDN con <script>tailwind.config = {...}</script>,
// copia estos mismos valores dentro de theme.extend en ese bloque.
