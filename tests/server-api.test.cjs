const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Dummy stand-in for any UI component import (default or named). Props pass
// through JSX element creation, so assertions can still inspect them.
const DummyComponent = () => null;

function stubModule(name, fetch, configuredApi) {
  // Faithful stub of src/lib/api.ts: same URL joining and GET/HEAD retry on
  // 5xx, but driven by the injected fetch and the configured base URL.
  if (name === '@/src/lib/api' || name.endsWith('/lib/api')) {
    class ApiError extends Error {
      constructor(message, url, status) {
        super(message);
        this.name = 'ApiError';
        this.url = url;
        this.status = status;
      }
    }
    const apiFetch = async (path, init = {}) => {
      const url = /^https?:\/\//i.test(path) ? path : `${configuredApi}${path}`;
      const method = (init.method || 'GET').toUpperCase();
      const attempts = method === 'GET' || method === 'HEAD' ? 2 : 1;
      let lastError = null;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
          const response = await fetch(url, init);
          if (response.status >= 500 && attempt < attempts - 1) continue;
          return response;
        } catch (error) {
          lastError = error;
          if (attempt < attempts - 1) continue;
          throw new ApiError(`Request failed to reach: ${url}`, url);
        }
      }
      throw lastError instanceof Error ? lastError : new ApiError(`Request failed: ${url}`, url);
    };
    const fetchJson = async (path, init = {}) => {
      const response = await apiFetch(path, init);
      if (!response.ok) {
        throw new ApiError(`Request failed with status ${response.status}`, response.url, response.status);
      }
      return response.json();
    };
    return {
      __esModule: true,
      default: {},
      apiFetch,
      fetchJson,
      getApiServer: () => configuredApi,
      ApiError,
    };
  }
  return new Proxy(
    { __esModule: true },
    {
      get(target, prop) {
        if (prop === '__esModule' || prop === 'then') return target[prop];
        if (typeof prop === 'symbol') return undefined;
        return DummyComponent;
      },
    },
  );
}

// Execute real server-page logic with fetch and client components isolated.
// No Next server, dotenv, database, or external requests are involved.
function loadPage(relativePath, fetch, configuredApi = 'http://127.0.0.1:5199') {
  const filename = path.join(__dirname, '..', 'src', 'app', relativePath, 'page.tsx');
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports, setTimeout, clearTimeout, AbortController,
    process: { env: { NEXT_PUBLIC_API_SERVER: configuredApi } },
    require(name) {
      if (name === 'react/jsx-runtime') return require(name);
      if (name === 'next/navigation') return { notFound() { throw new Error('NOT_FOUND'); } };
      if (name === 'react') return require(name);
      return stubModule(name, fetch, configuredApi);
    },
  }, { filename });
  return exports;
}

const scenarios = {
  unavailable: () => Promise.resolve(new Response('{}', { status: 503 })),
  empty: () => Promise.resolve(Response.json({ data: [] })),
  disconnected: () => Promise.reject(new Error('Fixture connection refused')),
};

for (const route of ['blog/[slug]', 'leaderboard', 'hall-of-fame']) {
  for (const [scenario, respond] of Object.entries(scenarios)) {
    test(`${route}: ${scenario} never falls through the explicitly configured API`, async () => {
      const requested = [];
      const page = loadPage(route, async (url) => { requested.push(url); return respond(); });
      const props = { params: { slug: 'fixture-missing-post' } };
      if (page.generateMetadata) await page.generateMetadata(props);
      // blog/[slug] maps any failure to notFound(); hall-of-fame throws on
      // failure (route error.tsx + retry) but renders honest empty on ok-empty;
      // leaderboard degrades to an honest error flag instead of throwing.
      const mustThrow = route === 'blog/[slug]' || (route === 'hall-of-fame' && scenario !== 'empty');
      let threw = null;
      try {
        await page.default(props);
      } catch (error) {
        threw = error;
      }
      assert.equal(!!threw, mustThrow);
      if (threw && route === 'blog/[slug]') assert.equal(threw.message, 'NOT_FOUND');
      assert.ok(requested.length > 0);
      assert.deepEqual([...new Set(requested.map((url) => new URL(url).origin))], ['http://127.0.0.1:5199']);
    });
  }
}

test('leaderboard distinguishes empty success from a failed request', async () => {
  for (const [scenario, respond] of Object.entries(scenarios)) {
    const page = loadPage('leaderboard', respond);
    const result = await page.default();
    assert.equal(result.props.children.props.hasLoadError, scenario !== 'empty');
  }
});

test('blog metadata and detail use the configured successful response', async () => {
  const post = { title: 'Fixture post', excerpt: 'Fixture excerpt', content: '# Fixture' };
  const page = loadPage('blog/[slug]', async () => Response.json({ data: post }));
  const props = { params: { slug: 'fixture-post' } };
  const metadata = await page.generateMetadata(props);
  assert.equal(metadata.title, 'Fixture post | FU-DEVER Tech Blog');
  const result = await page.default(props);
  assert.equal(result.props.post.title, post.title);
});
