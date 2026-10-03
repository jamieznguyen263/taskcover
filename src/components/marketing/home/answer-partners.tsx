"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "./use-reduced-motion";

type Partner<Key extends string> = { id: Key; name: string; label: string; src: string; width: number; height: number; dark?: boolean };

export function AnswerPartners<Key extends string>({ items, onSelect }: { items: Partner<Key>[]; onSelect: (id: Key) => void }) {
  const reducedMotion = useReducedMotion();
  return <section className="answer-partners answer-container" id="selected-work" aria-labelledby="answer-partners-title">
    <div className="answer-partners-featured">
      <div><p className="answer-eyebrow">Selected collaborations</p><h2 id="answer-partners-title">Good company.<br />Serious search.</h2></div>
      {items.slice(0, 2).map((item, index) => <motion.button initial={false} whileHover={reducedMotion ? undefined : { y: -2 }} whileFocus={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: .98 }} whileInView={reducedMotion ? undefined : { y: [6, 0] }} viewport={{ once: true, amount: .5 }} transition={{ duration: .4, delay: index * .05 }} type="button" key={item.id} className="answer-partner-featured" onClick={() => onSelect(item.id)} aria-label={`${item.name}: ${item.label}`}>
        <Image src={item.src} width={item.width} height={item.height} alt={item.name} sizes="(max-width: 700px) 38vw, 240px" />
        <span>{item.id === "british" ? "Search analysis & prioritisation" : "Technical diagnosis & verification"}<ArrowUpRight size={18} aria-hidden="true" /></span>
      </motion.button>)}
    </div>
    <div className="answer-partners-supporting">{items.slice(2).map((item, index) => <motion.button initial={false} whileHover={reducedMotion ? undefined : { y: -2 }} whileFocus={reducedMotion ? undefined : { y: -2 }} whileTap={reducedMotion ? undefined : { scale: .98 }} whileInView={reducedMotion ? undefined : { y: [6, 0] }} viewport={{ once: true, amount: .5 }} transition={{ duration: .35, delay: index * .05 }} type="button" key={item.id} className={`answer-partner-small answer-partner-${item.id}`} onClick={() => onSelect(item.id)} aria-label={`${item.name}: ${item.label}`}>
      <span className={`answer-partner-mark${item.dark ? " answer-partner-source-dark" : ""}`}><Image src={item.src} width={item.width} height={item.height} alt={item.name} sizes="180px" /></span>
      <span className="answer-partner-context">{item.label}<ArrowUpRight size={14} aria-hidden="true" /></span>
    </motion.button>)}</div>
  </section>;
}
