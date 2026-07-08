import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

const cloudflareConfig = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  tagCache: "dummy",
  queue: "dummy",
  cachePurge: "dummy",
});

const openNextConfig = {
  ...cloudflareConfig,
  buildCommand: "npx next build --webpack",
};

export default openNextConfig;
