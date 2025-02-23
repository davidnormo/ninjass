import { __reset } from "./id.js";
import { createStyles, mergeStyles } from "./index.js";
import {vi} from 'vitest';

beforeEach(() => {
  __reset();
});

const sym = Symbol.for('@ninjass');

describe('createStyles', () => {
  it('returns an object with the same keys', () => {
    vi.stubEnv('IS_SERVER', 'false');
    const styles = createStyles({
      root: {
        color: 'red'
      }
    });
    expect(styles).toEqual({
      root: expect.any(Object)
    });
  });

  it('on the client getting the value of the styles returns it\'s id', () => {
    vi.stubEnv('IS_SERVER', 'false');
    const styles = createStyles({
      root: {
        color: 'red'
      }
    });

    const id = styles.root.valueOf();
    expect(id).toBe(1);
    
    expect(globalThis[sym][id]).toEqual({
      color: 'red'
    })
  });

  it('on the server, the value is stringified', () => {
    vi.stubEnv('IS_SERVER', 'true');
    const styles = createStyles({
      root: {
        color: 'red'
      }
    });

    const id = styles.root.valueOf();
    expect(id).toBe('{`color`:`red`}');
  })
});

describe('mergeStyles', () => {
  it('merges styles together (client)', () => {
    vi.stubEnv('IS_SERVER', 'false');
    const s1 = createStyles({
      root: {
        color: 'red',
        fontSize: '12px',
      }
    });

    const s2 = createStyles({
      root: {
        color: 'green',
        padding: '5px',
      }
    });

    const id = mergeStyles(s1.root, s2.root)+'';
    expect(globalThis[sym][id]).toEqual({
      color: 'green',
      fontSize: '12px',
      padding: '5px'
    })
  });

  it('deep merges styles together (client)', () => {
    vi.stubEnv('IS_SERVER', 'false');
    const s1 = createStyles({
      root: {
        color: 'red',
        ':hover': {
          color: 'green',
          background: '#000'
        }
      }
    });

    const s2 = createStyles({
      root: {
        color: 'green',
        ':hover': {
          color: 'red'
        }
      }
    });

    const id = mergeStyles(s1.root, s2.root)+'';
    expect(globalThis[sym][id]).toEqual({
      color: 'green',
      ':hover': {
        color: 'red',
        background: '#000'
      }
    })
  });

  it('merges styles together (server)', () => {
    vi.stubEnv('IS_SERVER', 'true');
    const s1 = createStyles({
      root: {
        color: 'red',
        fontSize: '12px',
      }
    });

    const s2 = createStyles({
      root: {
        color: 'green',
        padding: '5px',
      }
    });

    const css = mergeStyles(s1.root, s2.root)+'';
    expect(css).toBe('{`color`:`green`,`fontSize`:`12px`,`padding`:`5px`}')
  });

  it('deep merges styles together (server)', () => {
    vi.stubEnv('IS_SERVER', 'true');
    const s1 = createStyles({
      root: {
        color: 'red',
        ':hover': {
          color: 'green',
          background: '#000'
        }
      }
    });

    const s2 = createStyles({
      root: {
        color: 'green',
        ':hover': {
          color: 'red'
        }
      }
    });

    const css = mergeStyles(s1.root, s2.root)+'';
    expect(css).toEqual('{`color`:`green`,`:hover`:{`color`:`red`,`background`:`#000`}}')
  });
});