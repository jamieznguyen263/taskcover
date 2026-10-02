"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Pause, Play } from "lucide-react";
import clients from "@/content/en/home-client-context.json";
import { getClientLogoAsset } from "@/content/client-logo-assets";
import { DetailDialog } from "./detail-dialog";

type ClientKey = keyof typeof clients;
type CaseView = "scope" | "priorities" | "ai";
type Modal = { kind: "client"; key: ClientKey } | { kind: "priority"; high: boolean } | { kind: "video" } | { kind: "scope" } | null;
const videoURL = "https://customer-0tesip1ipnusoino.cloudflarestream.com/e79aaa106884ac0987ade3e89e22bfba/iframe?controls=true&preload=metadata";
const caseTabs: { id: CaseView; label: string }[] = [
  { id: "scope", label: "Understand the landscape" },
  { id: "priorities", label: "Focus the work" },
  { id: "ai", label: "Explore AI visibility" },
];
const clientMeta: { id: ClientKey; name: string; label: string; href?: string }[] = [
  { id: "british", name: "British Council", label: "Search strategy · AI visibility" },
  { id: "sky", name: "Skyscanner", label: "Search intelligence · Technical SEO" },
  { id: "agoda", name: "Agoda", label: "Travel · Search consulting", href: "/work/case-studies/agoda" },
  { id: "ccleaner", name: "CCleaner", label: "Software · Search consulting", href: "/work/case-studies/ccleaner" },
  { id: "fwd", name: "FWD", label: "Insurance · Search consulting", href: "/work/case-studies/fwd-insurance" },
  { id: "buv", name: "BUV", label: "Education · Search consulting", href: "/work/case-studies/british-university-vietnam" },
  { id: "nova", name: "NovaWorld", label: "Property · Search consulting", href: "/work/case-studies/novaworld" },
];
const clientLogoIds: Record<ClientKey, string> = {
  british: "british-council", sky: "skyscanner", agoda: "agoda", ccleaner: "ccleaner",
  fwd: "fwd-insurance", buv: "buv", nova: "novaworld",
};
function ClientMark({ id, name, label }: typeof clientMeta[number]) {
  const asset = getClientLogoAsset(clientLogoIds[id]);
  return <>
    {asset?.publicUsage && asset.logoPath && asset.width && asset.height
      ? <span className={"client-logo-mark client-logo-" + id + " " + (asset.preferredBackground === "light" ? "client-logo-light" : "client-logo-dark")}>
        <Image src={asset.logoPath} alt="" width={asset.width} height={asset.height} sizes="244px" />
      </span>
      : <span className="client-logo-fallback">{name}</span>}
    <span className="client-name">{name}</span><span className="client-context">{label}</span>
  </>;
}

export function HomeEvidence() {
  const [paused, setPaused] = useState(false);
  const [caseView, setCaseView] = useState<CaseView>("priorities");
  const [audience, setAudience] = useState<"b2c" | "b2b">("b2c");
  const [modal, setModal] = useState<Modal>(null);
  const tabs = useRef<Partial<Record<CaseView, HTMLButtonElement | null>>>({});
  const caseSection = useRef<HTMLElement>(null);
  function focusCase(view: CaseView) {
    setCaseView(view);
    tabs.current[view]?.focus({ preventScroll: true });
  }
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : -1;
    if (next < 0) return;
    event.preventDefault(); focusCase(caseTabs[next].id);
  }
  function openClient(id: ClientKey) {
    if (id === "british") {
      caseSection.current?.scrollIntoView({ block: "start" });
      focusCase("priorities");
    } else setModal({ kind: "client", key: id });
  }
  const client = modal?.kind === "client" ? clients[modal.key] : null;
  const clientHref = modal?.kind === "client" ? clientMeta.find((item) => item.id === modal.key)?.href : undefined;

  return <>
    <section className="client-section continuation-section" id="selected-work" aria-labelledby="client-title">
      <div className="section-lead">
        <div><p className="eyebrow">Selected client work</p><h2 id="client-title">Different markets.<br />The same depth of thinking.</h2></div>
        <div className="section-side"><p>Travel, education, software and beyond. Explore the work behind the names.</p>
          <button className="quiet-control" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}{paused ? "Resume movement" : "Pause movement"}</button>
        </div>
      </div>
      <div className={"client-marquee" + (paused ? " is-paused" : "")}>
        <div className="client-track">
          <div className="client-group">{clientMeta.map((item) => <button key={item.id} onClick={() => openClient(item.id)} aria-label={item.name + ": " + item.label}><ClientMark {...item} /></button>)}</div>
          <div className="client-group client-repeat" aria-hidden="true" inert>{clientMeta.map((item) => <button key={item.id} tabIndex={-1}><ClientMark {...item} /></button>)}</div>
        </div>
      </div>
      <p className="client-caption">Work delivered under Taskcover. Select a name to explore the available project context.</p>
    </section>
    <section className="video-section continuation-section" aria-labelledby="video-title">
      <div className="video-intro"><p className="eyebrow">Meet Taskcover</p><h2 id="video-title">Before the first call,<br />meet the people behind the work.</h2><p>A short introduction to Taskcover, in our own words.</p></div>
      <button className="video-poster" aria-label="Play the Taskcover introduction video" onClick={() => setModal({ kind: "video" })}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/decision-studio/introduction.jpg" alt="John Edward introducing Taskcover in the homepage video" width={1280} height={720} loading="lazy" />
        <span className="video-play-label"><Play aria-hidden="true" />Watch the introduction</span><span className="video-corner" aria-hidden="true">TASKCOVER / INTRODUCTION</span>
      </button>
      <div className="video-caption"><span>Perspective first. Then a conversation about your business.</span><Link className="text-button" href="/contact">Tell us what you’re working on <ArrowRight aria-hidden="true" /></Link></div>
    </section>
    <section className="case-section continuation-section" id="british-council" ref={caseSection} aria-labelledby="case-title">
      <div className="case-masthead"><p className="eyebrow">Inside the work / British Council</p><span>Search strategy & AI visibility</span></div>
      <div className="section-lead"><div><h2 id="case-title">The next move should<br />be easier to see.</h2></div><div className="section-side"><p>A large search analysis became a focused set of priorities. Explore the scale, the decisions, and the next layer of visibility.</p></div></div>
      <div className="case-tabs" role="tablist" aria-label="Explore British Council work">
        {caseTabs.map((tab, i) => <button key={tab.id} ref={(element) => { tabs.current[tab.id] = element; }} id={"case-tab-" + tab.id} role="tab"
          aria-selected={caseView === tab.id} aria-controls={"case-panel-" + tab.id} tabIndex={caseView === tab.id ? 0 : -1}
          onClick={() => setCaseView(tab.id)} onKeyDown={(event) => navigateTabs(event, i)}>0{i + 1} <span>{tab.label}</span></button>)}
      </div>
      <div id="case-panel-priorities" className="case-panel" role="tabpanel" tabIndex={0} aria-labelledby="case-tab-priorities" hidden={caseView !== "priorities"}>
        <div className="priority-overview">
          <div><p className="case-stat-label">The opportunity landscape</p><div className="case-big-number">989</div><p className="case-number-caption">identified opportunities</p></div>
          <div><p className="case-stat-label">The selected priority groups</p><div className="case-big-number emphasis">58</div><p className="case-number-caption">clear priorities</p>
            <div className="priority-breakdown" role="img" aria-label="Of 58 priorities, 32 were high priority and 26 were medium priority"><span /><span /></div>
            <div className="priority-legend"><button onClick={() => setModal({ kind: "priority", high: true })}><strong>32</strong><span>High priority · Explore</span></button><button onClick={() => setModal({ kind: "priority", high: false })}><strong>26</strong><span>Medium priority · Explore</span></button></div>
          </div>
        </div>
        <p className="case-context">The useful output of a large analysis is a more focused conversation about what deserves attention. These two priority groups turn a broad opportunity landscape into a defined set of actions.</p>
        <p className="case-footnote">Prioritisation output, not a count of completed fixes or a claim of traffic growth. The bar shows the composition of the 58 priorities.</p>
      </div>
      <div id="case-panel-scope" className="case-panel" role="tabpanel" tabIndex={0} aria-labelledby="case-tab-scope" hidden={caseView !== "scope"}>
        <div className="scope-layout">
          <div className="scope-metrics">{[["21,323", "query–page relationships analysed"], ["995", "URLs in the analysis"], ["1.66M", "impressions represented"], ["10,277", "clicks represented"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
          <div className="scope-note"><h3>Understand the landscape before choosing the next move.</h3><p>Query–page analysis connects what people search for with the pages that appear. The scale here describes the evidence reviewed—not growth created by the project.</p><button className="text-button" onClick={() => focusCase("priorities")}>See the priority output <ArrowRight aria-hidden="true" /></button></div>
        </div><p className="case-footnote">Scope and figures supplied for this Taskcover engagement. No measurement period has been added.</p>
      </div>
      <div id="case-panel-ai" className="case-panel" role="tabpanel" tabIndex={0} aria-labelledby="case-tab-ai" hidden={caseView !== "ai"}>
        <div className="ai-layout">
          <div><p className="case-stat-label">AI visibility framework</p><div className="case-big-number">288</div><p className="case-number-caption">prompts across B2C and B2B journeys</p><p className="case-footnote">A measurement framework—not 288 earned mentions, citations, or recommendations.</p></div>
          <div className="ai-note">
            <div className="audience-toggle" role="group" aria-label="Explore the meaning of each journey"><button aria-pressed={audience === "b2c"} onClick={() => setAudience("b2c")}>B2C journeys</button><button aria-pressed={audience === "b2b"} onClick={() => setAudience("b2b")}>B2B journeys</button></div>
            <div aria-live="polite"><h3>{audience === "b2c" ? "Follow an individual’s decision." : "Follow an organisation’s evaluation."}</h3><p>{audience === "b2c" ? "A consumer may move from understanding a need to comparing options and choosing a provider. An audience-aware framework can examine those different moments." : "A business may move from defining a problem to comparing suppliers and building confidence across a buying team. An audience-aware framework can examine those different questions."}</p><p className="form-note">This explains how journey-based measurement can be applied. The underlying client prompt list and the split of the 288 prompts have not been reproduced.</p></div>
          </div>
        </div>
      </div>
      <div className="case-credit"><p>Delivered by Taskcover.<br />SEO consulting led by Jamiez Nguyen.</p><button className="text-button" onClick={() => setModal({ kind: "scope" })}>Read the project scope <ArrowRight aria-hidden="true" /></button></div>
    </section>
    {modal && <DetailDialog video={modal.kind === "video"} onClose={() => setModal(null)}>
      {modal.kind === "video" ? <>
        <p className="dialog-eyebrow">Meet Taskcover</p><h2 id="dialog-title">Before the first call.</h2>
        <iframe className="video-frame" title="Taskcover introduction video" src={videoURL + "&autoplay=true"} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        <p>Playback requires an internet connection.</p><a className="external-video-link" href={videoURL} target="_blank" rel="noopener noreferrer">Open the video directly <ExternalLink aria-hidden="true" /></a>
      </> : modal.kind === "client" && client ? <>
        <p className="dialog-eyebrow">Selected client work</p><h2 id="dialog-title">{client.name}</h2><p>{client.context}</p>
        <div className="detail-block"><h3>Project context</h3><p>{client.body}</p></div>
        {modal.key === "sky" && <p className="form-note">Portfolio figures describe the scale analysed. The Platform team implemented the technical fix; Taskcover diagnosed, specified, and verified.</p>}
        <div className="dialog-actions">{clientHref && <Link className="text-button" href={clientHref}>Explore the case study <ArrowRight aria-hidden="true" /></Link>}<Link className="button" href="/contact">Discuss a related challenge <ArrowRight aria-hidden="true" /></Link></div>
      </> : modal.kind === "priority" ? <>
        <p className="dialog-eyebrow">British Council / Priority output</p><h2 id="dialog-title">{modal.high ? "32 high-priority" : "26 medium-priority"} actions.</h2><p>This is one of the two priority groups established from 989 identified opportunities.</p>
        <div className="detail-block"><h3>From prioritisation to a working conversation</h3><p>A useful action brief should make the affected page, the problem, the proposed change, the owner, and the verification step explicit.</p></div>
        <div className="detail-block"><h3>Our perspective</h3><p>The purpose of a priority is to help a team decide what to address and what evidence it needs. A priority label alone is not a result.</p></div>
        <p className="form-note">The brief structure describes a general working approach. The actual client action list, scoring criteria, and implementation status are not shown here.</p><Link className="button" href="/contact">Discuss your priorities <ArrowRight aria-hidden="true" /></Link>
      </> : <>
        <p className="dialog-eyebrow">British Council / Scope of work</p><h2 id="dialog-title">From search evidence<br />to a focused action plan.</h2>
        <div className="detail-block"><h3>Understand</h3><p>Analysis of 21,323 query–page relationships across 995 URLs, representing 1.66M impressions and 10,277 clicks.</p></div>
        <div className="detail-block"><h3>Prioritise</h3><p>989 identified opportunities were reduced to 32 high-priority and 26 medium-priority actions.</p></div>
        <div className="detail-block"><h3>Extend the view</h3><p>A 288-prompt AI visibility framework across B2C and B2B journeys.</p></div>
        <p className="form-note">Delivered by Taskcover. SEO consulting led by Jamiez Nguyen. These figures describe analysis and prioritisation, not attributed growth or completed implementation.</p><Link className="button" href="/contact">Discuss your search priorities <ArrowRight aria-hidden="true" /></Link>
      </>}
    </DetailDialog>}
  </>;
}
