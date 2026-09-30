import { describe, expect, it } from "vitest";
import { buildBrief, getDecision, initialSelections, journey, questionKey, scenarios, stages, type ScenarioKey, type StudioState } from "./model";

describe("Decision Studio authored journeys", () => {
  it("provides a concrete decision, working note and measurement context for all 27 paths", () => {
    const keys = new Set<string>();
    for (const scenario of Object.keys(scenarios) as ScenarioKey[]) {
      for (const stage of stages) {
        for (const choice of journey[stage].choices) {
          const state: StudioState = { scenario, stage, selections: { ...initialSelections, [stage]: choice.id } };
          const decision = getDecision(state);
          keys.add(questionKey(state));
          for (const text of [decision.question, decision.problem, decision.action, decision.title, decision.intro, decision.takeaway, decision.artifact]) {
            expect(typeof text).toBe("string");
            expect(text.length).toBeGreaterThan(10);
            expect(text).not.toContain("undefined");
          }
          expect(decision.rows).toHaveLength(3);
          expect(scenarios[scenario].events).toHaveLength(4);
        }
      }
    }
    expect(keys.size).toBe(27);
  });

  it("keeps AI observation distinct from guaranteed inclusion", () => {
    const decision = getDecision({ scenario: "b2b", stage: "find", selections: { ...initialSelections, find: "ai" } });
    expect(decision.action).toContain("rather than promising inclusion");
    expect(decision.artifact).toBe("AI visibility observation plan");
  });

  it("exports selected questions from different audiences without presenting them as diagnosed problems", () => {
    const brief = buildBrief("example.com", "Clarify our service", "ecommerce", [
      { key: "services:trust:work", scenario: "Services & Consulting", stage: "trust", question: "What does the work look like?", action: "Show a sample deliverable." },
      { key: "b2b:trust:scope", scenario: "B2B Software", stage: "trust", question: "Will it fit our systems?", action: "Check integration boundaries." },
    ]);
    expect(brief).toContain("1. [Services & Consulting / trust]");
    expect(brief).toContain("2. [B2B Software / trust]");
    expect(brief).toContain("not an audit of my website");
    expect(brief).toContain("Nothing has been sent");
  });
});
