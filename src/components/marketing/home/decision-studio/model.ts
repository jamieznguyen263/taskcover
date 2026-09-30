import content from "@/content/en/decision-studio.json";

export type ScenarioKey = "services" | "b2b" | "ecommerce";
export type Stage = "find" | "trust" | "choose";
export type TrustChoice = "work" | "scope" | "next";
export type Selection = "costs" | "specialist" | "ai" | TrustChoice | "clear" | "open" | "brief";
export type Selections = Record<Stage, Selection>;
export type Row = [string, string];
type TrustDetail = [string, string, string, string, string, Row[], string];
export interface Scenario {
  label: string; brand: string; category: string; domain: string;
  buyer: string; hero: string; sub: string; queries: string[]; result: string[];
  guide: string[]; proof: string[]; trust: Record<TrustChoice, TrustDetail>;
  briefGoal: string; events: string[]; success: string;
}
export interface StudioState { scenario: ScenarioKey; stage: Stage; selections: Selections; }
export interface Decision {
  question: string; problem: string; action: string; title: string; intro: string;
  rows: Row[]; takeaway: string; artifact: string;
}
export interface KeptQuestion {
  key: string; scenario: string; stage: Stage; question: string; action: string;
}
export const scenarios = content.scenarios as Record<ScenarioKey, Scenario>;
export const journey = content.journey as Record<Stage, {title: string; subtitle: string; next: string; choices: {id: Selection}[]}>;
export const audienceLabels = content.audience as Record<ScenarioKey, Record<Stage, string[]>>;
export const stages: Stage[] = ["find", "trust", "choose"];
export const initialSelections: Selections = { find: "specialist", trust: "work", choose: "clear" };
export const measurementNotes = [
  "An exploration signal. It does not by itself establish purchase intent.",
  "Check how the next action is recorded and avoid counting repeated clicks as separate people.",
  "Record successful completion, not just a click on the submit or continue button.",
  "Connect to the business outcome using a verified source and a clear definition.",
];
export const questionKey = (state: StudioState) => [state.scenario, state.stage, state.selections[state.stage]].join(":");

export function getDecision(state: StudioState): Decision {
  const s = scenarios[state.scenario];
  const selection = state.selections[state.stage];
  const index = journey[state.stage].choices.findIndex((c) => c.id === selection);
  if (state.stage === 'trust') {
    const d = s.trust[selection as TrustChoice];
    return { question:d[0], problem:d[1], action:d[2], title:d[3], intro:d[4], rows:d[5], takeaway:d[6], artifact:selection === 'work' ? 'Evidence & example brief' : selection === 'scope' ? 'Scope & information matrix' : 'Next-step content brief' };
  }
  if (state.stage === 'find') {
    const questions = [s.queries[0], s.queries[1], s.queries[2]];
    const problems = ['An exploratory query is sent to a generic sales page that does not answer the question.', 'The result promises a specific solution, but the landing page does not continue that promise.', 'Broad claims offer little explicit information for a person or an answer engine to evaluate.'];
    const actions = ['Map the question to a useful guide, then offer a relevant route to the service or product.', 'Connect the query, result title, page heading, and evidence to one coherent buyer need.', 'Make useful, accurate source information accessible and clearly scoped. Observe AI answers rather than promising inclusion.'];
    return { question:questions[index], problem:problems[index], action:actions[index], title:s.result[index], intro:s.guide.join('. ')+'.', rows:[['Buyer question',questions[index]],['Suitable destination',index === 0 ? 'An explanatory guide' : index === 1 ? 'A relevant service or collection page' : 'A clear, supported source page'],['Next step','A contextual route to evaluation']], takeaway:index === 0 ? 'The first useful answer can earn the next step.' : index === 1 ? 'The result and destination should tell the same story.' : 'AI visibility needs useful source material and repeated observation.', artifact:index === 2 ? 'AI visibility observation plan' : 'Query-to-page intent map' };
  }
  const questions = ['What will happen when I take the next step?', 'What am I being asked to do—and why?', s.briefGoal];
  const problems = ['The call to action does not explain the commitment or what follows.', 'An open invitation gives a new visitor little context for starting.', 'A long form asks for information before the visitor sees its purpose.'];
  const actions = ['Explain what follows the action and give the buyer the information needed to decide.', 'Retain an open route for people who prefer it, while adding a clear explanation of what happens next.', 'Ask only for useful context at this stage, then provide a review step before any submission.'];
  return { question:questions[index], problem:problems[index], action:actions[index], title:state.scenario === 'ecommerce' ? 'Review the next step.' : 'A clear next step starts here.', intro:s.success, rows:[['Purpose',s.events[2]],['Useful context',s.briefGoal],['Business check',s.success]], takeaway:index === 1 ? 'An open invitation can work, but clarity should not depend on familiarity.' : 'Make the commitment clear before asking for action.', artifact:'Conversion path & measurement brief' };
}


export function buildBrief(website: string, goal: string, scenario: ScenarioKey, kept: KeptQuestion[]) {
  const questions = kept.length
    ? kept.map((item, i) => `${i + 1}. [${item.scenario} / ${item.stage}] ${item.question}\n   Possible approach to discuss: ${item.action}`).join("\n\n")
    : "No questions selected. Start with my business goal.";
  return `Taskcover — Conversation brief\n\nWebsite: ${website}\n\nGoal:\n${goal}\n\nCurrent example: ${scenarios[scenario].label}\n\nQuestions I kept:\n${questions}\n\nThese are discussion prompts, not an audit of my website. Nothing has been sent.`;
}
