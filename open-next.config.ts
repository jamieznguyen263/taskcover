import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

const previewUsesStaticAssetsCache = process.env.OPENNEXT_PREVIEW_STATIC_ASSETS_CACHE === "1";

const cloudflareConfig = defineCloudflareConfig(
  previewUsesStaticAssetsCache
    ? {
        incrementalCache: staticAssetsIncrementalCache,
        tagCache: "dummy",
        queue: "dummy",
        cachePurge: "dummy",
      }
    : undefined
);

const openNextConfig = {
  ...cloudflareConfig,
  buildCommand: "npx next build --webpack",
};

export default openNextConfig;
