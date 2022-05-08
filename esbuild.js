import esbuild from "esbuild";
esbuild
  .build({
    platform: "node",
    logLevel: "info",
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    format: "esm",
    target: "node16",
    outfile: "dist/index.js",
    external: [
      "twitter-autohook",
      "axios",
      "dotenv",
      "jsonwebtoken",
      "todoist-rest-client",
      "twitter-api-v2",
      "fkill",
    ],
  })
  .catch(() => process.exit(1));
