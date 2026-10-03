import type { Metadata } from "next";
import { BentoCard } from "@/components/marketing/shared/bento-card";
import { Container } from "@/components/marketing/shared/container";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { DashboardCard } from "@/components/marketing/shared/dashboard-card";
import { FAQAccordion } from "@/components/marketing/shared/faq-accordion";
import { GradientBorderCard } from "@/components/marketing/shared/gradient-border-card";
import { MetricCard } from "@/components/marketing/shared/metric-card";
import { ProofCard } from "@/components/marketing/shared/proof-card";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";

export const metadata: Metadata = {
  title: "Design foundation — Styleguide",
  robots: { index: false, follow: false },
};

const colors = [
  ["bg", "#FAFAF9"], ["surface", "#FFFFFF"], ["surface-muted", "#F4F4F2"],
  ["ink", "#0A0A0B"], ["ink-2", "#45454B"], ["ink-3", "#6B6B72"],
  ["line", "#E7E6E2"], ["line-strong", "#D4D3CE"],
  ["accent", "#2546F0"], ["accent-soft", "#E8ECFF"], ["accent-on-dark", "#9DB0FF"],
  ["positive", "#0E6B4D"], ["positive-soft", "#E3F4EC"],
  ["inverse", "#0A0A0B"], ["inverse-line", "#2A2A30"], ["inverse-ink-2", "#C9C9CE"],
] as const;
const typeScale = [
  ["sm", "0.875"], ["base", "1"], ["lg", "1.125"], ["xl", "1.5"],
  ["2xl", "2"], ["3xl", "3"], ["4xl", "4"], ["5xl", "5"],
] as const;
const variants = ["primary", "secondary", "outline", "ghost"] as const;
const sizes = ["sm", "md", "lg", "xl"] as const;

export default function StyleguidePage() {
  return (
    <>
      <Section>
        <Container>
          <Eyebrow>Taskcover / Sprint 01</Eyebrow>
          <h1 className="mt-5 max-w-4xl text-[clamp(40px,6vw,80px)] leading-[1.05] font-semibold tracking-tc-display">
            A clear foundation.
          </h1>
          <p className="mt-6 max-w-2xl text-tc-lg leading-relaxed text-tc-ink-2">
            Semantic color, considered typography, and flat surfaces. The shared
            vocabulary for the Taskcover marketing redesign.
          </p>
          <nav aria-label="Styleguide sections" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {["tokens", "type", "buttons", "cards", "faq", "sections"].map((id) => (
              <a key={id} href={`#${id}`} className="underline underline-offset-4">{id}</a>
            ))}
          </nav>
        </Container>
      </Section>

      <Section background="surface" id="tokens">
        <SectionHeader align="left" eyebrow="01 — COLOR" title="A role for every color." description="Use ink on light surfaces, white on accent, and the dedicated light text tokens on inverse surfaces." />
        <Container className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map(([name, hex]) => (
            <div key={name} className="overflow-hidden rounded-tc-lg border border-tc-line bg-tc-surface">
              <div aria-hidden="true" className="h-20 border-b border-tc-line" style={{ backgroundColor: `var(--tc-${name})` }} />
              <div className="p-4">
                <p className="break-all font-mono text-sm">--tc-{name}</p>
                <p className="mt-1 font-mono text-sm text-tc-ink-3">{hex}</p>
              </div>
            </div>
          ))}
        </Container>
        <Container className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-tc-lg bg-tc-accent-soft p-6 text-tc-accent">Accent on accent-soft</div>
          <div className="rounded-tc-lg bg-tc-positive-soft p-6 text-tc-positive">Positive on positive-soft</div>
          <div className="rounded-tc-lg border border-tc-inverse-line bg-tc-inverse p-6">
            <p className="text-tc-accent-on-dark">Accent on dark</p>
            <p className="mt-2 text-tc-inverse-ink-2">Secondary inverse text</p>
          </div>
        </Container>
      </Section>

      <Section id="type">
        <SectionHeader align="left" eyebrow="02 — THE SYSTEM" title="Geist. With room to breathe." description="Geist Sans for reading. Geist Mono for labels. Display tracking: −0.035em; section headings: −0.03em." />
        <Container className="mt-10">
          <div className="divide-y divide-tc-line">
            {typeScale.map(([name, rem]) => (
              <div key={name} className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5">
                <p style={{ fontSize: `var(--tc-type-${name})` }} className="leading-tight tracking-tc-display">Aa</p>
                <p className="font-mono text-sm text-tc-ink-2">--tc-type-{name} / {rem}rem</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[["sm", 8], ["md", 12], ["lg", 16], ["xl", 20]].map(([name, px]) => (
              <div key={name} className="border border-tc-line bg-tc-surface p-5" style={{ borderRadius: `var(--tc-radius-${name})` }}>
                <p className="font-mono text-sm">radius-{name}</p>
                <p className="mt-2 text-tc-ink-3">{px}px</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="surface" id="buttons">
        <SectionHeader align="left" eyebrow="03 — ACTIONS" title="One clear next step." description="Four variants in all four sizes. Every target is at least 44px tall. Tab to inspect the 2px accent focus outline." />
        <Container className="mt-10 space-y-6">
          {variants.map((variant) => (
            <div key={variant} className="rounded-tc-lg border border-tc-line p-6">
              <h3 className="mb-4 font-mono text-sm text-tc-ink-2">{variant}</h3>
              <div className="flex flex-wrap items-center gap-4">
                {sizes.map((size) => <CTAButton key={size} href="#buttons" variant={variant} size={size}>{variant} / {size}</CTAButton>)}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      <Section id="cards">
        <SectionHeader align="left" eyebrow="04 — SURFACES" title="Content takes the lead." description="A 1px line, a 16px radius, and no decorative shadows or gradients. All values below are illustrative UI samples, not client results." />
        <Container className="mt-10 space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Default / up" value="—" delta={{ value: "Sample improvement", trend: "up" }} footnote="No measured result" />
            <MetricCard label="Brand / down" value="—" tone="brand" delta={{ value: "Sample decline", trend: "down" }} footnote="No measured result" />
            <MetricCard label="Teal / flat" value="—" tone="teal" delta={{ value: "Sample unchanged", trend: "flat" }} footnote="Legacy tone name retained" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ProofCard eyebrow="Proof / with footer" footer="Illustrative content — not a testimonial">Evidence belongs beside the claim it supports.</ProofCard>
            <ProofCard>Proof / content only. No eyebrow or footer required.</ProofCard>
            <DashboardCard title="Dashboard / with header" subtitle="Optional subtitle and action" action={<CTAButton variant="ghost" size="sm" href="#cards">View</CTAButton>}>
              <p className="text-sm text-tc-ink-2">A flat surface for structured information.</p>
            </DashboardCard>
            <DashboardCard><p>Dashboard / content only.</p></DashboardCard>
            <GradientBorderCard>GradientBorderCard / legacy name, plain bordered surface.</GradientBorderCard>
          </div>
          <h3 className="text-tc-xl font-semibold">Bento tones and spans</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(["default", "tint", "soft"] as const).map((tone) => <BentoCard key={tone} tone={tone}><p className="font-mono text-sm">tone / {tone}</p></BentoCard>)}
          </div>
          <div className="grid auto-rows-[minmax(100px,auto)] gap-4 sm:grid-cols-4">
            {(["default", "wide", "tall", "feature"] as const).map((span) => <BentoCard key={span} span={span}><p className="font-mono text-sm">span / {span}</p></BentoCard>)}
          </div>
        </Container>
      </Section>

      <Section background="surface" id="faq">
        <SectionHeader align="left" eyebrow="05 — ANSWERS" title="Readable from the first response." description="Answers remain in the server-rendered HTML while collapsed. Open a question with a click, Enter, or Space." />
        <Container className="mt-10">
          <FAQAccordion items={[
            { q: "Are collapsed answers included in the HTML?", a: "Yes. Radix forceMount keeps this answer in the server HTML. CSS hides the closed panel without removing its content." },
            { q: "Does this component add structured data?", a: "No. The accordion does not emit schema. Existing page-level schema stays unchanged." },
            { q: "Can an answer include formatted content?", a: <p>Yes. Answers accept React content, including <strong>emphasis</strong> and <a href="#tokens" className="text-tc-accent underline underline-offset-4">useful links</a>.</p> },
          ]} />
        </Container>
      </Section>

      <div id="sections">
        {(["default", "surface", "inverse", "soft", "tint"] as const).map((background) => (
          <Section key={background} background={background}>
            <SectionHeader
              align={background === "inverse" ? "center" : "left"}
              eyebrow={`06 — ${background.toUpperCase()}`}
              title={`${background} section`}
              description="1200px container. 24px side padding, 16px below 400px. Vertical spacing: 64px on mobile, 96px on desktop."
            >
              <p className="font-mono text-sm" style={{ color: background === "inverse" ? "var(--tc-inverse-ink-2)" : "var(--tc-ink-3)" }}>
                {background === "soft" || background === "tint" ? "Legacy background prop retained." : "Semantic section background."}
              </p>
            </SectionHeader>
          </Section>
        ))}
      </div>
    </>
  );
}
