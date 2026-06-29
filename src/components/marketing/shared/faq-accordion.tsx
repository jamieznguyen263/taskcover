"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible FAQ accordion built on Radix.
 * Only render FAQs that are genuinely visible on the page so FAQ schema stays
 * accurate. See docs/SEO_STANDARDS.md.
 */
export function FAQAccordion({
  items,
  className,
}: {
  items: { q: string; a: React.ReactNode }[];
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      className={cn("flex flex-col gap-3", className)}
    >
      {items.map((item, index) => (
        <AccordionPrimitive.Item
          key={item.q}
          value={`faq-${index}`}
          className="overflow-hidden rounded-2xl border border-line bg-white"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-graphite transition-colors hover:bg-surface-tint">
              {item.q}
              <Plus
                className="h-5 w-5 shrink-0 text-brand-teal transition-transform duration-300 group-data-[state=open]:rotate-45"
                aria-hidden="true"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.2s_ease] data-[state=open]:animate-[accordion-down_0.2s_ease]">
            <div className="px-5 pb-5 text-sm leading-relaxed text-secondary">
              {item.a}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}