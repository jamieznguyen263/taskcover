import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DecisionStudio } from "./decision-studio/decision-studio";
import { HomeEvidence } from "./decision-studio/home-evidence";
import "./decision-studio/decision-home.css";

const services = [
  { title: "SEO Strategy & Consulting", href: "/services/seo-agency", question: "Where should we focus?", description: "Connect search demand with your business priorities. Agree what deserves attention, what can wait, and how to assess the work." },
  { title: "Technical SEO", href: "/services/technical-seo", question: "What is getting in the way?", description: "Investigate access, rendering, indexing, and technical behaviour. Give the implementation team clear requirements and a way to verify the change." },
  { title: "Content Strategy", href: "/services/content-marketing", question: "What does the buyer need to understand?", description: "Map customer questions to useful pages. Make the information, evidence, and next step specific to the decision being made." },
  { title: "AI Search · GEO & AEO", href: "/services/ai-search-optimization", question: "How does your expertise appear in AI answers?", description: "Create clear source material and a repeatable observation framework. Evaluate answers and citations with their prompt, model, and date in view." },
  { title: "Website Design & Development", href: "/services/website-development", question: "Can people see a clear way forward?", description: "Turn positioning, evidence, and customer needs into a website people can use. Connect the design to real content, working journeys, and implementation." },
];

export function DecisionHomeView() {
  return <div className="taskcover-home">
    <section className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Be found by the right people.<br /><span>Give them a reason to choose you.</span></h1>
      <p>Expert-led SEO, AI search, and websites built around your customers.</p>
      <div className="hero-actions"><Link className="button" href="/contact">Talk about your project <ArrowRight aria-hidden="true" /></Link><a className="text-button" href="#selected-work">Explore our work <ArrowRight aria-hidden="true" /></a></div>
    </section>
    <DecisionStudio />
    <HomeEvidence />
    <section className="expertise-section continuation-section" id="expertise" aria-labelledby="expertise-title">
      <div className="section-lead"><div><p className="eyebrow">Connected expertise</p><h2 id="expertise-title">Start with the question.<br />Bring in the right expertise.</h2></div><div className="section-side"><p>Search, content, and the website shape the same customer journey. The work should connect them.</p></div></div>
      <div className="expertise-list">{services.map((service, i) => <Link className="expertise-row" href={service.href} key={service.href}>
        <span className="row-index">0{i + 1}</span><div><p className="service-question">{service.question}</p><h3>{service.title}</h3></div><p className="service-description">{service.description}</p><ArrowRight aria-hidden="true" />
      </Link>)}</div><Link className="text-button" href="/services">Explore all services <ArrowRight aria-hidden="true" /></Link>
    </section>
    <section className="technical-section continuation-section" aria-labelledby="technical-title">
      <div className="section-lead"><div><p className="eyebrow">Inside the work / Skyscanner</p><h2 id="technical-title">When the page is right.<br />But search shows the wrong price.</h2></div><div className="section-side"><p>The visible symptom was in search. The cause sat in the delivery layer.</p></div></div>
      <ol className="technical-steps">
        <li><span className="row-index">01 / Diagnose</span><h3>Trace the stale price.</h3><p>Taskcover traced stale prices in search results to Edge CDN caching and turned the finding into a defined technical requirement.</p></li>
        <li><span className="row-index">02 / Implement</span><h3>Put the fix with the right team.</h3><p>The Platform team implemented the technical fix. Taskcover’s role was diagnosis, requirements, and verification.</p></li>
        <li><span className="row-index">03 / Verify</span><h3>Check the delivered result.</h3><p>Server evidence and GSC Live URL testing were used to validate the fix, connecting the implementation back to the original issue.</p></li>
      </ol><p className="case-footnote">This technical investigation is separate from the Skyscanner portfolio performance analysis.</p><Link className="text-button" href="/services/technical-seo">Explore how we approach technical SEO <ArrowRight aria-hidden="true" /></Link>
    </section>
    <section className="people-section continuation-section" aria-labelledby="people-title">
      <div><p className="eyebrow">People & partnership</p><h2 id="people-title">Work with the people<br />behind the thinking.</h2></div>
      <div className="people-copy"><p className="lead-copy">Expert-led work needs clear ownership, useful conversations, and evidence both teams can evaluate.</p><h3>Jamiez Nguyen · Lead SEO Consultant</h3><p>Leads SEO consulting for Taskcover projects including British Council, Skyscanner, and Agoda.</p><p>We connect the business question with the analysis, the people implementing the work, and the checks needed to understand what changed.</p><div className="dialog-actions"><Link className="text-button" href="/about">Meet Taskcover <ArrowRight aria-hidden="true" /></Link><Link className="text-button" href="/how-we-work">How we work <ArrowRight aria-hidden="true" /></Link></div></div>
    </section>
    <section className="engagement-section continuation-section" aria-labelledby="engagement-title">
      <div className="section-lead"><div><p className="eyebrow">Working together</p><h2 id="engagement-title">A useful scope starts<br />with what you need to solve.</h2></div><div className="section-side"><p>Tell us what is clear, what is uncertain, and who will be involved. We can discuss a suitable starting point.</p></div></div>
      <div className="engagement-list">
        <article><span className="row-index">01</span><h3>Clarify the priorities.</h3><p>Bring a search or website challenge. Start by understanding the evidence and deciding what needs investigation.</p></article>
        <article><span className="row-index">02</span><h3>Define a project.</h3><p>Discuss a specific piece of work, its boundaries, responsibilities, and what a useful deliverable would look like.</p></article>
        <article><span className="row-index">03</span><h3>Connect ongoing work.</h3><p>Explore how strategy, implementation, and review could fit your team’s capacity and business priorities.</p></article>
      </div><div className="dialog-actions"><Link className="text-button" href="/how-we-work">Understand the process <ArrowRight aria-hidden="true" /></Link><Link className="text-button" href="/pricing">Explore pricing & scope <ArrowRight aria-hidden="true" /></Link></div>
    </section>
    <section className="continuation-cta continuation-section" aria-labelledby="contact-title"><p className="eyebrow">A useful place to start</p><h2 id="contact-title">What needs to become<br />clearer in your business?</h2><p className="contact-context">Tell us about your website, your customers, and the challenge you want to work through.</p><Link className="button" href="/contact">Let’s talk about it <ArrowRight aria-hidden="true" /></Link></section>
  </div>;
}
