import { writeToStore } from "./id.js";
import './client';
import { StyleDef } from "./types.js";
import { vi } from "vitest";
import { JSDOM } from 'jsdom';

const matchMedia = vi.fn();
window.matchMedia = matchMedia;

const createElWithStyles = (styles: StyleDef) => {
  const id = writeToStore(styles) as unknown as string;
  const div = document.createElement('div');
  div.setAttribute('css', id);
  return div;
}

const waitMs = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

describe('client', () => {
  it('will apply element styles through the css attribute', () => {
    const div = createElWithStyles({ color: 'red' })
    expect(div.style.color).toBe('red')
  });

  it('handle :hover', () => {
    const div = createElWithStyles({ ':hover': { color: 'red' } })
    
    expect(div.style.color).toBe('')
    
    div.dispatchEvent(new MouseEvent('mouseover'));
    expect(div.style.color).toBe('red');
    
    div.dispatchEvent(new MouseEvent('mouseout'));
    expect(div.style.color).toBe('')
  });

  it('handle @media (not matching)', () => {
    matchMedia.mockReturnValue({
      addEventListener: () => {},
      matches: false,
    })
    const div = createElWithStyles({ '@media (max-width: 200px)': { color: 'red' } })
    
    expect(div.style.color).toBe('')
  });

  it('handle @media (matches)', () => {
    matchMedia.mockReturnValue({
      addEventListener: () => {},
      matches: true,
    })
    const div = createElWithStyles({ '@media (max-width: 200px)': { color: 'red' } })
    
    expect(div.style.color).toBe('red')
  });

  it('handle @media (not matches but changes to match)', async () => {
    matchMedia.mockReturnValue({
      addEventListener: (type, cb) => {
        if (type === 'change') {
          setTimeout(() => {
            cb({ matches: true })
          }, 10)
        }
      },
      matches: false,
    })
    const div = createElWithStyles({ '@media (max-width: 200px)': { color: 'red' } })
    
    expect(div.style.color).toBe('')

    await waitMs(10)

    expect(div.style.color).toBe('red')
  });

  it('handle @media (matches but changes to not match)', async () => {
    matchMedia.mockReturnValue({
      addEventListener: (type, cb) => {
        if (type === 'change') {
          setTimeout(() => {
            cb({ matches: false })
          }, 10)
        }
      },
      matches: true,
    })
    const div = createElWithStyles({ '@media (max-width: 200px)': { color: 'red' } })
    
    expect(div.style.color).toBe('red')

    await waitMs(10)

    expect(div.style.color).toBe('')
  });
})