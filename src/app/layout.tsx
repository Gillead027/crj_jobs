// Este arquivo cria a estrutura principal de todas as paginas do sistema.
import type { Metadata } from "next";

// Este import carrega os estilos globais para todas as telas do projeto.
import "./globals.css";

// Esta constante define informacoes que aparecem na aba do navegador e ajudam mecanismos de busca.
export const metadata: Metadata = {
  // Este titulo aparece na aba do navegador.
  title: "Gerador de Currículo CRJ",

  // Esta descricao resume o objetivo do sistema.
  description: "Transforme um relato simples em um currículo profissional.",

  // Este bloco configura os icones do site usados pelo navegador.
  // O favicon aparece na aba, e o icone maior pode ser usado em atalhos ou favoritos.
  icons: {
    // Este arquivo SVG pequeno foi criado para funcionar bem mesmo na aba do navegador.
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],

    // Este atalho ajuda navegadores a encontrarem o mesmo favicon principal.
    shortcut: "/favicon.svg",

    // Este arquivo maior ajuda quando o navegador precisa de um icone em tamanho maior.
    apple: "/icon.svg",
  },
};

// Este tipo define quais dados o componente RootLayout recebe.
type RootLayoutProps = {
  // Esta propriedade representa o conteudo da pagina atual.
  children: React.ReactNode;
};

// Esta funcao cria o HTML base que envolve toda a aplicacao.
export default function RootLayout({ children }: RootLayoutProps) {
  // Este retorno monta a pagina usando idioma portugues do Brasil.
  return (
    <html lang="pt-BR">
      {/* Este body recebe classes de fonte, suavizacao e tamanho minimo da tela. */}
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
