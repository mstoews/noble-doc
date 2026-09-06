import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'parse5';

async function htmlFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const groups = await Promise.all(entries.map(async (entry) => {
    const path = resolve(root, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  }));
  return groups.flat();
}

function inspect(html) {
  const ids = new Set();
  const refs = [];
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
    if (attrs.id) ids.add(attrs.id);
    if (node.tagName === 'a' && attrs.name) ids.add(attrs.name);
    // Canonical/alternate metadata describes indexing, not a fetched resource.
    if (node.tagName === 'link' && /^(canonical|alternate)$/.test(attrs.rel ?? '')) return;
    const attribute = ['a', 'link'].includes(node.tagName) ? 'href'
      : ['img', 'script', 'source', 'video', 'audio', 'iframe'].includes(node.tagName) ? 'src' : null;
    if (attribute && attrs[attribute]) refs.push(attrs[attribute]);
    for (const child of node.childNodes ?? []) visit(child);
  }
  visit(parse(html));
  return { ids, refs };
}

/** Audit generated HTML without network access. External URLs and srcset are excluded. */
export async function checkLinks(directory, site = 'https://nbl.nobleledger.com') {
  const root = resolve(directory);
  const files = await htmlFiles(root);
  if (!files.length) throw new Error('No HTML files found. Run npm run build first.');
  const pages = new Map(await Promise.all(files.map(async file => [file, inspect(await readFile(file, 'utf8'))])));
  const failures = new Set();
  let checked = 0;
  for (const [file, { refs }] of pages) {
    const route = '/' + relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
    for (const ref of refs) {
      let url;
      try { url = new URL(ref, new URL(route, site)); }
      catch { failures.add(`${relative(root, file)}: invalid URL ${ref}`); continue; }
      if (url.origin !== new URL(site).origin) continue;
      checked++;
      let target;
      let fragment;
      try {
        target = resolve(root, '.' + decodeURIComponent(url.pathname));
        fragment = decodeURIComponent(url.hash.slice(1));
      } catch { failures.add(`${relative(root, file)}: invalid encoding ${ref}`); continue; }
      if (target !== root && !target.startsWith(root + sep)) {
        failures.add(`${relative(root, file)}: path escapes output ${ref}`); continue;
      }
      try {
        if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
        if (!(await stat(target)).isFile()) throw new Error('not a file');
      } catch { failures.add(`${relative(root, file)}: missing target ${ref}`); continue; }
      if (fragment && pages.has(target) && !pages.get(target).ids.has(fragment)) {
        failures.add(`${relative(root, file)}: missing anchor ${ref}`);
      }
    }
  }
  return { pages: files.length, checked, failures: [...failures].sort() };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const result = await checkLinks(process.argv[2] ?? 'dist');
    if (result.failures.length) {
      console.error(result.failures.join('\n'));
      process.exitCode = 1;
    }
    console.log(`${result.pages} HTML pages, ${result.checked} local references, ${result.failures.length} failures.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
