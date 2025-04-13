const fs = require("fs");
const path = require("path");

const srcPath = path.join(__dirname, "src");
const modulesPath = path.join(srcPath, "modules");
const domainPath = path.join(srcPath, "domain");
const infraPath = path.join(srcPath, "infrastructure");
const sharedPath = path.join(srcPath, "shared");

const ensureDirs = () => {
  for (const dir of [modulesPath, domainPath, infraPath, sharedPath]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
};

const isFeatureFile = (name) =>
  name.match(/^[a-zA-Z]+(Controller|Service|Repository|Routes|Dto)\.ts$/);

const suffixMap = {
  Controller: ".controller.ts",
  Service: ".service.ts",
  Repository: ".repository.ts",
  Routes: ".routes.ts",
  Dto: ".dto.ts",
};

const moveFeatureFilesToModules = () => {
  const layerDirs = [
    "controllers",
    "services",
    "repositories",
    "routes",
    "dtos",
  ];

  for (const layer of layerDirs) {
    const dir = path.join(srcPath, layer);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const match = file.match(
        /^([a-zA-Z]+)(Controller|Service|Repository|Routes|Dto)\.ts$/
      );
      if (!match) continue;

      const feature = match[1].toLowerCase();
      const type = match[2];
      const suffix = suffixMap[type];

      const moduleDir = path.join(modulesPath, feature);
      if (!fs.existsSync(moduleDir))
        fs.mkdirSync(moduleDir, { recursive: true });

      const newFile = path.join(moduleDir, `${feature}${suffix}`);
      fs.renameSync(path.join(dir, file), newFile);
    }
  }
};

const createFactoryFiles = () => {
  const features = fs.readdirSync(modulesPath);

  for (const feature of features) {
    const dir = path.join(modulesPath, feature);
    const pascal = feature.charAt(0).toUpperCase() + feature.slice(1);
    const lines = [];

    const files = fs.readdirSync(dir);
    const has = (suffix) => files.includes(`${feature}.${suffix}.ts`);

    if (has("repository"))
      lines.push(
        `import { ${pascal}Repository } from './${feature}.repository';`
      );
    if (has("service"))
      lines.push(`import { ${pascal}Service } from './${feature}.service';`);
    if (has("controller"))
      lines.push(
        `import { ${pascal}Controller } from './${feature}.controller';`
      );

    lines.push("");
    lines.push(`export const make${pascal}Controller = () => {`);
    if (has("repository"))
      lines.push(`  const repository = new ${pascal}Repository();`);
    if (has("service"))
      lines.push(
        `  const service = new ${pascal}Service(${
          has("repository") ? "repository" : ""
        });`
      );
    if (has("controller"))
      lines.push(
        `  return new ${pascal}Controller(${has("service") ? "service" : ""});`
      );
    else lines.push(`  // return something`);
    lines.push("};");

    fs.writeFileSync(path.join(dir, `${feature}.factory.ts`), lines.join("\n"));
  }
};

const moveDomainFiles = () => {
  const files = fs.readdirSync(srcPath);
  for (const file of files) {
    if (
      file.endsWith(".entity.ts") ||
      file.endsWith(".interface.ts") ||
      file.endsWith(".exception.ts")
    ) {
      fs.renameSync(path.join(srcPath, file), path.join(domainPath, file));
    }
  }
};

const moveInfraFiles = () => {
  const infraFiles = fs
    .readdirSync(srcPath)
    .filter(
      (f) =>
        f.includes("prisma") || f.includes("mailer") || f.includes("logger")
    );

  const dbDir = path.join(infraPath, "database");
  const emailDir = path.join(infraPath, "email");
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  if (!fs.existsSync(emailDir)) fs.mkdirSync(emailDir, { recursive: true });

  for (const file of infraFiles) {
    const src = path.join(srcPath, file);
    const dest = file.includes("prisma")
      ? path.join(dbDir, file)
      : file.includes("mailer")
      ? path.join(emailDir, file)
      : path.join(infraPath, file);
    fs.renameSync(src, dest);
  }
};

const moveSharedStuff = () => {
  const sharedTypes = ["types", "utils", "constants", "middlewares"];
  for (const folder of sharedTypes) {
    const fullPath = path.join(srcPath, folder);
    if (fs.existsSync(fullPath)) {
      fs.renameSync(fullPath, path.join(sharedPath, folder));
    }
  }
};

// 🧩 All together now
ensureDirs();
moveFeatureFilesToModules();
createFactoryFiles();
moveDomainFiles();
moveInfraFiles();
moveSharedStuff();

console.log("✅ Clean architecture refactor complete!");
