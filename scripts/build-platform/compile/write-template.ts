import fs from "fs/promises";

export async function writeTemplate(
  templateSourceFile: string,
  destinationFile: string,
  {
    scriptPath,
    cssPath,
  }: {
    scriptPath: string | null;
    cssPath: string | null;
  }
) {
  const template_file = await fs.readFile(templateSourceFile, "utf-8");

  const output_data = template_file
    .replace(
      "{{GENERATED_SCRIPT}}",
      scriptPath ? `<script src="${scriptPath}" type="module"></script>` : ""
    )
    .replace(
      "{{GENERATED_STYLE}}",
      cssPath
        ? `<link type="text/css" rel="stylesheet" href="${cssPath}" />`
        : ""
    );

  await fs.writeFile(destinationFile, output_data, "utf-8");
}
