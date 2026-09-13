import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBookmark, loadBookmarks, normalizeUrl } from '../src/lib/bookmarks.ts';

test('normalizes URLs with and without https to the same value', () => {
  assert.equal(normalizeUrl('www.example.com'), normalizeUrl('https://www.example.com'));
});

test('recovers from empty, corrupted, legacy, and non-array storage values', () => {
  assert.deepEqual(loadBookmarks(null), []);
  assert.deepEqual(loadBookmarks(''), []);
  assert.deepEqual(loadBookmarks('{not-json'), []);
  assert.deepEqual(loadBookmarks(JSON.stringify({ url: 'https://example.com', slug: 'mona-old' })), []);
  assert.deepEqual(loadBookmarks(JSON.stringify(['legacy string'])), []);
  assert.deepEqual(loadBookmarks(JSON.stringify([
    { url: 'https://example.com', slug: 'mona-7fk2' },
    { url: 42, slug: 'mona-bad' },
    { url: 'https://example.org', slug: '' },
  ])), [{ url: 'https://example.com', slug: 'mona-7fk2' }]);
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
