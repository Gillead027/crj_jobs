// Este arquivo guarda a lista de modelos visuais disponíveis para o currículo.
import type { ResumeTemplateId, ResumeTemplateOption } from "@/types/resume";

// Esta lista define os templates que aparecem no carrossel de escolha.
export const resumeTemplates: ResumeTemplateOption[] = [
  // Este modelo segue o visual minimalista premium pedido como referência.
  {
    id: "classic-elegant",
    name: "Clássico Elegante",
    description: "Minimalista, bege claro, terracota e duas colunas elegantes.",
    accentClassName: "from-stone-200 via-orange-100 to-amber-50",
  },

  // Este modelo tem aparência mais corporativa e atual.
  {
    id: "modern-professional",
    name: "Moderno Profissional",
    description: "Visual limpo, forte e direto para processos seletivos formais.",
    accentClassName: "from-sky-100 via-slate-100 to-emerald-50",
  },

  // Este modelo é pensado para jovens que buscam a primeira oportunidade.
  {
    id: "young-apprentice",
    name: "Jovem Aprendiz",
    description: "Leve, acessível e acolhedor para primeiro emprego ou aprendizagem.",
    accentClassName: "from-lime-100 via-cyan-50 to-blue-100",
  },
];

// Esta função encontra o template escolhido pelo usuário.
export function getResumeTemplate(templateId: ResumeTemplateId) {
  // Esta linha procura o template pelo identificador.
  const template = resumeTemplates.find((item) => item.id === templateId);

  // Este retorno garante que sempre exista um template válido.
  return template ?? resumeTemplates[0];
}
