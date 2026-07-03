import type { ProofRecord, ProofType } from "./proof.types";

export const proofRegistry: ProofRecord[] = [];

export function isPublicVerifiedProofItem(item: ProofRecord): boolean {
  return (
    item.permissionStatus === "verified-public" &&
    item.verificationStatus === "verified" &&
    item.publicDisclosure === true
  );
}

export function getPublicProofItems(): ProofRecord[] {
  return proofRegistry.filter(isPublicVerifiedProofItem);
}

export function getProofItemsByType(type: ProofType): ProofRecord[] {
  return proofRegistry.filter((item) => item.type === type);
}

export function getVerifiedPublicProofItems(): ProofRecord[] {
  return getPublicProofItems();
}

export function getVerifiedPublicProofItemsByType(type: ProofType): ProofRecord[] {
  return proofRegistry
    .filter((item) => item.type === type)
    .filter(isPublicVerifiedProofItem);
}

export function getPrivateReferenceAvailability() {
  const available = proofRegistry.some(
    (item) =>
      item.permissionStatus === "private-reference" &&
      item.verificationStatus === "verified"
  );

  return {
    available,
    publicMessage:
      "Private references may be available for qualified engagements.",
  };
}
