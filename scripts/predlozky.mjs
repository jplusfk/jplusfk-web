// České typografické pravidlo: za jednoznakovou předložkou nebo spojkou (k, s, v, z, o, u, a, i)
// nesmí být konec řádku. Po sestavení webu projde všechny HTML stránky a obyčejnou mezeru
// za těmito slovy nahradí nezlomitelnou (&nbsp;). Totéž mezi číslem a „Kč“ nebo „%“ (550 Kč, 10 %).
// Upravuje jen viditelný text: značky HTML, atributy, <script>, <style>, <pre>, <code> a <textarea> nechává být.
// Obsah v administraci zůstává beze změny, úprava se děje automaticky při každém sestavení.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const NBSP = '\u00A0';
// jednoznakové slovo na začátku textu nebo po mezeře, závorce či uvozovce, za ním mezera
const PREDLOZKA = /(?<=^|[\s\u00A0(„“"'‚–—\/])([ksvzouaiKSVZOUAI])[ \t\r\n]+(?=\S)/g;
// číslo + Kč / %
const JEDNOTKA = /(\d)[ \t]+(?=Kč(?!\p{L})|%)/gu;
const SKIP = new Set(['script', 'style', 'pre', 'code', 'textarea']);

export function upravText(text) {
  return text.replace(PREDLOZKA, `$1${NBSP}`).replace(JEDNOTKA, `$1${NBSP}`);
}

export function upravHtml(html) {
  const parts = html.split(/(<[^>]*>)/);
  let skip = null;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p) continue;
    if (p.startsWith('<')) {
      const m = p.match(/^<(\/?)([a-zA-Z0-9-]+)/);
      if (m) {
        const tag = m[2].toLowerCase();
        if (!m[1] && SKIP.has(tag) && !skip && !p.endsWith('/>')) skip = tag;
        else if (m[1] && tag === skip) skip = null;
      }
      continue;
    }
    if (!skip) parts[i] = upravText(p);
  }
  return parts.join('');
}

async function* htmlSoubory(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlSoubory(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export default function predlozky() {
  return {
    name: 'ceske-predlozky',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let n = 0;
        for await (const f of htmlSoubory(fileURLToPath(dir))) {
          const html = await readFile(f, 'utf8');
          const out = upravHtml(html);
          if (out !== html) {
            await writeFile(f, out);
            n++;
          }
        }
        logger.info(`Nezlomitelné mezery za předložkami doplněny v ${n} stránkách.`);
      },
    },
  };
}
