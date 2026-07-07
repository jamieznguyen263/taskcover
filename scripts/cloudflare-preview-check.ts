import { assertCloudflarePreviewEnv, loadCloudflarePreviewEnv } from "./cloudflare-preview-env";

loadCloudflarePreviewEnv();
if (!assertCloudflarePreviewEnv()) {
  process.exit(1);
}
