// Este arquivo configura o Tailwind CSS, que fornece as classes usadas para estilizar a tela.
import type { Config } from "tailwindcss";

// Esta constante guarda as regras do Tailwind para este projeto.
const config: Config = {
  // Esta lista diz ao Tailwind onde procurar classes de estilo no codigo.
  content: [
    // Este caminho cobre todas as telas e componentes dentro da pasta src.
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Este bloco permite personalizar cores, fontes e tamanhos quando o projeto crescer.
  theme: {
    // Este bloco mantem os valores padrao do Tailwind e permite adicionar novos depois.
    extend: {
      // Esta fonte deixa o texto agradavel e ainda usa fontes seguras do sistema.
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },

  // Esta lista fica vazia porque a base ainda nao precisa de plugins extras do Tailwind.
  plugins: [],
};

// Esta linha entrega a configuracao para o Tailwind CSS.
export default config;
