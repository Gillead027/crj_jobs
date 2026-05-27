// Este arquivo guarda o template "Moderno Profissional" do currículo.
import type { ResumeTemplateProps } from "@/types/resume";

// Este componente mostra texto de orientação quando falta uma informação.
function ModernEmpty({ children }: { children: string }) {
  // Este retorno usa cinza discreto para diferenciar sugestão de dado real.
  return <span className="text-slate-400">{children}</span>;
}

// Este componente mostra uma seção do template moderno.
function ModernSection({
  title,
  children,
}: {
  // Este campo guarda o título da seção.
  title: string;

  // Este campo guarda o conteúdo da seção.
  children: React.ReactNode;
}) {
  // Este retorno monta uma seção com divisor fino e aparência profissional.
  return (
    <section className="mt-6 min-w-0 border-t border-slate-200 pt-5">
      {/* Este título usa azul para dar ar corporativo moderno. */}
      <h3 className="break-words text-xs font-bold uppercase tracking-normal text-sky-700">
        {title}
      </h3>

      {/* Este bloco guarda o conteúdo da seção. */}
      <div className="mt-3 min-w-0 break-words text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

// Este componente mostra uma lista no template moderno.
function ModernList({ items, emptyText }: { items: string[]; emptyText: string }) {
  // Esta condição mostra orientação quando não há itens.
  if (items.length === 0) {
    // Este retorno evita inventar conteúdo quando o jovem não escreveu nada.
    return <ModernEmpty>{emptyText}</ModernEmpty>;
  }

  // Este retorno mostra itens reais em lista clara.
  return (
    <ul className="space-y-2">
      {/* Este mapa cria uma linha por item. */}
      {items.map((item) => (
        <li key={item} className="flex min-w-0 gap-2">
          {/* Este marcador usa a cor do template moderno. */}
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />

          {/* Este texto mostra o item real. */}
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Este componente mostra o currículo no modelo corporativo moderno.
export function ModernResumeTemplate({ resume }: ResumeTemplateProps) {
  // Esta constante mostra o nome real ou uma orientação.
  const displayedName = resume.name || "Nome a preencher";

  // Este retorno monta um currículo limpo com cabeçalho escuro e duas colunas.
  return (
    <article className="mx-auto min-h-[920px] w-full max-w-[820px] overflow-hidden rounded-lg bg-white text-slate-900 shadow-2xl shadow-slate-300/50">
      {/* Este cabeçalho cria impacto visual sem complicar a leitura. */}
      <header className="bg-slate-950 px-7 py-8 text-white sm:px-10">
        {/* Este nome fica grande no topo. */}
        <h2 className="break-words text-3xl font-bold leading-tight tracking-normal sm:text-5xl">
          {displayedName}
        </h2>

        {/* Este objetivo fica logo abaixo, em itálico como pedido. */}
        <p className="mt-3 break-words text-base italic text-sky-200 sm:text-lg">
          {resume.professionalObjective || "Objetivo profissional a preencher"}
        </p>
      </header>

      {/* Este bloco cria a divisão entre lateral e conteúdo principal. */}
      <div className="grid min-w-0 gap-8 p-5 sm:p-10 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        {/* Esta coluna menor concentra contato e habilidades. */}
        <aside className="min-w-0 rounded-lg bg-slate-50 p-4 sm:p-5">
          {/* Esta seção mostra dados pessoais. */}
          <ModernSection title="Contato">
            <dl className="space-y-3">
              <div>
                <dt className="font-bold text-slate-900">Telefone</dt>
                <dd className="break-words">{resume.phone || <ModernEmpty>A preencher</ModernEmpty>}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-900">E-mail</dt>
                <dd className="break-words">{resume.email || <ModernEmpty>A preencher</ModernEmpty>}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-900">Cidade</dt>
                <dd className="break-words">{resume.city || <ModernEmpty>A preencher</ModernEmpty>}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-900">Idade</dt>
                <dd className="break-words">{resume.age || <ModernEmpty>A preencher</ModernEmpty>}</dd>
              </div>
            </dl>
          </ModernSection>

          {/* Esta seção mostra habilidades. */}
          <ModernSection title="Habilidades">
            <ModernList items={resume.skills} emptyText="Cite suas habilidades." />
          </ModernSection>

          {/* Esta seção mostra cursos. */}
          <ModernSection title="Cursos">
            <ModernList items={resume.courses} emptyText="Cite cursos ou certificados." />
          </ModernSection>
        </aside>

        {/* Esta coluna maior mostra o conteúdo principal sem resumo descritivo. */}
        <main className="min-w-0">
          {/* Esta seção vem primeiro porque experiências são mais objetivas para RH. */}
          <ModernSection title="Experiências">
            <ModernList
              items={resume.experiences}
              emptyText="Cite trabalhos, ajudas, projetos ou experiências informais."
            />
          </ModernSection>

          <ModernSection title="Formação">
            {resume.education || <ModernEmpty>Informe sua formação.</ModernEmpty>}
          </ModernSection>

          <ModernSection title="Informações adicionais">
            <ModernList
              items={resume.additionalInfo}
              emptyText="Cite disponibilidade, CNH ou dados úteis."
            />
          </ModernSection>
        </main>
      </div>
    </article>
  );
}
