"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, ClipboardList, Copy, Download, FileText, MessageCircle, RefreshCw, Search, Sparkles, ChartNoAxesColumnIncreasing } from "lucide-react";
import { DetailDialog } from "./detail-dialog";
import { audienceLabels, buildBrief, getDecision, initialSelections, journey, measurementNotes, questionKey, scenarios, stages, type KeptQuestion, type Row, type ScenarioKey, type Selection, type Stage, type StudioState } from "./model";

type DialogView = "note" | "measurement" | "destination" | "summary" | "brief" | "prepared" | null;
function ExampleTable({ rows }: { rows: Row[] }) {
  return <table className="example-table"><tbody>{rows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table>;
}

export function DecisionStudio() {
  const [state, setState] = useState<StudioState>({ scenario: "services", stage: "trust", selections: initialSelections });
  const [view, setView] = useState<"before" | "after">("after");
  const [thinking, setThinking] = useState(false);
  const [kept, setKept] = useState<KeptQuestion[]>([]);
  const [dialog, setDialog] = useState<DialogView>(null);
  const [sampleGoal, setSampleGoal] = useState("");
  const [sampleComplete, setSampleComplete] = useState(false);
  const [website, setWebsite] = useState("");
  const [goal, setGoal] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [copyFallback, setCopyFallback] = useState(false);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scenario = scenarios[state.scenario];
  const step = journey[state.stage];
  const decision = getDecision(state);
  const selection = state.selections[state.stage];
  const index = step.choices.findIndex((choice) => choice.id === selection);
  const label = audienceLabels[state.scenario][state.stage][index];
  const key = questionKey(state);
  const isKept = kept.some((item) => item.key === key);
  const brief = buildBrief(website.trim(), goal.trim(), state.scenario, kept);
  const resetPractice = () => { setSampleComplete(false); setSampleGoal(""); };
  function changeStage(stage: Stage) {
    setState((current) => ({ ...current, stage }));
    setThinking(false); resetPractice();
  }
  function choose(value: Selection) {
    setState((current) => ({ ...current, selections: { ...current.selections, [current.stage]: value } }));
    resetPractice();
  }
  function keepQuestion(onlyAdd = false) {
    setKept((current) => {
      const exists = current.some((item) => item.key === key);
      if (exists) return onlyAdd ? current : current.filter((item) => item.key !== key);
      return [...current, { key, scenario: scenario.label, stage: state.stage, question: decision.question, action: decision.action }];
    });
  }
  function practice() {
    setState((current) => ({ ...current, stage: "choose", selections: { ...current.selections, choose: "brief" } }));
    setView("after"); resetPractice();
  }
  function restart() {
    setState({ scenario: state.scenario, stage: "find", selections: { ...initialSelections } });
    setView("after"); setThinking(false); resetPractice();
    sectionRef.current?.scrollIntoView({ block: "start" });
  }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!website.trim() || !goal.trim()) return;
    setCopyStatus(""); setCopyFallback(false); setDialog("prepared");
  }
  async function copyBrief() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(brief);
      setCopyStatus("Copied. Your brief is ready to paste.");
    } catch {
      setCopyFallback(true);
      setCopyStatus("Use the text field below to select and copy your brief, or save a text file.");
    }
  }
  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "Taskcover-Conversation-Brief.txt";
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCopyStatus("Your brief is ready to download.");
  }
  const sampleNavigation: Record<string, string> = state.scenario === "ecommerce"
    ? { scope: "Details", work: "Product fit", next: "Order info" }
    : state.scenario === "b2b" ? { scope: "Integrations", work: "Workflows", next: "Discuss fit" }
    : { scope: "Services", work: "Our Work", next: "Get in touch" };

  return <>
    <section className="experience" id="experience" ref={sectionRef} aria-labelledby="experience-title">
      <div className="scenario-toolbar">
        <label htmlFor="scenario-select">Explore a business like yours
          <select id="scenario-select" value={state.scenario} onChange={(event) => {
            setState((current) => ({ ...current, scenario: event.target.value as ScenarioKey }));
            setView("after"); resetPractice();
          }}>
            {Object.entries(scenarios).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}
          </select>
        </label>
        <span>{scenario.buyer}</span>
      </div>
      <div className="experience-heading">
        <div><p className="eyebrow">Be your next customer</p><h2 id="experience-title">{step.title}</h2><p className="experience-subtitle">{step.subtitle}</p></div>
        <nav className="stages" aria-label="Explore the customer journey">{stages.map((stage) =>
          <button key={stage} aria-current={state.stage === stage ? "step" : undefined} onClick={() => changeStage(stage)}>
            <span className="stage-dot" aria-hidden="true" /><span>{stage[0].toUpperCase() + stage.slice(1)}</span>
          </button>)}</nav>
      </div>
      <div className="studio-layout">
        <div className="decision-panel">
          <fieldset className="choices"><legend className="sr-only">{step.title}</legend>
            {step.choices.map((choice, i) => <label className="choice" key={choice.id}>
              <input type="radio" name="journey-choice" value={choice.id} checked={choice.id === selection} onChange={() => choose(choice.id)} />
              <span>{audienceLabels[state.scenario][state.stage][i]}</span><ChevronRight aria-hidden="true" />
            </label>)}
          </fieldset>
          <aside className="insight">
            <div className="insight-message"><MessageCircle aria-hidden="true" /><p>{decision.takeaway}</p></div>
            <button className="text-button thinking-toggle" aria-expanded={thinking} aria-controls="thinking-panel" onClick={() => setThinking(!thinking)}>
              {thinking ? "Hide the thinking" : "Show the thinking"} <ArrowRight aria-hidden="true" />
            </button>
            <div id="thinking-panel" hidden={!thinking}><dl>
              <div><dt>The buyer’s question</dt><dd>{decision.question}</dd></div>
              <div><dt>The friction</dt><dd>{decision.problem}</dd></div>
              <div><dt>Our decision</dt><dd>{decision.action}</dd></div>
            </dl></div>
          </aside>
        </div>
        <div className="website-preview" aria-label="Illustrative website preview">
          <div className="comparison-toolbar" role="group" aria-label="Compare the example">
            <button aria-pressed={view === "before"} onClick={() => setView("before")}>Starting point</button>
            <button aria-pressed={view === "after"} onClick={() => setView("after")}>With this change</button>
            <span>Same buyer. Clearer information.</span>
          </div>
          <div className="browser-bar">
            <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
            <span>{scenario.brand} · Illustrative business</span><span className="preview-state">{view === "before" ? "Starting point" : "With this change"}</span>
          </div>
          {state.stage === "find" ? <div className="search-preview">
            <div className="search-input">{selection === "ai" ? <Sparkles aria-hidden="true" /> : <Search aria-hidden="true" />}<span>{scenario.queries[index]}</span></div>
            <p className="search-label">{selection === "ai" ? "Authored AI example · Not a live response" : "Authored search example · Not a live ranking"}</p>
            {selection === "ai" ? <div className="ai-answer">
              <p>{view === "before" ? "Choose a provider with quality products, good service, and experience. There are many options to consider." : scenario.guide.join(". ") + ". Use these details to compare suitability, then check the actual source information before deciding."}</p>
              <button className="ai-source" onClick={() => setDialog("destination")}><FileText aria-hidden="true" /> Inspect the source-page requirements <ArrowRight aria-hidden="true" /></button>
            </div> : <>
              <button className="search-result" onClick={() => setDialog("destination")}>
                <small>{scenario.domain} / {index === 0 ? "guides" : "solutions"}</small>
                <strong>{view === "before" ? "Welcome to " + scenario.brand : scenario.result[index]}</strong>
                <p>{view === "before" ? "We provide quality solutions and excellent service. Contact our team to find out more." : scenario.guide.join(". ") + "."}</p>
              </button>
              <button className="text-button" onClick={() => setDialog("destination")}>Open the destination brief <ArrowRight aria-hidden="true" /></button>
            </>}
            <p className="search-footnote">{view === "before" ? decision.problem : decision.takeaway} {selection === "ai" && "Actual AI responses and citations vary; inclusion cannot be guaranteed."}</p>
          </div> : <div className="sample-website">
            <div className="sample-header">
              <strong className="sample-brand">{scenario.brand} <span>{scenario.category}</span></strong>
              <div className="sample-nav">{Object.entries(sampleNavigation).map(([id, text]) => <button key={id} onClick={() => {
                setState((current) => ({ ...current, stage: "trust", selections: { ...current.selections, trust: id as Selection } })); resetPractice();
              }}>{text}</button>)}</div>
            </div>
            <div className="sample-hero">
              {/* Fixed local asset preserves the approved scene. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/decision-studio/office.webp" alt="A calm, light-filled office with a desk and laptop" width={1400} height={525} />
              <div><h3>{scenario.hero}</h3><p>{scenario.sub}</p></div>
            </div>
            <div className="sample-content">
              {view === "before" ? <div className="starting-point">
                <span className="before-tag">Starting point · Deliberately incomplete example</span>
                <h4>{state.stage === "trust" ? "Quality you can count on." : "Get in touch."}</h4>
                <p>We offer solutions to meet your needs. Our experienced team is here to help you take the next step.</p>
                <button className="sample-button" onClick={() => setView("after")}>See what could be clearer <ArrowRight aria-hidden="true" /></button>
                <p className="sample-small">Buyer’s unanswered question: {decision.question}</p>
              </div> : state.stage === "trust" ? <>
                <p className="sample-kicker">{selection === "work" ? "Evidence the buyer can evaluate" : selection === "scope" ? "Scope and practical details" : "What happens next"}</p>
                <h4>{decision.title}</h4><p className="sample-description">{decision.intro}</p><ExampleTable rows={decision.rows} />
                {selection === "next" && <button className="sample-button" onClick={practice}>{state.scenario === "ecommerce" ? "Try an order-readiness check" : "Try the first-step brief"} <ArrowRight aria-hidden="true" /></button>}
              </> : selection === "brief" ? sampleComplete ? <div className="sample-confirmation">
                <Check aria-hidden="true" /><h4>Now the next step has a starting point.</h4><p className="sample-description">You shared: “{sampleGoal}”</p>
                <p className="sample-small">In a real journey, this would help clarify what follows. No enquiry, order, or payment has been created.</p>
                <button className="sample-button" onClick={resetPractice}>Try another answer <RefreshCw aria-hidden="true" /></button>
              </div> : <>
                <p className="sample-kicker">Useful context, at the right moment</p><h4>{state.scenario === "ecommerce" ? "Check before you commit." : "Make the first conversation relevant."}</h4>
                <form className="sample-form" onSubmit={(event) => { event.preventDefault(); if (sampleGoal.trim()) setSampleComplete(true); }}>
                  <label>{scenario.briefGoal}<input value={sampleGoal} onChange={(event) => setSampleGoal(event.target.value)} maxLength={180} required placeholder="Write one thing that matters to you" /></label>
                  <button className="sample-button" type="submit">Preview the next step <ArrowRight aria-hidden="true" /></button>
                </form><span className="sample-small">Practice only. No enquiry, order, or payment is created.</span>
              </> : selection === "open" ? <>
                <p className="sample-kicker">An open invitation</p><h4>{state.scenario === "ecommerce" ? "Any questions before you order?" : "Tell us what you have in mind."}</h4>
                <p className="sample-description">An open message can suit someone who knows what they need. For a new visitor, explain what help is available and what will happen after they ask.</p>
                <button className="sample-button" onClick={practice}>Try adding a little context <ArrowRight aria-hidden="true" /></button>
                <span className="sample-small">The goal is an appropriate next step, not one universally “best” button.</span>
              </> : <>
                <p className="sample-kicker">A specific invitation</p><h4>{state.scenario === "ecommerce" ? "Review the product. Check the order." : state.scenario === "b2b" ? "Bring a workflow. Evaluate the fit." : "Let’s see if we’re a good fit."}</h4>
                <p className="sample-description">{decision.action}</p><ExampleTable rows={decision.rows.slice(0, 2)} />
                <button className="sample-button" onClick={practice}>{state.scenario === "ecommerce" ? "Try the order checklist" : "Try the introductory brief"} <ArrowRight aria-hidden="true" /></button>
                <span className="sample-small">Illustrative process. Nothing is submitted from the sample website.</span>
              </>}
            </div>
          </div>}
        </div>
      </div>
      <div className="lesson-outcome">
        <div><span className="eyebrow">The decision behind the design</span><p>{decision.takeaway}</p></div>
        <button className="text-button" aria-pressed={isKept} onClick={() => keepQuestion()}>{isKept ? <Check aria-hidden="true" /> : <ClipboardList aria-hidden="true" />}{isKept ? "Question kept" : "Keep this question"}</button>
      </div>
      <div className="depth-actions">
        <button className="text-button" onClick={() => setDialog("note")}>Open the working note <FileText aria-hidden="true" /></button>
        <button className="text-button" onClick={() => setDialog("measurement")}>How would we check this? <ChartNoAxesColumnIncreasing aria-hidden="true" /></button>
        <a className="text-button" href="#british-council">See the real Taskcover work <ArrowRight aria-hidden="true" /></a>
      </div>
      <div className="experience-footer">
        <button className="button" onClick={() => state.stage === "choose" ? setDialog("summary") : changeStage(state.stage === "find" ? "trust" : "choose")}>{step.next} <ArrowRight aria-hidden="true" /></button>
        <button className="text-button" onClick={() => setDialog("summary")}>My questions ({kept.length})</button>
        <p className="illustrative-label">Illustrative experience</p>
      </div>
      <div className="sr-only" role="status" aria-live="polite">{scenario.label}, {state.stage}, {label}. {view === "before" ? "Starting point" : "Improved example"} shown.</div>
      <noscript><p className="noscript-note">Enable JavaScript to explore more situations and prepare a brief. <Link href="/contact">You can contact Taskcover directly.</Link></p></noscript>
    </section>
    <div className="page-footer"><span>Built around the way your customers decide.</span><button className="text-button" onClick={restart}><RefreshCw aria-hidden="true" /> Explore from the beginning</button></div>
    {dialog && <DetailDialog onClose={() => setDialog(null)}>
      {dialog === "note" && <>
        <p className="dialog-eyebrow">Inside the work · {scenario.label}</p><h2 id="dialog-title">{decision.artifact}</h2>
        <p>This is the kind of working note behind the visible change.</p><div className="note-context"><p><strong>Buyer’s question</strong><br />{decision.question}</p></div>
        <div className="detail-block"><h3>01 · Diagnose the gap</h3><p>{decision.problem}</p></div>
        <div className="detail-block"><h3>02 · Define the change</h3><p>{decision.action}</p></div>
        <div className="detail-block"><h3>03 · Specify the information</h3><ExampleTable rows={decision.rows} /></div>
        <div className="detail-block"><h3>04 · Before publishing</h3><p>Confirm source accuracy, responsibilities, and claims with the business. Check the page and interaction on mobile, keyboard, and the relevant search journey.</p></div>
        <p className="form-note">Illustrative Taskcover working-note structure. It is not a completed audit or an actual client document.</p>
        <div className="dialog-actions"><button className="button" onClick={() => keepQuestion(true)}>{isKept ? "Question kept" : "Keep this question"} <ClipboardList aria-hidden="true" /></button><button className="text-button" onClick={() => setDialog("measurement")}>Open the measurement plan <ArrowRight aria-hidden="true" /></button></div>
      </>}
      {dialog === "measurement" && <>
        <p className="dialog-eyebrow">How we would check</p><h2 id="dialog-title">Follow the signal.<br />Verify the outcome.</h2>
        <p>{state.stage === "find" ? selection === "ai" ? "For AI visibility, retain the prompt, model, date, response, and cited URLs. Repeat a defined sample; do not treat one answer as market-wide visibility." : "For search, map query groups to intended landing pages. Review impression, click, and landing-page data with dates, device, brand mix, and seasonality in view." : "Connect the change to a clear hypothesis. A click on a page element is an observation, not proof that the change caused a business result."}</p>
        <ol className="measurement-steps">{scenario.events.map((event, i) => <li key={event}><span className="number">0{i + 1}</span><div><strong>{event}</strong><p>{measurementNotes[i]}</p></div></li>)}</ol>
        <div className="detail-block"><h3>Define success first</h3><p>{scenario.success}</p></div>
        <div className="detail-block"><h3>Check the quality of the data</h3><p>{state.scenario === "ecommerce" ? "Validate purchase events against successful payments and orders; deduplicate events and review cancellations and returns. A thank-you-page visit alone is not reliable proof of a paid order." : "Validate completed enquiries and qualification in the receiving system. Deduplicate events and check spam or test submissions before reading the result."}</p></div>
        <div className="detail-block"><h3>Interpret carefully</h3><p>Use a baseline and an appropriate comparison. Account for changes in traffic mix, seasonality, and other work. If volume permits an experiment, define the hypothesis, primary measure, and guardrails before running it.</p></div>
        <p className="form-note">A proposed measurement approach, with no measured or predicted uplift claimed for this simulation.</p>
      </>}
      {dialog === "destination" && <>
        <p className="dialog-eyebrow">From query to useful destination</p><h2 id="dialog-title">{decision.title}</h2><p>{decision.action}</p>
        <div className="detail-block"><h3>What the page needs to explain</h3><ul className="summary-points">{scenario.guide.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div>
        <ExampleTable rows={decision.rows} /><p className="form-note">Authored example. No live search, financial advice, product specifications, or provider endorsement.</p>
        <button className="button" onClick={() => { setDialog(null); changeStage("trust"); }}>Now evaluate the business <ArrowRight aria-hidden="true" /></button>
      </>}
      {dialog === "summary" && <>
        <p className="dialog-eyebrow">Your questions, collected</p><h2 id="dialog-title">Turn the experience<br />into a useful conversation.</h2>
        <p>You explored {scenario.label.toLowerCase()}. {kept.length ? "Here are the questions you kept while exploring." : "Keep useful questions from any scene, or start with your own business goal."}</p>
        {kept.length > 0 && <ul className="kept-list">{kept.map((item) => <li key={item.key}><span>{item.scenario} · {item.stage}</span><p>{item.question}</p><button className="text-button" onClick={() => setKept((current) => current.filter((entry) => entry.key !== item.key))} aria-label={"Remove question: " + item.question}>Remove</button></li>)}</ul>}
        <p className="form-note">Discussion prompts you selected, not diagnosed issues with your website. They stay in this page until you leave or reload it.</p>
        <div className="dialog-actions"><button className="button" onClick={() => setDialog("brief")}>Create my conversation brief <ArrowRight aria-hidden="true" /></button><Link className="text-button" href="/contact">Talk to Taskcover</Link></div>
      </>}
      {dialog === "brief" && <>
        <p className="dialog-eyebrow">Start with your business</p><h2 id="dialog-title">What should your next<br />customer understand?</h2><p>A little context helps us have a better conversation.</p>
        <form className="brief-form" onSubmit={prepare}>
          <label>Your website<input value={website} onChange={(event) => setWebsite(event.target.value)} name="website" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" maxLength={240} required /></label>
          <label>What would you like to improve?<textarea value={goal} onChange={(event) => setGoal(event.target.value)} name="goal" placeholder="For example, help the right people understand our service and get in touch." maxLength={1200} required /></label>
          <button type="submit" className="button">Prepare my brief <ArrowRight aria-hidden="true" /></button>
        </form><p className="form-note">This prepares a brief in this page. Nothing is sent or saved to a server. Copy or download it before you leave.</p>
      </>}
      {dialog === "prepared" && <>
        <p className="dialog-eyebrow">Ready for a conversation</p><h2 id="dialog-title">Your brief, in your words.</h2><p>Review your brief, then copy or save it to share with Taskcover.</p>
        <pre className="brief-summary">{brief}</pre><div className="dialog-actions">
          <button className="button" onClick={copyBrief}><Copy aria-hidden="true" /> Copy brief</button>
          <button className="text-button" onClick={downloadBrief}><Download aria-hidden="true" /> Save brief</button>
          <a className="text-button" href={"mailto:business@taskcover.com?subject=" + encodeURIComponent("A conversation about my website") + "&body=" + encodeURIComponent(brief)}>Open email draft</a>
          <button className="text-button" onClick={() => setDialog("brief")}>Edit brief</button>
        </div><p className="local-status" role="status">{copyStatus}</p>
        {copyFallback && <><label htmlFor="copy-fallback">Your brief, ready to copy</label><textarea id="copy-fallback" ref={fallbackRef} className="copy-fallback" readOnly value={brief} onFocus={(event) => event.currentTarget.select()} /><button className="text-button" onClick={() => { fallbackRef.current?.focus(); fallbackRef.current?.select(); }}>Select brief text</button></>}
        <p className="form-note">Nothing has been sent. An email draft opens in your email app; you choose whether to send it. You can also paste your brief into our contact form.</p>
        <Link className="text-button" href="/contact">Continue to Taskcover contact <ArrowRight aria-hidden="true" /></Link>
      </>}
    </DetailDialog>}
  </>;
}
