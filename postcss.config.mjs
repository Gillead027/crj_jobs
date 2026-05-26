// Este arquivo conecta o Tailwind CSS ao PostCSS, que processa os estilos do projeto.
const config = {
  // Esta lista mostra quais plugins de estilo serao usados.
  plugins: {
    // Este plugin transforma as classes do Tailwind em CSS real.
    tailwindcss: {},

    // Este plugin adiciona prefixos para melhorar compatibilidade entre navegadores.
    autoprefixer: {},
  },
};

// Esta linha entrega a configuracao para o PostCSS.
export default config;
