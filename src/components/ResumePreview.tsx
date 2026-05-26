// Este arquivo escolhe qual template visual deve renderizar o currículo.
import { ElegantResumeTemplate } from "@/components/ElegantResumeTemplate";
import { ModernResumeTemplate } from "@/components/ModernResumeTemplate";
import { YoungApprenticeTemplate } from "@/components/YoungApprenticeTemplate";

// Este import traz o tipo das propriedades recebidas pelo componente.
import type { ResumePreviewProps } from "@/types/resume";

// Este componente recebe o currículo e aplica o modelo visual escolhido pelo usuário.
export function ResumePreview({ resume, templateId }: ResumePreviewProps) {
  // Esta condição mostra o modelo corporativo moderno quando ele foi escolhido.
  if (templateId === "modern-professional") {
    // Este retorno renderiza o template moderno.
    return <ModernResumeTemplate resume={resume} />;
  }

  // Esta condição mostra o modelo jovem aprendiz quando ele foi escolhido.
  if (templateId === "young-apprentice") {
    // Este retorno renderiza o template jovem aprendiz.
    return <YoungApprenticeTemplate resume={resume} />;
  }

  // Este retorno usa o modelo clássico elegante como padrão.
  return <ElegantResumeTemplate resume={resume} />;
}
