import { spawn } from "node:child_process";
import {
  copyFile as fsCopyFile,
  mkdir,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { stderr } from "node:process";
import readline from "node:readline";

import { PostAttribute } from "@mjy-blog/theme-lib";
import frontmatter from "front-matter";

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

async function execShFile(cwd: string, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("sh", [filePath], { cwd });

    const stdoutRl = readline.createInterface({ input: child.stdout });
    const stderrRl = readline.createInterface({ input: child.stderr });

    stdoutRl.on("line", (line) => {
      if (process.env.VERBOSE) {
        console.log(`[execShFile stdout]: ${line}`);
      }
    });

    stderrRl.on("line", (line) => {
      console.error(`[execShFile stderr]: ${line}`);
    });

    child.on("error", (error) => {
      console.error(`[execShFile error]: ${error.message}`);
      reject(error);
    });

    child.on("close", (code) => {
      stdoutRl.close();
      stderrRl.close();

      if (code === 0) {
        resolve();
      } else {
        const error = new Error(`Process exited with code ${code}`);
        console.error(`[execShFile error]: ${error.message}`);
        reject(error);
      }
    });
  });
}

async function copyFile(src: string, dest: string): Promise<void> {
  const stats = await stat(src);

  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });

    const entries = await readdir(src);

    for (const entry of entries) {
      const srcPath = join(src, entry);
      const destPath = join(dest, entry);

      await copyFile(srcPath, destPath);
    }
  } else if (stats.isFile()) {
    await fsCopyFile(src, dest);
    if (process.env.VERBOSE) {
      console.log(`Copied file: ${src} -> ${dest}`);
    }
  } else {
    console.warn(`Skipped: ${src} is not a file or directory`);
  }
}

(async () => {
  const postPaths = await listPosts(resolve("src/posts"));
  const posts: CorePost<CustomPostAttribute>[] = [];
  for (let i = 0; i < postPaths.length; i++) {
    const path = postPaths[i];
    const inPath = join("src/posts", path, "README.mdx");
    const outPath = join("out/posts", path, "page.js");
    if (existsSync(join("src/posts", path, "build.sh"))) {
      await execShFile(join("src/posts", path), "build.sh");
    }
    if (existsSync(join("src/posts", path, "components"))) {
      await copyFile(
        join("src/posts", path, "components"),
        join("out/posts", path, "components")
      );
    }
    if (existsSync(join("src/posts", path, "static"))) {
      await copyFile(
        join("src/posts", path, "static"),
        join("out/public", path, "static")
      );
    }
    const { content, tocItems } = await compile(inPath, outPath);
    const { attributes } = frontmatter<any>(content);
    attributes.createTime ??= await getCreateTime(inPath);
    attributes.updateTime ??= await getUpdateTime(inPath);
    posts.push({
      path: join("posts", path, "page.js"),
      attributes,
      slug: path,
      tocItems,
    });
    console.log(`(${i + 1}/${postPaths.length}) built ${path}`);
  }
  await copyFile("src/scripts", "out/scripts");
  await writeFile("out/index.json", JSON.stringify(posts));
  console.log("done.");
})();
