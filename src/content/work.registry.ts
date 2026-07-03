import type { WorkRecord, WorkType } from "./work.types";

export const workRegistry: WorkRecord[] = [];

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
