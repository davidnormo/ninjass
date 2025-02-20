const isServer = typeof window === "undefined";
let i = 0;

globalThis.__styles = {};

type StyledElement = HTMLElement & { styled?: any };

type StyleDef = {
  ":hover"?: {
    [k: string]: string;
  };
  [mediaQuery: `@media (${string})`]: {
    [k: string]: string;
  };
} & {
  [k: string]: string;
}

const isMediaQuery = (x: any): x is `@media (${string})` => x?.startsWith('@media');

/**
 * Internal API
 */

const stylesHandler = function (el: StyledElement, obj: StyleDef, attrValue: any) {
  if (el.styled === attrValue) {
    return;
  }

  for (let p in obj) {
    // TODO handle other pseudo classes
    if (p === ":hover") {
      el.addEventListener("mouseover", () => {
        for (let p2 in obj[p]) {
          el.style[p2] = obj[p][p2];
        }
      });
      el.addEventListener("mouseout", () => {
        for (let p2 in obj[p]) {
          el.style[p2] = obj[p2];
        }
      });
    } else if (isMediaQuery(p)) {
      const query = p[6] === " " ? p.slice(7) : p.slice(6);
      const mql = window.matchMedia(query);
      mql.addEventListener("change", (e) => {
        if (e.matches) {
          for (let p2 in obj[p]) {
            el.style[p2] = obj[p][p2];
          }
        } else {
          for (let p2 in obj[p]) {
            el.style[p2] = obj[p2];
          }
        }
      });
      if (mql.matches) {
        for (const p2 in obj[p]) {
          el.style[p2] = obj[p][p2];
        }
      }
    } else {
      el.style[p] = obj[p];
    }
  }
  el.styled = attrValue;
};

if (!isServer) {
  const setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    if (name === "css") {
      const obj = globalThis.__styles[value];
      delete globalThis.__styles[value];
      stylesHandler(this, obj, obj);
      return;
    }

    setAttr(name, value);
  };

  const mo = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "childList" && record.addedNodes.length) {
        record.addedNodes.forEach((node: StyledElement) => {
          if (node?.hasAttribute?.("css") && !node.styled) {
            const attr = node.getAttribute("css");
            const obj = JSON.parse(
              node.getAttribute("css").replaceAll("`", '"')
            );
            stylesHandler(node, obj, attr);
            node.removeAttribute("css");
          }
        });
      }
      //  else if (record.type === "attributes") {
      //   if (!record.target.styled) record.target.getAttribute("css");
      // }
    });
  });
  mo.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributeFilter: ["css"],
  });
}

class Wrapper {
  o: StyleDef;

  constructor(o) {
    this.o = o;
  }
  valueOf() {
    if (!isServer) {
      const id = ++i;
      globalThis.__styles[id] = this.o;
      return id;
    } else {
      return JSON.stringify(this.o).replaceAll('"', "`");
    }
  }
}

/**
 * Simple deep merge, only handles nested plain objects :)
 */
const merge = (target, ...sources) => {
  for (let s of sources) {
    for (let p in s) {
      if (typeof s[p] === "object" && typeof target[p] === "object") {
        merge(target[p], s[p]);
      } else {
        target[p] = s[p];
      }
    }
  }
  return target;
};

/**
 * Public API
 */

export const createStyles = (defs, opts) => {
  const out = {};

  for (let p in defs) {
    if (opts?.overrides?.[p]) {
      // TODO merge nested objects like :hover
      merge(defs[p], opts?.overrides?.[p].o);
    }

    out[p] = new Wrapper(defs[p]);
  }

  return out;
};

export const mergeStyles = (base, ...overrides) => {
  const x = merge({}, base.o, ...overrides.map((x) => x?.o));
  return new Wrapper(x);
};