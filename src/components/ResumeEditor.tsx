"use client";

// Este arquivo guarda o editor que aparece depois que o currículo foi gerado.
// Ele permite ajustar os dados antes do download, e o mesmo estado salvo alimenta a prévia e o PDF.
import { Save } from "lucide-react";

// Este import permite controlar o formulário local de edição.
import { useState } from "react";

// Estes tipos descrevem eventos de campos e envio do formulário.
import type { ChangeEvent, FormEvent } from "react";

// Este import traz os tipos do currículo e das propriedades do editor.
import type { ResumeData, ResumeEditorProps } from "@/types/resume";

// Este tipo guarda os campos como texto editável, inclusive listas em formato de uma linha por item.
type ResumeEditorFormData = {
  // Este campo edita o nome exibido no topo do currículo.
  name: string;

  // Este campo edita o telefone de contato.
  phone: string;

  // Este campo edita o e-mail de contato.
  email: string;

  // Este campo edita a cidade.
  city: string;

  // Este campo edita o objetivo profissional curto.
  professionalObjective: string;

  // Este campo edita as experiências como texto de múltiplas linhas.
  experiences: string;

  // Este campo edita as habilidades como texto de múltiplas linhas.
  skills: string;

  // Este campo edita a formação escolar ou acadêmica.
  education: string;

  // Este campo edita os cursos como texto de múltiplas linhas.
  courses: string;

  // Este campo edita informações adicionais como texto de múltiplas linhas.
  additionalInfo: string;
};

// Este tipo limita quais campos simples usam input de uma linha.
type SingleLineField = "name" | "phone" | "email" | "city" | "professionalObjective";

// Este tipo limita quais campos maiores usam textarea.
type MultiLineField = "experiences" | "skills" | "education" | "courses" | "additionalInfo";

// Esta classe comum mantém inputs responsivos e impede que campos estourem a largura no celular.
const inputClassName =
  "w-full max-w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-teal-600 focus:outline-none";

// Esta classe comum mantém textareas responsivos, com quebra de palavras e largura segura.
const textareaClassName =
  "min-h-28 w-full max-w-full resize-y overflow-hidden rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-900 shadow-sm transition placeholder:text-slate-400 break-words focus:border-teal-600 focus:outline-none";

// Esta função converte uma lista do currículo em texto editável, com um item por linha.
function listToText(items: string[]) {
  // Esta linha preserva a ordem atual da pré-visualização no formulário.
  return items.join("\n");
}

// Esta função transforma o texto de várias linhas de volta em lista limpa.
function textToList(text: string) {
  // Esta linha remove linhas vazias e espaços extras para o PDF não receber itens em branco.
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Esta função monta os valores editáveis a partir do currículo atual.
function createFormDataFromResume(resume: ResumeData): ResumeEditorFormData {
  // Este retorno converte arrays em texto para o usuário editar sem interface complexa.
  return {
    name: resume.name,
    phone: resume.phone,
    email: resume.email,
    city: resume.city,
    professionalObjective: resume.professionalObjective,
    experiences: listToText(resume.experiences),
    skills: listToText(resume.skills),
    education: resume.education,
    courses: listToText(resume.courses),
    additionalInfo: listToText(resume.additionalInfo),
  };
}

// Esta função monta um novo currículo pronto para pré-visualização e PDF.
function createResumeFromFormData(
  formData: ResumeEditorFormData,
  currentResume: ResumeData,
): ResumeData {
  // Este retorno mantém a idade original, porque o pedido de edição não inclui campo de idade.
  return {
    name: formData.name.trim(),
    age: currentResume.age,
    phone: formData.phone.trim(),
    email: formData.email.trim(),
    city: formData.city.trim(),
    professionalObjective: formData.professionalObjective.trim(),
    education: formData.education.trim(),
    experiences: textToList(formData.experiences),
    skills: textToList(formData.skills),
    courses: textToList(formData.courses),
    additionalInfo: textToList(formData.additionalInfo),
  };
}

// Este componente mostra os campos editáveis depois que a IA gera o currículo.
export function ResumeEditor({
  // Esta propriedade traz os dados atuais do currículo gerado.
  resume,

  // Esta propriedade salva as alterações no estado principal da página.
  onSave,
}: ResumeEditorProps) {
  // Este estado local permite editar vários campos antes de aplicar as mudanças na prévia.
  const [formData, setFormData] = useState<ResumeEditorFormData>(() =>
    createFormDataFromResume(resume),
  );

  // Esta função atualiza campos simples, como nome e telefone.
  function handleSingleLineChange(field: SingleLineField) {
    // Este retorno cria o handler específico para o campo informado.
    return (event: ChangeEvent<HTMLInputElement>) => {
      // Esta linha guarda o novo valor sem salvar ainda no PDF.
      setFormData((currentFormData) => ({
        ...currentFormData,
        [field]: event.target.value,
      }));
    };
  }

  // Esta função atualiza campos grandes, como experiências e habilidades.
  function handleMultiLineChange(field: MultiLineField) {
    // Este retorno cria o handler específico para o textarea informado.
    return (event: ChangeEvent<HTMLTextAreaElement>) => {
      // Esta linha guarda o texto digitado até o usuário clicar em salvar alterações.
      setFormData((currentFormData) => ({
        ...currentFormData,
        [field]: event.target.value,
      }));
    };
  }

  // Esta função salva o formulário no currículo usado pela pré-visualização e pelo PDF.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Esta linha impede recarregar a página ao clicar em "Salvar alterações".
    event.preventDefault();

    // Esta constante converte o formulário em dados estruturados de currículo.
    const nextResume = createResumeFromFormData(formData, resume);

    // Esta linha entrega o currículo atualizado para a página principal.
    onSave(nextResume);
  }

  // Este retorno monta o editor com largura segura para celulares de 360px.
  return (
    <section className="w-full max-w-full overflow-hidden rounded-lg border border-teal-100 bg-white/90 p-4 shadow-lg shadow-slate-200/50 backdrop-blur sm:p-5">
      {/* Este cabeçalho identifica o modo de edição do currículo gerado. */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-teal-700">Edição do currículo</p>
        <h2 className="mt-1 break-words text-xl font-bold text-slate-950">
          Ajuste as informações antes de baixar
        </h2>
      </div>

      {/* Este formulário mantém os dados editáveis até o usuário confirmar no botão de salvar. */}
      <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
        {/* Este grid vira uma coluna no celular para evitar corte lateral. */}
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {/* Este campo edita o nome do currículo. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Nome
            <input
              type="text"
              value={formData.name}
              onChange={handleSingleLineChange("name")}
              className={`${inputClassName} mt-2`}
              placeholder="Nome completo"
            />
          </label>

          {/* Este campo edita o telefone de contato. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Telefone
            <input
              type="text"
              value={formData.phone}
              onChange={handleSingleLineChange("phone")}
              className={`${inputClassName} mt-2`}
              placeholder="Telefone ou WhatsApp"
            />
          </label>

          {/* Este campo edita o e-mail de contato. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Email
            <input
              type="email"
              value={formData.email}
              onChange={handleSingleLineChange("email")}
              className={`${inputClassName} mt-2`}
              placeholder="email@exemplo.com"
            />
          </label>

          {/* Este campo edita a cidade. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Cidade
            <input
              type="text"
              value={formData.city}
              onChange={handleSingleLineChange("city")}
              className={`${inputClassName} mt-2`}
              placeholder="Cidade e estado"
            />
          </label>
        </div>

        {/* Este campo edita o objetivo profissional curto. */}
        <label className="block min-w-0 text-sm font-semibold text-slate-800">
          Objetivo
          <input
            type="text"
            value={formData.professionalObjective}
            onChange={handleSingleLineChange("professionalObjective")}
            className={`${inputClassName} mt-2`}
            placeholder="Jovem Aprendiz Administrativo"
          />
        </label>

        {/* Este campo edita as experiências com um item por linha. */}
        <label className="block min-w-0 text-sm font-semibold text-slate-800">
          Experiências
          <textarea
            value={formData.experiences}
            onChange={handleMultiLineChange("experiences")}
            className={`${textareaClassName} mt-2`}
            placeholder="Uma experiência por linha"
          />
        </label>

        {/* Este campo edita as habilidades com um item por linha. */}
        <label className="block min-w-0 text-sm font-semibold text-slate-800">
          Habilidades
          <textarea
            value={formData.skills}
            onChange={handleMultiLineChange("skills")}
            className={`${textareaClassName} mt-2`}
            placeholder="Uma habilidade por linha"
          />
        </label>

        {/* Este campo edita a formação escolar ou acadêmica. */}
        <label className="block min-w-0 text-sm font-semibold text-slate-800">
          Formação
          <textarea
            value={formData.education}
            onChange={handleMultiLineChange("education")}
            className={`${textareaClassName} mt-2`}
            placeholder="Escola, série, curso ou formação"
          />
        </label>

        {/* Este grid organiza cursos e informações adicionais sem forçar largura fixa. */}
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {/* Este campo edita os cursos com um item por linha. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Cursos
            <textarea
              value={formData.courses}
              onChange={handleMultiLineChange("courses")}
              className={`${textareaClassName} mt-2`}
              placeholder="Um curso por linha"
            />
          </label>

          {/* Este campo edita informações adicionais com um item por linha. */}
          <label className="block min-w-0 text-sm font-semibold text-slate-800">
            Informações adicionais
            <textarea
              value={formData.additionalInfo}
              onChange={handleMultiLineChange("additionalInfo")}
              className={`${textareaClassName} mt-2`}
              placeholder="Disponibilidade, CNH ou outras informações"
            />
          </label>
        </div>

        {/* Este bloco deixa o botão ocupar a largura inteira no celular. */}
        <div className="flex justify-end">
          {/* Este botão aplica as alterações no currículo, atualizando prévia e PDF. */}
          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-800 focus-visible:outline-teal-700 sm:w-auto"
          >
            {/* Este ícone reforça que a ação salva a edição atual. */}
            <Save className="h-4 w-4 shrink-0" aria-hidden="true" />

            {/* Este texto confirma que o usuário vai atualizar a prévia e o PDF. */}
            <span className="min-w-0 break-words">Salvar alterações</span>
          </button>
        </div>
      </form>
    </section>
  );
}
