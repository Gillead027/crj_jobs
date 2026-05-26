// Este arquivo configura o ESLint, que ajuda a encontrar problemas no codigo antes da publicacao.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// Este import adiciona regras recomendadas para arquivos TypeScript.
import nextTypescript from "eslint-config-next/typescript";

// Esta constante junta as regras oficiais do Next.js com regras para TypeScript.
const eslintConfig = [
  // Esta parte verifica boas praticas importantes para paginas Next.js.
  ...nextCoreWebVitals,

  // Esta parte verifica boas praticas para codigo TypeScript.
  ...nextTypescript,

  // Este bloco ignora pastas que sao geradas automaticamente.
  {
    // Esta lista evita que o ESLint analise arquivos que nao foram escritos manualmente.
    ignores: [
      // Esta pasta guarda dependencias baixadas pelo npm.
      "node_modules/**",

      // Esta pasta guarda arquivos de build criados pelo Next.js.
      ".next/**",

      // Esta pasta pode existir em builds exportados no futuro.
      "out/**",

      // Este arquivo e gerado para tipos internos do Next.js.
      "next-env.d.ts",
    ],
  },
];

// Esta linha entrega a configuracao para o ESLint.
export default eslintConfig;
