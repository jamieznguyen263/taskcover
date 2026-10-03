"use client";

import { useEffect, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, FileText, Pause, Play, Search, Users } from "lucide-react";
import { motion, useSpring } from "motion/react";
import { useReducedMotion } from "./use-reduced-motion";
import "./answer-opening.css";

export function AnswerHero() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const x = useSpring(0, { stiffness: 100, damping: 25 });
  const y = useSpring(0, { stiffness: 100, damping: 25 });
  const rotate = useSpring(0, { stiffness: 100, damping: 25 });
  const disabled = reducedMotion || paused;

  useEffect(() => {
    if (disabled) { x.jump(0); y.jump(0); rotate.jump(0); }
  }, [disabled, x, y, rotate]);

  function followPointer(event: PointerEvent<HTMLElement>) {
    if (disabled || event.pointerType !== "mouse" || !window.matchMedia("(min-width: 701px) and (hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5));
    x.set(px * 16); y.set(py * 12); rotate.set(px * 3);
  }

  function resetPointer() { x.set(0); y.set(0); rotate.set(0); }

  return <section className="answer-hero" aria-labelledby="answer-title" data-motion-paused={disabled ? "true" : "false"} onPointerMove={followPointer} onPointerLeave={resetPointer}>
    <Image className="answer-search-field" src="/images/answer/search-field.webp" alt="" fill sizes="100vw" preload />
    <div className="answer-hero-inner">
      <div className="answer-hero-copy">
        <p className="answer-eyebrow">Search / People / Progress</p>
        <h1 id="answer-title">Be the<br />answer.</h1>
        <p className="answer-positioning">SEO and AI search.<br className="answer-mobile-break" /> Built around how people choose.</p>
        <p className="answer-description">We help ambitious brands get discovered, understood and chosen — across Google and AI search.</p>
        <div className="answer-actions">
          <Link className="answer-action" href="/contact">Discuss your project <ArrowUpRight size={19} aria-hidden="true" /></Link>
          <a className="answer-link" href="#where-we-help">See where we can help <ArrowDown size={18} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="answer-art" aria-hidden="true">
        <motion.div className="answer-lens" style={{ x, y, rotate }}>
          <Image src="/images/answer/lens.webp" alt="" width={1000} height={1111} sizes="(max-width: 700px) 88vw, (max-width: 1100px) 48vw, 640px" preload />
        </motion.div>
      </div>
      <div className="answer-hero-foot">
        <p>From question to first choice.</p>
        <button className="answer-motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          {paused ? "Resume lens motion" : "Pause lens motion"}
        </button>
      </div>
    </div>
  </section>;
}

const needs = [
  { icon: Search, stage: "Discover", title: "People can’t find us.", body: "Search visibility and AI discovery aren’t bringing the right audience to your website.", label: "Improve visibility", href: "/services/seo-agency" },
  { icon: FileText, stage: "Understand", title: "They don’t see the value.", body: "Content doesn’t answer the questions your customers are asking.", label: "Create more useful content", href: "/services/content-marketing" },
  { icon: Users, stage: "Choose", title: "The next step isn’t clear.", body: "Good interest doesn’t turn into enquiries, signups or sales.", label: "Make the next step clear", href: "/services/website-development" },
] as const;

export function AnswerNeeds() {
  return <section className="answer-needs" id="where-we-help" aria-labelledby="answer-needs-title">
    <div className="answer-container">
      <div className="answer-section-heading">
        <div><p className="answer-eyebrow">What’s holding search back?</p><h2 id="answer-needs-title">Find the right<br />problem to solve.</h2></div>
        <p>A clear diagnosis connects the work to your business.</p>
      </div>
      <div className="answer-needs-grid">{needs.map((need, index) => <article key={need.stage}>
        <need.icon className="answer-need-icon" size={27} strokeWidth={1.7} aria-hidden="true" />
        <div><p className="answer-stage">0{index + 1} &nbsp; {need.stage}</p><h3>{need.title}</h3><p className="answer-need-body">{need.body}</p><Link className="answer-link" href={need.href}>{need.label}<ArrowRight size={17} aria-hidden="true" /></Link></div>
      </article>)}</div>
    </div>
  </section>;
}

export const answerServices = [
  { title: "SEO Strategy & Consulting", href: "/services/seo-agency", question: "Where should we focus?", output: "Priorities and a practical roadmap.", detail: "Connect search demand with your business priorities. Agree what deserves attention and how to assess the work." },
  { title: "Technical SEO", href: "/services/technical-seo", question: "What is getting in the way?", output: "Diagnosis, requirements and verification.", detail: "Investigate access, rendering and indexing. Give the implementation team clear requirements and a way to verify the change." },
  { title: "Content Strategy", href: "/services/content-marketing", question: "What does your buyer need to understand?", output: "Question maps, page roles and useful content.", detail: "Map customer questions to useful pages, with evidence and a clear next step for the decision being made." },
  { title: "AI Search / GEO / AEO", href: "/services/ai-search-optimization", question: "How is your brand represented in answers?", output: "A repeatable view of answers and citations.", detail: "Create clear source material and evaluate answers and citations with their prompt, model and date in view." },
  { title: "Website Design & Development", href: "/services/website-development", question: "Can people see a clear way forward?", output: "Structure, content and usable journeys.", detail: "Connect positioning, evidence and customer needs to real content, working journeys and implementation." },
] as const;

export function AnswerServices() {
  const [active, setActive] = useState(1);
  const service = answerServices[active];
  return <section className="answer-services answer-container" id="expertise" aria-labelledby="answer-services-title">
    <div className="answer-section-heading">
      <div><p className="answer-eyebrow">Our services</p><h2 id="answer-services-title">The expertise behind the next move.</h2></div>
      <p>Different questions. A connected approach. Practical outcomes.</p>
    </div>
    <div className="answer-services-layout">
      <div className="answer-service-list">{answerServices.map((item, index) => <Link key={item.href} href={item.href} className="answer-service-row" data-active={active === index ? "true" : "false"} onPointerEnter={event => { if (event.pointerType === "mouse") setActive(index); }} onFocus={() => setActive(index)}>
        <span className="answer-service-index" aria-hidden="true">0{index + 1}</span>
        <h3>{item.title}</h3><span className="answer-service-explanation"><span>{item.question}</span><span>{item.output}</span></span><ArrowUpRight size={20} aria-hidden="true" />
      </Link>)}<Link className="answer-link answer-all-services" href="/services">Explore all services <ArrowRight size={18} aria-hidden="true" /></Link></div>
      <aside className="answer-service-preview" aria-label="Service preview" data-service={active}>
        <div className="answer-service-image"><Image src="/images/answer/search-layers.webp" width={600} height={800} alt="Search, AI answers and useful content connected around your brand" sizes="(max-width: 700px) 88vw, 300px" /></div>
        <div className="answer-preview-copy" key={service.href}><p className="answer-stage">0{active + 1} / In focus</p><h3>{service.title}</h3><p>{service.detail}</p></div>
      </aside>
    </div>
  </section>;
}
