// Este arquivo guarda o template "Clássico Elegante" do currículo.
import type { ResumeTemplateProps } from "@/types/resume";

// Este componente mostra uma sugestão quando o campo ainda não foi preenchido.
function EmptyText({ children }: { children: string }) {
  // Este retorno usa cor suave para mostrar que é orientação, não dado real.
  return <span className="text-[#9b8b7d]">{children}</span>;
}

// Este componente mostra uma seção com título e conteúdo em texto.
function ElegantTextSection({
  title,
  value,
  emptyText,
}: {
  // Este campo guarda o título da seção.
  title: string;

  // Este campo guarda o texto real do currículo.
  value: string;

  // Este campo guarda a orientação quando o texto está vazio.
  emptyText: string;
}) {
  // Este retorno cria uma seção elegante com bastante espaço em branco.
  return (
    <section className="mt-7 min-w-0">
      {/* Este título usa terracota para seguir a referência visual premium. */}
      <h3 className="break-words text-xs font-bold uppercase tracking-normal text-[#9a5b44]">
        {title}
      </h3>

      {/* Este parágrafo mostra dado real ou sugestão. */}
      <p className="mt-3 break-words text-sm leading-7 text-[#3b332e]">
        {value || <EmptyText>{emptyText}</EmptyText>}
      </p>
    </section>
  );
}

// Este componente mostra uma seção com lista.
function ElegantListSection({
  title,
  items,
  emptyText,
}: {
  // Este campo guarda o título da lista.
  title: string;

  // Este campo guarda os itens reais da lista.
  items: string[];

  // Este campo guarda a orientação quando não há itens.
  emptyText: string;
}) {
  // Este retorno cria uma lista simples e limpa.
  return (
    <section className="mt-7 min-w-0">
      {/* Este título usa o mesmo padrão das outras seções. */}
      <h3 className="break-words text-xs font-bold uppercase tracking-normal text-[#9a5b44]">
        {title}
      </h3>

      {/* Esta condição mostra sugestão quando a lista está vazia. */}
      {items.length === 0 ? (
        <p className="mt-3 break-words text-sm leading-7 text-[#3b332e]">
          <EmptyText>{emptyText}</EmptyText>
        </p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#3b332e]">
          {/* Este mapa cria uma linha para cada item real. */}
          {items.map((item) => (
            <li key={item} className="flex min-w-0 gap-2">
              {/* Este marcador combina com os detalhes terracota. */}
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9a5b44]" />

              {/* Este texto mostra o item real do currículo. */}
              <span className="min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Este componente mostra o currículo no modelo minimalista premium.
export function ElegantResumeTemplate({ resume }: ResumeTemplateProps) {
  // Esta constante mostra o nome real ou uma orientação quando falta nome.
  const displayedName = resume.name || "Nome a preencher";

  // Esta constante mostra o objetivo abaixo do nome, em estilo itálico.
  const displayedObjective =
    resume.professionalObjective || "Objetivo profissional a preencher";

  // Este retorno monta uma folha vertical no formato visual de A4.
  return (
    <article className="mx-auto aspect-[210/297] min-h-[980px] w-full max-w-[794px] overflow-hidden rounded-lg bg-[#f4eee6] p-5 text-[#2f2a27] shadow-2xl shadow-stone-300/50 sm:p-12">
      {/* Este cabeçalho coloca nome grande e objetivo em itálico no topo. */}
      <header className="min-w-0 border-b border-[#d6c3b2] pb-9">
        {/* Este nome grande usa terracota, como no modelo clássico de referência. */}
        <h2 className="break-words text-3xl font-bold leading-tight tracking-normal text-[#8f4f38] sm:text-6xl">
          {displayedName}
        </h2>

        {/* Este objetivo fica logo abaixo do nome em itálico. */}
        <p className="mt-3 break-words text-base italic text-[#6f5a4d] sm:text-lg">{displayedObjective}</p>
      </header>

      {/* Este bloco cria a estrutura de duas colunas do currículo. */}
      <div className="grid min-w-0 gap-8 pt-9 md:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] md:gap-10">
        {/* Esta coluna menor guarda contato, habilidades e cursos. */}
        <aside className="min-w-0 border-[#d8c7b9] md:border-r md:pr-8">
          {/* Esta seção mostra dados de contato. */}
          <section>
            <h3 className="break-words text-xs font-bold uppercase tracking-normal text-[#9a5b44]">
              Contato
            </h3>

            {/* Esta lista mantém dados pessoais organizados em linhas curtas. */}
            <dl className="mt-4 space-y-4 text-sm leading-6">
              <div>
                {/* Este rótulo destaca o tipo de contato. */}
                <dt className="font-bold text-[#8f4f38]">Telefone</dt>

                {/* Este valor mostra o telefone real ou orientação de preenchimento. */}
                <dd className="break-words">{resume.phone || <EmptyText>A preencher</EmptyText>}</dd>
              </div>
              <div>
                {/* Este rótulo destaca o e-mail. */}
                <dt className="font-bold text-[#8f4f38]">E-mail</dt>

                {/* Este valor mostra o e-mail real ou orientação de preenchimento. */}
                <dd className="break-words">{resume.email || <EmptyText>A preencher</EmptyText>}</dd>
              </div>
              <div>
                {/* Este rótulo destaca a cidade. */}
                <dt className="font-bold text-[#8f4f38]">Cidade</dt>

                {/* Este valor mostra a cidade real ou orientação de preenchimento. */}
                <dd className="break-words">{resume.city || <EmptyText>A preencher</EmptyText>}</dd>
              </div>
              <div>
                {/* Este rótulo destaca a idade. */}
                <dt className="font-bold text-[#8f4f38]">Idade</dt>

                {/* Este valor mostra a idade real ou orientação de preenchimento. */}
                <dd className="break-words">{resume.age || <EmptyText>A preencher</EmptyText>}</dd>
              </div>
            </dl>
          </section>

          {/* Esta seção mostra habilidades na coluna lateral. */}
          <ElegantListSection
            title="Habilidades"
            items={resume.skills}
            emptyText="Cite ferramentas e habilidades."
          />

          {/* Esta seção mostra cursos na coluna lateral. */}
          <ElegantListSection
            title="Cursos"
            items={resume.courses}
            emptyText="Cite cursos ou certificados."
          />
        </aside>

        {/* Esta coluna maior guarda as informações principais do currículo, sem seção de resumo. */}
        <main className="min-w-0">
          {/* Esta seção aparece primeiro porque o resumo foi removido para deixar o currículo direto. */}
          <ElegantListSection
            title="Experiências"
            items={resume.experiences}
            emptyText="Cite trabalhos, ajudas, projetos ou experiências informais."
          />

          {/* Esta seção mostra a formação. */}
          <ElegantTextSection
            title="Formação"
            value={resume.education}
            emptyText="Informe sua escola, série ou curso."
          />

          {/* Esta seção mostra informações adicionais. */}
          <ElegantListSection
            title="Informações adicionais"
            items={resume.additionalInfo}
            emptyText="Cite disponibilidade, CNH ou dados úteis."
          />
        </main>
      </div>
    </article>
  );
}
