import { execFile, spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { stderr } from "node:process";
import { promisify } from "node:util";

import { PostAttribute } from "@mjy-blog/theme-lib";
import frontmatter from "front-matter";
import { glob } from "glob";
import { writeFile } from "node:fs/promises";

import { existsSync } from "node:fs";
import { compile } from "./compile";
import { CorePost } from "./externalTypes";
import { listPosts } from "./listPosts";

async function getCreateTime(path: string): Promise<string> {
  const gitlog = spawn("git", [
    "log",
    "--follow",
    "--format=%ad",
    "--date=iso-strict",
    path,
  ]);
  const tail1 = spawn("tail", ["-1"], {
    stdio: [gitlog.stdout, "pipe", stderr],
  });

  let result = "";
  tail1.stdout.on("data", (d) => {
    result += d.toString();
  });

  await Promise.all([
    new Promise<void>((resolve, reject) => {
      gitlog.on("exit", (code, signal) => {
        if (code || signal)
          reject(new Error(`Error, code: ${code}, signal: ${signal}`));
        resolve();
      });
    }),
    new Promise<void>((resolve, reject) => {
      tail1.on("exit", (code, signal) => {
        if (code || signal)
          reject(new Error(`Error, code: ${code}, signal: ${signal}`));
        resolve();
      });
    }),
  ]);

  result = result.trim();
  return result;
}

async function getUpdateTime(path: string): Promise<string> {
  const gitlog = spawn("git", [
    "log",
    "-1",
    "--format=%ci",
    "--date=iso-strict",
    path,
  ]);

  let result = "";
  gitlog.stdout.on("data", (d) => {
    result += d.toString();
  });

  await new Promise<void>((resolve, reject) => {
    gitlog.on("exit", (code, signal) => {
      if (code || signal)
        reject(new Error(`Error, code: ${code}, signal: ${signal}`));
      resolve();
    });
  });

  result = result.trim();
  return result || new Date().toISOString();
}

interface CustomPostAttribute extends PostAttribute {
  excerpt: string;
}

const execFileAsync = promisify(execFile);

async function execShFile(cwd: string, filePath: string): Promise<void> {
  try {
    const { stdout, stderr } = await execFileAsync("sh", [filePath], { cwd });

    if (stdout) {
      console.log(`[execShFile stdout]: ${stdout}`);
    }

    if (stderr) {
      console.error(`[execShFile stderr]: ${stderr}`);
    }
  } catch (error: any) {
    console.error(`[execShFile error]: ${error.message}`);
    throw error;
  }
}

(async () => {
  const includes = (await glob("**/*.mdx", { cwd: "src/include" }))
    .map((path) => path.replace(/\.mdx$/, ""))
    .sort();
  for (let i = 0; i < includes.length; i++) {
    const path = includes[i];
    console.log(`(${i + 1}/${includes.length}) compiling ${path}`);
    const inPath = join("src/include", `${path}.mdx`);
    const outPath = join("out/include", `${path}.js`);
    await compile(inPath, outPath);
  }

  const articlePaths = await listPosts(resolve("src/posts"));
  const articles: CorePost<CustomPostAttribute>[] = [];
  for (let i = 0; i < articlePaths.length; i++) {
    const path = articlePaths[i];
    console.log(`(${i + 1}/${articlePaths.length}) compiling ${path}`);
    const inPath = join("src/posts", path, "README.mdx");
    const outPath = join("out/posts", path, "page.js");
    if (existsSync(join("src/posts", path, "build.sh"))) {
      await execShFile(join("src/posts", path), "build.sh");
    }
    const { content, tocItems } = await compile(inPath, outPath);
    const { attributes } = frontmatter<any>(content);
    attributes.createTime ??= await getCreateTime(inPath);
    attributes.updateTime ??= await getUpdateTime(inPath);
    articles.push({
      path: join("posts", path, "page.js"),
      attributes,
      slug: path,
      tocItems,
    });
  }
  console.log("done.");
  await writeFile("out/index.json", JSON.stringify(articles));
})();
