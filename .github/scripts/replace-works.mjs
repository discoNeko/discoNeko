// README.md の <!-- works:start --> 〜 <!-- works:end --> の間を、指定ファイルの内容で置き換える
// 使い方: node .github/scripts/replace-works.mjs <作品欄の md> <README.md>
import { readFileSync, writeFileSync } from "node:fs";

const [src, target] = process.argv.slice(2);
if (!src || !target) {
  console.error("usage: node replace-works.mjs <works.md> <README.md>");
  process.exit(2);
}
const START = "<!-- works:start -->";
const END = "<!-- works:end -->";
const works = readFileSync(src, "utf8").trim();
const readme = readFileSync(target, "utf8");
const s = readme.indexOf(START);
const e = readme.indexOf(END);
if (s < 0 || e < 0 || e < s) {
  console.error(`${target} に ${START} と ${END} が見つかりません`);
  process.exit(1);
}
// 取得に失敗して空や HTML のエラーページが返ってきたときに README を壊さない
if (!works.includes("discoNeko works")) {
  console.error("作品欄の内容が想定と違うため、更新を中止しました");
  process.exit(1);
}
const next = readme.slice(0, s + START.length) + "\n" + works + "\n" + readme.slice(e);
if (next === readme) {
  console.log("変更なし");
} else {
  writeFileSync(target, next);
  console.log("README.md を更新しました");
}
