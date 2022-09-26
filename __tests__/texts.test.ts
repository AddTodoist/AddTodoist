import { describe, it, expect, vi } from 'vitest';
import {getProjectNumFromMessage} from '../src/utils/texts';

vi.mock('@bugsnag/js', () => {
  return { default: {start: vi.fn()} };
});

vi.mock('twitter-api-v2', () => {
  return { TwitterApi: vi.fn() };
});

describe('getProjectNumFromMessage', () => {
  it('returns null if message is empty | undefined | null', () => {
    expect(getProjectNumFromMessage('')).toBeNull();
    // @ts-expect-error This breaks TS as it spects a string
    expect(getProjectNumFromMessage()).toBeNull();
    // @ts-expect-error This breaks TS as it spects a string
    expect(getProjectNumFromMessage(undefined)).toBeNull();
    // @ts-expect-error This breaks TS as it spects a string
    expect(getProjectNumFromMessage(null)).toBeNull();
    // @ts-expect-error This breaks TS as it spects a string
    expect(getProjectNumFromMessage(1)).toBeNull();
  });

  it('returns null if message is incorrect', () => {
    expect(getProjectNumFromMessage('1')).toBeNull();
    expect(getProjectNumFromMessage('project 1')).toBeNull();
    expect(getProjectNumFromMessage('/project 1 and more')).toBeNull();
    expect(getProjectNumFromMessage(' 1')).toBeNull();
  });

  it('returns a number if message is correct', () => {
    expect(getProjectNumFromMessage('/project 1')).toEqual(1);
    expect(getProjectNumFromMessage('/project 0')).toEqual(0);
  });

});
