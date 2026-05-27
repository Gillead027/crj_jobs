// Este arquivo cria a estrutura principal de todas as paginas do sistema.
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

// Este import carrega os estilos globais para todas as telas do projeto.
import "./globals.css";

// Esta constante define informacoes que aparecem na aba do navegador e ajudam mecanismos de busca.
export const metadata: Metadata = {
  // Este titulo aparece na aba do navegador.
  title: "Gerador de Currículo CRJ",

  // Esta descricao resume o objetivo do sistema.
  description:
    "Sistema gratuito para jovens criarem currículos profissionais de forma simples.",

  // Este bloco melhora o compartilhamento em redes sociais e aplicativos de mensagem.
  openGraph: {
    // Este título aparece quando o link é compartilhado.
    title: "Gerador de Currículo CRJ",

    // Esta descrição aparece no preview do link compartilhado.
    description:
      "Sistema gratuito para jovens criarem currículos profissionais de forma simples.",

    // Este tipo informa que a página principal é um site.
    type: "website",

    // Este locale reforça o português brasileiro.
    locale: "pt_BR",

    // Este nome identifica o projeto no preview de compartilhamento.
    siteName: "Gerador de Currículo CRJ",
  },

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
      <body className="min-h-screen font-sans antialiased">
        {children}

        {/* Este Analytics acompanha uso geral do projeto sem interferir na geração do currículo. */}
        {/* Ele não salva o histórico local nem envia currículo completo criado no navegador. */}
        <Analytics />
      </body>
    </html>
  );
}
