import { __reset } from "./id.js";
import { createStyle, mergeStyles } from "./index.js";
import {vi} from 'vitest';

beforeEach(() => {
  __reset();
});

const sym = Symbol.for('@ninjass');

describe('createStyle', () => {
  it('returns an object with the same keys', () => {
    vi.stubEnv('IS_SERVER', 'false');
    const styles = createStyle({
        color: 'red'
    });
    expect(styles).toEqual(expect.any(Object));
  });

  it('on the client getting the value of the styles returns it\'s id', () => {
    vi.stubEnv('IS_SERVER', 'false');
    const styles = createStyle({
        color: 'red'
    });

    const id = styles.valueOf();
    expect(id).toBe(1);
    
    expect(globalThis[sym][id]).toEqual({
      color: 'red'
    })
  });

  it('on the server, the value is stringified', () => {
    vi.stubEnv('IS_SERVER', 'true');
    const styles = createStyle({
        color: 'red'
    });

    const id = styles.valueOf();
    expect(id).toBe('{`color`:`red`}');
  })
});

describe('mergeStyles', () => {
  it('merges styles together (client)', () => {
    vi.stubEnv('IS_SERVER', 'false');
    const s1 = createStyle({
        color: 'red',
        fontSize: '12px',
    });

    const s2 = createStyle({
        color: 'green',
        padding: '5px',
    });

    const id = mergeStyles(s1, s2)+'';
    expect(globalThis[sym][id]).toEqual({
      color: 'green',
      fontSize: '12px',
      padding: '5px'
    })
  });

  it('deep merges styles together (client)', () => {
    vi.stubEnv('IS_SERVER', 'false');
    const s1 = createStyle({
      color: 'red',
      ':hover': {
        color: 'green',
        background: '#000'
      }
    });

    const s2 = createStyle({
      color: 'green',
      ':hover': {
        color: 'red'
      }
    });

    const id = mergeStyles(s1, s2)+'';
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
    const s1 = createStyle({
      color: 'red',
      fontSize: '12px',
    });

    const s2 = createStyle({
      color: 'green',
      padding: '5px',
    });

    const css = mergeStyles(s1, s2)+'';
    expect(css).toBe('{`color`:`green`,`fontSize`:`12px`,`padding`:`5px`}')
  });

  it('deep merges styles together (server)', () => {
    vi.stubEnv('IS_SERVER', 'true');
    const s1 = createStyle({
        color: 'red',
        ':hover': {
          color: 'green',
          background: '#000'
        }
    });

    const s2 = createStyle({
        color: 'green',
        ':hover': {
          color: 'red'
        }
    });

    const css = mergeStyles(s1, s2)+'';
    expect(css).toEqual('{`color`:`green`,`:hover`:{`color`:`red`,`background`:`#000`}}')
  });
});