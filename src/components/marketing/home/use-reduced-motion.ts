"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion as useMotionReducedMotion } from "motion/react";

const noOpSubscribe = () => () => undefined;

export function useReducedMotion() {
  const preference = useMotionReducedMotion();
  // SSR cannot read media preferences. Match its first render before applying them.
  const hydrated = useSyncExternalStore(noOpSubscribe, () => true, () => false);
  return hydrated ? preference : false;
}