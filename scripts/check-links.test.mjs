import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkLinks } from './check-links.mjs';

async function fixture(t, files) {
  const root = await mkdtemp(join(tmpdir(), 'noble-links-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    const file = join(root, name);
    await mkdir(join(file, '..'), { recursive: true });
    await writeFile(file, content);
  }
  return root;
}

test('resolves relative paths, encoded anchors, assets and same-site absolute links', async t => {
  const root = await fixture(t, {
    'index.html': '<link rel="canonical" href="https://nbl.nobleledger.com/clean-url/"><a href="/guide/?q=1#caf%C3%A9">Guide</a><img src="/logo.svg"><a href="https://external.example/missing">External</a>',
    'guide/index.html': '<h2 id="café">Guide</h2><a href="../">Home</a><a href="https://nbl.nobleledger.com/">Home</a>',
    'logo.svg': '<svg/>',
  });
  const result = await checkLinks(root);
  assert.deepEqual(result.failures, []);
  assert.equal(result.checked, 4);
});

test('reports missing pages, assets and anchors', async t => {
  const root = await fixture(t, { 'index.html': '<a href="/missing/">Missing</a><a href="#gone">Anchor</a><script src="/missing.js"></script>' });
  const result = await checkLinks(root);
  assert.equal(result.failures.length, 3);
  assert(result.failures.some(line => line.includes('missing anchor')));
});

test('fails when build output is empty', async t => {
  const root = await fixture(t, {});
  await assert.rejects(checkLinks(root), /No HTML files/);
});
