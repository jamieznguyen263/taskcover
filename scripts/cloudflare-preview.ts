import { spawnSync } from "node:child_process";
import { assertCloudflarePreviewEnv, loadCloudflarePreviewEnv } from "./cloudflare-preview-env";
import { patchOpenNextWorker } from "./open-next-postbuild";

loadCloudflarePreviewEnv();

if (!assertCloudflarePreviewEnv()) {
  process.exit(1);
}

process.env.OPENNEXT_PREVIEW_STATIC_ASSETS_CACHE = "1";

runOpenNext(["build"]);
patchOpenNextWorker();
runOpenNext(["preview", ...process.argv.slice(2)]);

function runOpenNext(args: string[]) {
  const result = spawnSync("opennextjs-cloudflare", args, {
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status && result.status !== 0) {
    process.exit(result.status);
  }
}
