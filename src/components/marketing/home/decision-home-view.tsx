import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DecisionStudio } from "./decision-studio/decision-studio";
import { HomeEvidence } from "./decision-studio/home-evidence";
import "./decision-studio/decision-home.css";
import { AnswerHero, AnswerNeeds, AnswerServices } from "./answer-opening";

export function DecisionHomeView() {
  return <div className="taskcover-home">
    <AnswerHero />
    <HomeEvidence opening={<><AnswerNeeds /><AnswerServices /><DecisionStudio /></>} />
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
