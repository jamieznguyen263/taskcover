import type { WorkRecord, WorkType } from "./work.types";
import { caseStudyDetails, caseStudyOrder } from "./en/case-studies";

export const workRegistry: WorkRecord[] = caseStudyOrder.map((slug) => {
  const item = caseStudyDetails[slug];
  return {
    id: item.id,
    type: item.type,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    clientName: item.clientName,
    industry: item.industry,
    market: item.market,
    serviceSlugs: item.serviceSlugs,
    industrySlugs: item.industrySlugs,
    marketSlugs: item.marketSlugs,
    challenge: item.challenge,
    approach: item.strategy,
    deliverables: item.deliverables,
    outcomes: item.results,
    metrics: item.metrics.map((metric) => `${metric.label}: ${metric.value}`),
    timeframe: item.engagementPeriod,
    methodology: item.execution.map((step) => step.label),
    assetPath: item.visualGallery[0]?.src,
    permissionStatus: "verified-public",
    verificationStatus: "verified",
    publicDisclosure: true,
    illustrative: false,
    requiredContextComplete: true,
    measurementSource: "Verified source case-study page approved for Taskcover public use",
    baselineContext: item.startingPoint,
    approvedWording: true,
    approvedAssets: true,
  };
});

export function isPublicVerifiedWorkItem(item: WorkRecord): boolean {
  return (
    item.permissionStatus === "verified-public" &&
    item.verificationStatus === "verified" &&
    item.publicDisclosure === true &&
    item.requiredContextComplete === true
  );
}

export function isPublishableCaseStudy(item: WorkRecord): boolean {
  return (
    item.type === "case-study" &&
    isPublicVerifiedWorkItem(item) &&
    Boolean(item.clientName) &&
    Boolean(item.challenge) &&
    Boolean(item.timeframe) &&
    Boolean(item.methodology?.length) &&
    item.approvedWording === true &&
    item.approvedAssets === true
  );
}

export function isPublishableClientResult(item: WorkRecord): boolean {
  return (
    item.type === "client-result" &&
    isPublicVerifiedWorkItem(item) &&
    Boolean(item.measurementSource) &&
    Boolean(item.baselineContext) &&
    Boolean(item.timeframe) &&
    Boolean(item.methodology?.length) &&
    item.approvedWording === true
  );
}

export function getPublicCaseStudies(): WorkRecord[] {
  return workRegistry.filter(isPublishableCaseStudy);
}

export function getVerifiedPublicResults(): WorkRecord[] {
  return workRegistry.filter(isPublishableClientResult);
}

export function getWorkItemsByType(type: WorkType): WorkRecord[] {
  return workRegistry.filter((item) => item.type === type);
}
