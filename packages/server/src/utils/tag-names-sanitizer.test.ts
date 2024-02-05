// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, expect } from 'vitest';
import { tagNamesSanitizer } from './tag-names-sanitizer';

describe('tagNamesSanitizer', () => {
  it('should trim whitespace from names', () => {
    const input = `foo , bar , baz`;
    const expected = ['foo', 'bar', 'baz'];

    expect(tagNamesSanitizer(input)).toEqual(expected);
  });

  it('should remove empty names', () => {
    const input = `foo ,  , bar, `;
    const expected = ['foo', 'bar'];

    expect(tagNamesSanitizer(input)).toEqual(expected);
  });

  it('should remove duplicate names', () => {
    const input = `foo , foo , bar, foo`;
    const expected = ['foo', 'bar'];

    expect(tagNamesSanitizer(input)).toEqual(expected);
  });

  it('should handle newlines', () => {
    const input = `foo,
     bar 
     baz, foo, bar
  `;
    const expected = ['foo', 'bar', 'baz'];

    expect(tagNamesSanitizer(input)).toEqual(expected);
  });
});
