import esbuild, { BuildOptions } from "esbuild";
import fs from "fs/promises";
import {
  build_dpath,
  env_define_output_fpath,
  env_params_output_fpath,
  index_fpath,
} from "../file-paths";
import { BuildEnvironment } from "../../../environment/schema";
import { postBuildPlugin } from "./post-build-plugin";

export async function compile() {
  const define = JSON.parse(
    await fs.readFile(env_define_output_fpath, "utf-8")
  );

  const env = JSON.parse(
    await fs.readFile(env_params_output_fpath, "utf-8")
  ) as BuildEnvironment;

  const build_options: BuildOptions = {
    entryPoints: [index_fpath],
    entryNames: "[name].[hash]",
    sourcemap: process.env.IS_DEV ? "inline" : false,
    minify: !process.env.IS_DEV,
    minifySyntax: true,
    bundle: true,
    outdir: build_dpath,
    metafile: true,
    loader: {
      ".png": "base64",
    },
    define: {
      ...define,
      "process.env.NODE_ENV": process.env.IS_DEV
        ? '"development"'
        : '"production"',
    },
    // Most of the magic specific to our extension happens here
    plugins: [postBuildPlugin(env)],
  };

  return esbuild.build(build_options);
}
