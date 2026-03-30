import { GridCard, Hero, PageShell } from "@/components/shared/section";
import { homeEntryCards } from "@/lib/data";

export default function HomePage() {
  return (
    <PageShell>
      <div className="grid gap-6">
        <Hero />
        <section className="grid gap-5 md:grid-cols-3">
          {homeEntryCards.map((item) => (
            <GridCard key={item.href} title={item.title} description={item.description} meta="主入口" href={item.href} />
          ))}
        </section>
      </div>
    </PageShell>
  );
}
