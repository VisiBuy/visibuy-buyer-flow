import { Button } from "@/shared/components/ui/button";

export function HomeHero() {
  return (
    <section className="visibuy-container flex flex-1 flex-col items-start justify-center gap-8 py-16">
      <div className="inline-flex rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary">
        Visibuy Design System · App Router · Feature Architecture
      </div>

      <div className="space-y-6">
        <h1 className="max-w-3xl font-heading text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Build commerce experiences with{" "}
          <span className="text-brand-primary">clarity and speed</span>.
        </h1>
        <p className="max-w-2xl text-sm text-neutral-700 sm:text-base">
          This starter wires Next.js, Tailwind CSS, shadcn-style components,
          Zod, and a feature-based architecture so you can focus on shipping the
          Visibuy product, not boilerplate.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg">Primary action</Button>
        <Button variant="secondary" size="lg">
          Secondary action
        </Button>
      </div>
    </section>
  );
}
