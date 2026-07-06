import Link from "next/link";
import { ArrowRight, BookOpen, Clock, ExternalLink, Layers, Map, Network, Route, Search, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import type { InsightArticle, InsightCategoryContent, InsightsContent } from "@/content/insights.types";
import { insightCategorySlugs } from "@/content/insights.types";
import { getInsightsContent, getPublishedInsights } from "@/lib/insights/content";
import { getInsightPath } from "@/lib/insights/seo";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { Eyebrow, SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { InsightsClientFilter, type InsightFilterItem } from "./insights-client-filter";
import { getArticleToc, InsightBlockRenderer } from "./insight-block-renderer";
import { cn } from "@/lib/utils";

export async function InsightsHubView({ locale }: { locale: Locale }) {
  const content = getInsightsContent(locale);
  const articles = await getPublishedInsights(locale);
  const featured = articles[0];
  const filterItems = articles.map((article) => toFilterItem(article, content, locale));
  const categories = insightCategorySlugs.map((slug) => ({
    slug,
    label: content.categories[slug].label,
  }));
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <Eyebrow>{content.hub.eyebrow}</Eyebrow>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {content.hub.h1}
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-secondary">{content.hub.description}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href={loc("/free-seo-audit")}>{content.hub.cta.primary.label}</CTAButton>
              <CTAButton href={loc("/book-a-call")} variant="secondary">
                {content.hub.cta.secondary.label}
              </CTAButton>
            </div>
          </div>
          <EditorialMap articles={articles} content={content} locale={locale} />
        </Container>
      </Section>

      <Section background="default" aria-labelledby="featured-insight">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-4">
            <Eyebrow>{content.ui.featured}</Eyebrow>
            <h2 id="featured-insight" className="text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
              {content.hub.featuredTitle}
            </h2>
            <p className="text-secondary">{featured.excerpt}</p>
          </div>
          <ArticleDossier article={featured} content={content} locale={locale} large />
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="category-navigation">
        <Container className="flex flex-col gap-8">
          <SectionHeader
            align="left"
            eyebrow={content.ui.allCategories}
            titleId="category-navigation"
            title={content.hub.topicMapTitle}
            description={content.hub.topicMapDescription}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {insightCategorySlugs.map((slug) => (
              <CategoryTile key={slug} category={content.categories[slug]} locale={locale} />
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="latest-insights">
        <Container className="flex flex-col gap-8">
          <SectionHeader align="left" eyebrow={content.ui.latest} titleId="latest-insights" title={content.ui.latest} />
          <InsightsClientFilter
            items={filterItems}
            categories={categories}
            ui={{
              searchPlaceholder: content.ui.searchPlaceholder,
              filterByCategory: content.ui.filterByCategory,
              filterByTopic: content.ui.filterByTopic,
              filterByService: content.ui.filterByService,
              allCategories: content.ui.allCategories,
              noResults: content.ui.noResults,
              readArticle: content.ui.readArticle,
              minutes: content.ui.minutes,
            }}
          />
        </Container>
      </Section>

      <Section background="tint" aria-labelledby="reading-paths">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-4">
            <Eyebrow>{content.ui.recommendedPaths}</Eyebrow>
            <h2 id="reading-paths" className="text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
              {content.hub.pathsTitle}
            </h2>
          </div>
          <div className="grid gap-4">
            {content.hub.paths.map((path) => (
              <Link key={path.href} href={loc(path.href)} className="card-lift group rounded-2xl border border-line bg-white p-5 hover:border-brand-teal/40">
                <h3 className="text-lg font-semibold text-graphite">{path.title}</h3>
                <p className="mt-2 text-sm leading-6 text-secondary">{path.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal">
                  {content.ui.readMore}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <InsightsCta content={content} locale={locale} />
    </>
  );
}

export function InsightCategoryView({
  locale,
  category,
  articles,
}: {
  locale: Locale;
  category: InsightCategoryContent;
  articles: InsightArticle[];
}) {
  const content = getInsightsContent(locale);
  const allArticles = articles;
  const fallbackArticles = category.curatedArticleSlugs
    .map((slug) => allArticles.find((article) => article.slug === slug))
    .filter((article): article is InsightArticle => Boolean(article));
  const categoryArticles = articles.length > 0 ? articles : fallbackArticles;
  const featured = categoryArticles[0];
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <Breadcrumb locale={locale} content={content} items={[{ label: content.ui.insights, href: "/insights" }, { label: category.label }]} />
            <Eyebrow>{category.eyebrow}</Eyebrow>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl">
              {category.h1}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-secondary">{category.description}</p>
          </div>
          <CategoryVisual variant={category.visualVariant} title={category.label} />
        </Container>
      </Section>

      <Section background="default">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-line bg-surface-soft p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{content.ui.categoryContext}</p>
            <p className="mt-3 text-base leading-7 text-secondary">{category.context}</p>
          </div>
          {featured ? <ArticleDossier article={featured} content={content} locale={locale} /> : null}
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="category-index">
        <Container className="flex flex-col gap-8">
          <SectionHeader align="left" eyebrow={content.ui.latest} titleId="category-index" title={category.label} />
          <div className="grid gap-4 lg:grid-cols-3">
            {categoryArticles.map((article) => (
              <ArticleDossier key={article.slug} article={article} content={content} locale={locale} />
            ))}
          </div>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="topic-cluster">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>{content.ui.topicCluster}</Eyebrow>
            <h2 id="topic-cluster" className="mt-4 text-3xl font-semibold tracking-tight text-graphite">
              {category.label}
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {categoryArticles.flatMap((article) => article.tags).slice(0, 12).map((tag, index) => (
                <span key={`${tag}-${index}`} className="rounded-full border border-line bg-surface-tint px-3 py-1.5 text-xs font-medium text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <LinkList title={content.ui.relatedServices} links={category.relatedServices} locale={locale} />
            <LinkList title={content.ui.categoryContext} links={[...category.relatedIndustries, ...category.relatedMarkets]} locale={locale} />
          </div>
        </Container>
      </Section>

      <Section background="tint">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-8 depth-layered">
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-graphite">{category.cta.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">{category.cta.body}</p>
              </div>
              <CTAButton href={loc(category.cta.primary.href)}>{category.cta.primary.label}</CTAButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export function InsightArticleView({
  article,
  related,
  locale,
}: {
  article: InsightArticle;
  related: InsightArticle[];
  locale: Locale;
}) {
  const content = getInsightsContent(locale);
  const category = content.categories[article.category];
  const toc = getArticleToc(article);
  const loc = (path: string) => localizePath(path, locale);

  return (
    <>
      <Section as="article" background="tint" className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <Container className="relative grid min-w-0 gap-10 lg:grid-cols-[1fr_0.85fr]">
          <div className="flex min-w-0 flex-col gap-5">
            <Breadcrumb
              locale={locale}
              content={content}
              items={[
                { label: content.ui.insights, href: "/insights" },
                { label: category.label, href: `/insights/${category.slug}` },
                { label: article.metadata.breadcrumbLabel },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2">
              <Link href={loc(`/insights/${category.slug}`)} className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
                {category.label}
              </Link>
              <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
                {article.readingTime} {content.ui.minutes}
              </span>
            </div>
            <h1 className="max-w-4xl break-words text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {article.h1}
            </h1>
            <p className="max-w-3xl text-pretty text-lg leading-8 text-secondary">{article.excerpt}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span>{article.author}</span>
              <span>{content.ui.published}: {formatDate(article.publishedAt, locale)}</span>
              <span>{content.ui.updated}: {formatDate(article.updatedAt, locale)}</span>
            </div>
          </div>
          <figure className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-line bg-white p-5 depth-layered">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.coverImage} alt={article.coverImageAlt} className="h-auto w-full min-w-0 rounded-2xl border border-line bg-surface-soft" />
            <figcaption className="mt-3 text-center text-xs leading-5 text-muted">{article.coverImageCaption}</figcaption>
          </figure>
        </Container>
      </Section>

      <Section background="default" className="py-12 sm:py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)_19rem] xl:grid-cols-[16rem_minmax(0,48rem)_20rem]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-line bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{content.ui.tableOfContents}</p>
              <nav className="mt-4" aria-label={content.ui.tableOfContents}>
                <ol className="flex flex-col gap-2">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="block rounded-lg px-2 py-2 text-sm leading-5 text-secondary hover:bg-surface-tint hover:text-brand-teal">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-8 rounded-2xl border border-line bg-white p-4 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{content.ui.tableOfContents}</p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="min-h-11 shrink-0 rounded-full border border-line bg-surface-tint px-3 py-2 text-sm text-secondary">
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
            <div className="mb-8 lg:hidden">
              <ArticleConversionRail article={article} content={content} locale={locale} compact />
            </div>
            <InsightBlockRenderer article={article} locale={locale} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ArticleConversionRail article={article} content={content} locale={locale} />
            </div>
          </aside>
        </Container>
      </Section>

      <Section background="soft" aria-labelledby="sources">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>{content.ui.sources}</Eyebrow>
            <h2 id="sources" className="mt-4 text-3xl font-semibold tracking-tight text-graphite">
              {content.ui.evidence}
            </h2>
          </div>
          <ol className="grid gap-3">
            {article.contentEvidence.sources.map((source) => (
              <li key={source.id} className="rounded-2xl border border-line bg-white p-4">
                <a href={source.url} rel="nofollow noopener" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal">
                  {source.title}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <p className="mt-1 text-xs text-muted">
                  {source.publisher} · {content.ui.accessed}: {formatDate(source.accessedAt, locale)}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section background="default" aria-labelledby="related-articles">
        <Container className="flex flex-col gap-8">
          <SectionHeader align="left" eyebrow={content.ui.relatedArticles} titleId="related-articles" title={content.ui.relatedArticles} />
          <div className="grid gap-4 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleDossier key={item.slug} article={item} content={content} locale={locale} />
            ))}
          </div>
        </Container>
      </Section>

      <InsightsCta content={content} locale={locale} />
    </>
  );
}

function EditorialMap({ articles, content, locale }: { articles: InsightArticle[]; content: InsightsContent; locale: Locale }) {
  const icons = [Search, Sparkles, Layers, Network, Map, Route];
  const loc = (path: string) => localizePath(path, locale);
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-70 blur-2xl" />
      <div className="relative rounded-3xl border border-line bg-white p-5 depth-layered">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{content.ui.searchGrowthMap}</p>
        <div className="mt-5 grid gap-3">
          {articles.slice(0, 6).map((article, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Link key={article.slug} href={loc(getInsightPath(article))} className="group flex items-center gap-3 rounded-2xl border border-line bg-surface-soft p-3 hover:border-brand-teal/40">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-graphite">{article.h1}</span>
                  <span className="block text-xs text-muted">{content.categories[article.category].label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CategoryVisual({ variant, title }: { variant: InsightCategoryContent["visualVariant"]; title: string }) {
  const widthsByVariant: Record<typeof variant, string[]> = {
    guide: ["86%", "64%", "78%", "92%"],
    ai: ["72%", "88%", "58%", "80%"],
    technical: ["90%", "68%", "84%", "62%"],
    authority: ["76%", "92%", "66%", "82%"],
    international: ["70%", "84%", "60%", "90%"],
    ppc: ["92%", "58%", "80%", "66%"],
    mentor: ["68%", "86%", "74%", "90%"],
  };
  const widths = widthsByVariant[variant];
  return (
    <div className="rounded-3xl border border-line bg-white p-5 depth-layered" aria-label={title}>
      <div className="grid grid-cols-2 gap-3">
        {widths.map((width, index) => (
          <div key={`${variant}-${index}`} className={cn("rounded-2xl border border-line p-4", index === 0 ? "bg-brand-gradient text-white" : "bg-surface-soft text-secondary")}>
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] opacity-80">{String(index + 1).padStart(2, "0")}</span>
            <span className="mt-8 block h-2 rounded-full bg-current opacity-35" style={{ width }} aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticleDossier({
  article,
  content,
  locale,
  large = false,
}: {
  article: InsightArticle;
  content: InsightsContent;
  locale: Locale;
  large?: boolean;
}) {
  const href = localizePath(getInsightPath(article), locale);
  return (
    <Link href={href} className={cn("card-lift group flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 hover:border-brand-teal/40", large && "p-7")}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
          {content.categories[article.category].label}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {article.readingTime} {content.ui.minutes}
        </span>
      </div>
      <h3 className={cn("font-semibold tracking-tight text-graphite", large ? "text-3xl" : "text-xl")}>{article.h1}</h3>
      <p className="text-sm leading-6 text-secondary">{article.excerpt}</p>
      <div className="mt-auto flex flex-wrap gap-2">
        {article.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-line bg-surface-tint px-2.5 py-1 text-[11px] font-medium text-secondary">
            {tag}
          </span>
        ))}
      </div>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal">
        {content.ui.readArticle}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function CategoryTile({ category, locale }: { category: InsightCategoryContent; locale: Locale }) {
  return (
    <Link href={localizePath(`/insights/${category.slug}`, locale)} className="card-lift group rounded-2xl border border-line bg-white p-5 hover:border-brand-teal/40">
      <div className="flex items-center justify-between gap-4">
        <BookOpen className="h-5 w-5 text-brand-teal" aria-hidden="true" />
        <ArrowRight className="h-4 w-4 text-brand-teal transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-graphite">{category.label}</h3>
      <p className="mt-2 text-sm leading-6 text-secondary">{category.description}</p>
    </Link>
  );
}

function Breadcrumb({
  locale,
  content,
  items,
}: {
  locale: Locale;
  content: InsightsContent;
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href={localizePath("/", locale)} className="hover:text-brand-teal">
            {content.ui.home}
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true">/</span>
              {item.href && !isLast ? (
                <Link href={localizePath(item.href, locale)} className="hover:text-brand-teal">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ArticleConversionRail({
  article,
  content,
  locale,
  compact = false,
}: {
  article: InsightArticle;
  content: InsightsContent;
  locale: Locale;
  compact?: boolean;
}) {
  const category = content.categories[article.category];
  const service = article.internalLinking.serviceLinks[0] ?? category.relatedServices[0];
  const sample = article.internalLinking.sampleAuditLinks[0];
  const cards: { eyebrow: string; title: string; href: string; body?: string }[] = [];
  if (service) {
    cards.push({ eyebrow: content.ui.relatedServices, title: service.label, href: service.href, body: service.note });
  }
  if (sample) {
    cards.push({ eyebrow: content.ui.relatedSample, title: sample.label, href: sample.href, body: sample.note });
  }

  return (
    <div className={cn("grid gap-4", compact && "sm:grid-cols-2")}>
      <div className={cn("relative overflow-hidden rounded-2xl border border-line bg-white p-5 depth-layered", compact && "sm:col-span-2")}>
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-gradient-soft blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{content.ui.finalCta}</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-graphite">{content.hub.cta.primary.label}</h2>
          <p className="mt-2 text-sm leading-6 text-secondary">{content.hub.cta.body}</p>
          <Link
            href={localizePath(content.hub.cta.primary.href, locale)}
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-gradient px-4 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
          >
            {content.ui.startFreeAudit}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {cards.slice(0, 2).map((card) => (
        <Link
          key={`${card.eyebrow}-${card.href}`}
          href={localizePath(card.href, locale)}
          className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal/35"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{card.eyebrow}</p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-graphite group-hover:text-brand-teal">{card.title}</h3>
          {card.body ? <p className="mt-2 text-sm leading-6 text-secondary">{card.body}</p> : null}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-teal">
            {content.ui.readMore}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
      ))}
    </div>
  );
}

function LinkList({ title, links, locale }: { title: string; links: { label: string; href: string }[]; locale: Locale }) {
  if (links.length === 0) return null;
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{title}</p>
      <ul className="mt-4 flex flex-col gap-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={localizePath(link.href, locale)} className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-brand-teal">
              {link.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightsCta({ content, locale }: { content: InsightsContent; locale: Locale }) {
  return (
    <Section background="tint">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-white p-8 depth-layered">
          <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-graphite">{content.hub.cta.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">{content.hub.cta.body}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href={localizePath(content.hub.cta.primary.href, locale)}>{content.hub.cta.primary.label}</CTAButton>
              <CTAButton href={localizePath(content.hub.cta.secondary.href, locale)} variant="secondary">
                {content.hub.cta.secondary.label}
              </CTAButton>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function toFilterItem(article: InsightArticle, content: InsightsContent, locale: Locale): InsightFilterItem {
  return {
    slug: article.slug,
    href: localizePath(getInsightPath(article), locale),
    title: article.h1,
    excerpt: article.excerpt,
    category: article.category,
    categoryLabel: content.categories[article.category].label,
    tags: article.tags,
    services: article.internalLinking.serviceLinks.map((link) => link.label),
    readingTime: article.readingTime,
  };
}

function formatDate(value: string, locale: Locale) {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    fr: "fr-CA",
    es: "es-US",
  };
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}
