import { PluginBuild } from "esbuild";
import { writeTemplate } from "./write-template";
import { BuildEnvironment } from "../../../environment/schema";
import { path } from "../utils/paths";
import { getPathFromRoot } from "../utils/root-path";
import { build_dpath } from "../file-paths";

const time = () => new Date().getTime();

export const postBuildPlugin = (env: BuildEnvironment) => ({
  name: "postbuild",
  setup(build: PluginBuild) {
    let laststart = time();
    build.onStart(() => {
      laststart = time();
    });
    build.onEnd(async (result) => {
      if (!result.metafile) {
        return;
      }

      const files = {
        css: null as string | null,
        js: null as string | null,
      };

      const css_output = Object.entries(result.metafile.outputs).forEach(
        ([outputName, data]) => {
          const basename = path.basename(outputName);
          const [fname, hash, ext] = basename.split(".");

          if (ext === "js") {
            files.js = basename;
          }
          if (ext === "css") {
            files.css = basename;
          }
        }
      );

      await writeTemplate(
        getPathFromRoot("./src/index.html"),
        path.join(build_dpath, "./index.html"),
        { scriptPath: files.js, cssPath: files.css }
      );

      console.info("Build completed in", time() - laststart, "milliseconds");
    });
  },
});
