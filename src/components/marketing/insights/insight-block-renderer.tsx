import Link from "next/link";
import { ArrowRight, Check, Quote, Sparkles } from "lucide-react";
import type { InsightArticle, InsightBlock } from "@/content/insights.types";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import { buildImageSources } from "@/lib/insights/image";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/components/marketing/shared/cta-button";

export function getArticleToc(article: InsightArticle) {
  return article.blocks
    .filter((block): block is Extract<InsightBlock, { type: "heading" }> => block.type === "heading" && block.level === 2)
    .map((block) => ({
      id: block.id ?? slugify(block.text),
      text: block.text,
    }));
}

export function InsightBlockRenderer({ article, locale }: { article: InsightArticle; locale: Locale }) {
  // The first image is the likely LCP element and should load eagerly with high
  // priority; every later image stays lazy.
  const firstImageIndex = article.blocks.findIndex((block) => block.type === "image");
  return (
    <div className="flex flex-col gap-7">
      {article.blocks.map((block, index) => (
        <InsightBlockView key={`${block.type}-${index}`} block={block} locale={locale} priority={index === firstImageIndex} />
      ))}
    </div>
  );
}

function InsightBlockView({ block, locale, priority }: { block: InsightBlock; locale: Locale; priority?: boolean }) {
  const loc = (href: string) => (href.startsWith("/") ? localizePath(href, locale) : href);

  switch (block.type) {
    case "paragraph":
      return <p className="text-pretty text-base leading-8 text-secondary sm:text-lg">{block.text}</p>;
    case "heading": {
      const id = block.id ?? slugify(block.text);
      const Tag = block.level === 2 ? "h2" : block.level === 3 ? "h3" : "h4";
      return (
        <Tag id={id} className={cn("group scroll-mt-24 font-semibold tracking-tight text-graphite", block.level === 2 ? "text-3xl" : block.level === 3 ? "text-2xl" : "text-xl")}>
          <a href={`#${id}`} className="outline-none">
            {block.text}
            <span className="ml-2 text-brand-teal opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
              #
            </span>
          </a>
        </Tag>
      );
    }
    case "bullet-list":
      return (
        <ul className="flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-base leading-7 text-secondary">
              <Check className="mt-1 h-5 w-5 shrink-0 text-brand-green" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "numbered-list":
      return (
        <ol className="flex list-decimal flex-col gap-3 pl-5 text-base leading-7 text-secondary">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <figure className="rounded-2xl border-l-4 border-brand-teal bg-surface-tint p-5">
          <Quote className="mb-3 h-5 w-5 text-brand-teal" aria-hidden="true" />
          <blockquote className="text-lg font-medium leading-8 text-graphite">{block.quote}</blockquote>
          {block.attribution ? <figcaption className="mt-3 text-sm text-muted">{block.attribution}</figcaption> : null}
        </figure>
      );
    case "direct-answer":
      return (
        <section className="rounded-2xl border border-brand-teal/20 bg-brand-teal/[0.04] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{block.title}</p>
          <p className="mt-3 text-lg font-medium leading-8 text-graphite">{block.answer}</p>
        </section>
      );
    case "key-takeaways":
      return (
        <section className="rounded-2xl border border-line bg-white p-5 depth-layered">
          <p className="text-sm font-semibold text-graphite">{block.title}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {block.items.map((item) => (
              <li key={item} className="flex gap-3 rounded-xl bg-surface-tint p-3 text-sm leading-6 text-secondary">
                <Sparkles className="mt-1 h-4 w-4 shrink-0 text-brand-teal" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    case "definition":
      return (
        <section className="rounded-2xl border border-line bg-surface-soft p-5">
          <h3 className="text-lg font-semibold text-graphite">{block.term}</h3>
          <p className="mt-2 text-base leading-7 text-secondary">{block.definition}</p>
        </section>
      );
    case "callout":
      return (
        <section className={cn("rounded-2xl border p-5", block.tone === "amber" ? "border-amber-200 bg-amber-50/70" : "border-brand-teal/20 bg-surface-tint")}>
          <h3 className="text-base font-semibold text-graphite">{block.title}</h3>
          <p className="mt-2 text-sm leading-7 text-secondary">{block.body}</p>
        </section>
      );
    case "comparison-table":
      return (
        <figure className="max-w-full overflow-hidden rounded-2xl border border-line bg-white">
          <figcaption className="border-b border-line bg-surface-tint px-4 py-3 text-sm font-semibold text-graphite">
            {block.caption}
          </figcaption>
          <div className="max-w-full overflow-x-auto">
            <table className="w-max min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-surface-soft text-xs uppercase tracking-wide text-muted">
                <tr>
                  {block.columns.map((column) => (
                    <th key={column} scope="col" className="px-4 py-3 font-semibold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {block.rows.map((row, rowIndex) => (
                  <tr key={row.join("-")} className={rowIndex % 2 === 0 ? "bg-white" : "bg-surface-soft/60"}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`} className="px-4 py-3 leading-6 text-secondary">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    case "checklist":
      return (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-lg font-semibold text-graphite">{block.title}</h3>
          <ul className="mt-4 grid gap-3">
            {block.items.map((item) => (
              <li key={item.label} className="grid gap-1 rounded-xl bg-surface-soft p-4 sm:grid-cols-[13rem_1fr]">
                <span className="font-semibold text-graphite">{item.label}</span>
                <span className="text-sm leading-6 text-secondary">{item.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    case "steps":
      return (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-lg font-semibold text-graphite">{block.title}</h3>
          <ol className="mt-5 flex flex-col gap-4">
            {block.steps.map((step, index) => (
              <li key={step.title} className="grid gap-3 sm:grid-cols-[3rem_1fr]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span>
                  <strong className="block text-base text-graphite">{step.title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-secondary">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      );
    case "evidence":
      return (
        <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <p className="text-sm leading-7 text-secondary">{block.summary}</p>
        </section>
      );
    case "expert-insight":
      return (
        <section className="rounded-2xl border border-line bg-surface-tint p-5">
          <h3 className="text-lg font-semibold text-graphite">{block.title}</h3>
          <p className="mt-2 text-sm leading-7 text-secondary">{block.body}</p>
        </section>
      );
    case "faq":
      return (
        <section className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-col gap-3">
            {block.items.map((item) => (
              <details key={item.question} className="rounded-xl bg-surface-soft p-4">
                <summary className="cursor-pointer text-sm font-semibold text-graphite">{item.question}</summary>
                <p className="mt-2 text-sm leading-6 text-secondary">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      );
    case "pros-cons":
      return (
        <section className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2">
          <h3 className="sm:col-span-2 text-lg font-semibold text-graphite">{block.title}</h3>
          <List title="Pros" items={block.pros} />
          <List title="Cons" items={block.cons} />
        </section>
      );
    case "decision-framework":
      return (
        <section className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-lg font-semibold text-graphite">{block.title}</h3>
          <div className="mt-4 grid gap-3">
            {block.criteria.map((item) => (
              <div key={item.signal} className="grid gap-2 rounded-xl bg-surface-tint p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <p className="text-sm text-secondary">{item.signal}</p>
                <ArrowRight className="hidden h-4 w-4 text-brand-teal sm:block" aria-hidden="true" />
                <p className="text-sm font-medium text-graphite">{item.action}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case "case-study-reference":
    case "sample-audit-reference":
    case "related-service":
      return (
        <Link href={loc(block.href)} className="card-lift group rounded-2xl border border-line bg-white p-5 hover:border-brand-teal/40">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
            {block.type.replaceAll("-", " ")}
          </span>
          <h3 className="mt-2 text-lg font-semibold text-graphite">{block.title}</h3>
          <p className="mt-2 text-sm leading-6 text-secondary">{block.summary}</p>
          <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-brand-teal transition-colors group-hover:border-brand-teal/40" aria-hidden="true">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      );
    case "cta":
      return (
        <section className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 depth-layered">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-brand-gradient-soft blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <h3 className="text-2xl font-semibold tracking-tight text-graphite">{block.title}</h3>
            <p className="max-w-2xl text-sm leading-7 text-secondary">{block.body}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href={loc(block.primary.href)}>{block.primary.label}</CTAButton>
              {block.secondary ? (
                <CTAButton href={loc(block.secondary.href)} variant="secondary">
                  {block.secondary.label}
                </CTAButton>
              ) : null}
            </div>
          </div>
        </section>
      );
    case "statistic":
      return (
        <section className="rounded-2xl border border-line bg-white p-5 text-center">
          <p className="text-4xl font-semibold tracking-tight text-brand-teal">{block.value}</p>
          <p className="mt-2 text-sm font-medium text-graphite">{block.label}</p>
          {block.note ? <p className="mt-1 text-xs text-muted">{block.note}</p> : null}
        </section>
      );
    case "code":
      return (
        <pre className="max-w-full overflow-x-auto rounded-2xl border border-line bg-graphite p-5 text-sm leading-6 text-white">
          <code>{block.code}</code>
        </pre>
      );
    case "image": {
      const sources = buildImageSources(block.src);
      return (
        <figure className="overflow-hidden rounded-2xl border border-line bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sources.fallbackSrc}
            srcSet={sources.srcSet}
            sizes={sources.sizes}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            className="h-auto w-full"
          />
          {block.caption || block.credit ? (
            <figcaption className="border-t border-line px-4 py-3 text-xs text-muted">
              {block.caption}
              {block.credit ? <span className="ml-2 text-muted">({block.credit})</span> : null}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "divider":
      return <hr className="border-line" />;
    default:
      return null;
  }
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-graphite">{title}</h4>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-secondary">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
