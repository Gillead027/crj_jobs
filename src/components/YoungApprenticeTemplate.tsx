// Este arquivo guarda o template "Jovem Aprendiz" do currículo.
import type { ResumeTemplateProps } from "@/types/resume";

// Este componente mostra uma orientação quando um campo está vazio.
function ApprenticeEmpty({ children }: { children: string }) {
  // Este retorno usa azul suave para manter o visual acolhedor.
  return <span className="text-slate-500">{children}</span>;
}

// Este componente mostra um bloco de seção no template jovem aprendiz.
function ApprenticeSection({
  title,
  children,
}: {
  // Este campo guarda o título da seção.
  title: string;

  // Este campo guarda o conteúdo da seção.
  children: React.ReactNode;
}) {
  // Este retorno monta uma seção leve com título bem visível.
  return (
    <section className="mt-6 min-w-0">
      {/* Este título usa verde para passar energia sem perder profissionalismo. */}
      <h3 className="break-words text-xs font-bold uppercase tracking-normal text-emerald-700">
        {title}
      </h3>

      {/* Este conteúdo fica logo abaixo do título. */}
      <div className="mt-3 min-w-0 break-words text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

// Este componente mostra lista no modelo Jovem Aprendiz.
function ApprenticeList({ items, emptyText }: { items: string[]; emptyText: string }) {
  // Esta condição mostra orientação quando não há itens reais.
  if (items.length === 0) {
    // Este retorno mostra a orientação sem inventar informação.
    return <ApprenticeEmpty>{emptyText}</ApprenticeEmpty>;
  }

  // Este retorno mostra itens em etiquetas leves.
  return (
    <ul className="flex min-w-0 flex-wrap gap-2">
      {/* Este mapa cria uma etiqueta por item. */}
      {items.map((item) => (
        <li
          key={item}
          className="max-w-full break-words rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-900"
        >
          {/* Este texto mostra o item real do currículo. */}
          {item}
        </li>
      ))}
    </ul>
  );
}

// Este componente mostra o currículo no modelo Jovem Aprendiz.
export function YoungApprenticeTemplate({ resume }: ResumeTemplateProps) {
  // Esta constante mostra o nome real ou uma orientação.
  const displayedName = resume.name || "Nome a preencher";

  // Este retorno monta um currículo claro, leve e profissional.
  return (
    <article className="mx-auto min-h-[920px] w-full max-w-[820px] overflow-hidden rounded-lg bg-white p-5 text-slate-900 shadow-2xl shadow-slate-300/50 sm:p-10">
      {/* Este cabeçalho usa gradiente discreto para deixar o template mais jovem. */}
      <header className="min-w-0 rounded-lg bg-gradient-to-br from-emerald-100 via-cyan-50 to-blue-100 p-5 sm:p-7">
        {/* Este nome aparece grande no topo. */}
        <h2 className="break-words text-3xl font-bold leading-tight tracking-normal text-slate-950 sm:text-5xl">
          {displayedName}
        </h2>

        {/* Este objetivo aparece abaixo em itálico. */}
        <p className="mt-3 break-words text-base italic text-emerald-800 sm:text-lg">
          {resume.professionalObjective || "Objetivo profissional a preencher"}
        </p>
      </header>

      {/* Este bloco divide o currículo em duas colunas. */}
      <div className="grid min-w-0 gap-8 pt-8 md:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
        {/* Esta coluna menor traz informações rápidas. */}
        <aside className="min-w-0">
          <ApprenticeSection title="Contato">
            <dl className="space-y-3">
              <div>
                <dt className="font-bold text-slate-950">Telefone</dt>
                <dd className="break-words">{resume.phone || <ApprenticeEmpty>A preencher</ApprenticeEmpty>}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-950">E-mail</dt>
                <dd className="break-words">{resume.email || <ApprenticeEmpty>A preencher</ApprenticeEmpty>}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-950">Cidade</dt>
                <dd className="break-words">{resume.city || <ApprenticeEmpty>A preencher</ApprenticeEmpty>}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-950">Idade</dt>
                <dd className="break-words">{resume.age || <ApprenticeEmpty>A preencher</ApprenticeEmpty>}</dd>
              </div>
            </dl>
          </ApprenticeSection>

          {/* Esta seção destaca habilidades em etiquetas. */}
          <ApprenticeSection title="Habilidades">
            <ApprenticeList items={resume.skills} emptyText="Cite suas habilidades." />
          </ApprenticeSection>

          {/* Esta seção mostra cursos em etiquetas. */}
          <ApprenticeSection title="Cursos">
            <ApprenticeList items={resume.courses} emptyText="Cite seus cursos." />
          </ApprenticeSection>
        </aside>

        {/* Esta coluna maior apresenta experiências e formação sem resumo automático. */}
        <main className="min-w-0">
          {/* Esta seção vem primeiro para valorizar práticas e experiências informais. */}
          <ApprenticeSection title="Experiências">
            <ApprenticeList
              items={resume.experiences}
              emptyText="Cite ajudas, projetos, trabalhos ou experiências informais."
            />
          </ApprenticeSection>

          <ApprenticeSection title="Formação">
            {resume.education || <ApprenticeEmpty>Informe sua formação.</ApprenticeEmpty>}
          </ApprenticeSection>

          <ApprenticeSection title="Informações adicionais">
            <ApprenticeList
              items={resume.additionalInfo}
              emptyText="Cite disponibilidade ou outras informações úteis."
            />
          </ApprenticeSection>
        </main>
      </div>
    </article>
  );
}
