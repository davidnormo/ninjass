// src/id.ts
var i = 0;
var getId = () => ++i;
var sym = Symbol.for("@ninjass");
var writeToStore = (val) => {
  const id = getId();
  globalThis[sym][id] = val;
  return id;
};

// src/utils.ts
var merge = (target, ...sources) => {
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

// src/client.ts
var isServer = false;
var sym2 = Symbol.for("@ninjass");
var isMediaQuery = (x) => x?.startsWith("@media");
var applyStyles = (el, obj, p, revert = false) => {
  for (let p2 in obj[p]) {
    let val = revert ? obj[p2] : obj[p][p2];
    if (typeof val !== "string") val = "";
    el.style[p2] = val;
  }
};
var addEventListener = "addEventListener";
var getAttribute = "getAttribute";
var setAttribute = "setAttribute";
var stylesHandler = function(el, obj, attrValue) {
  if (el.styled === attrValue) {
    return;
  }
  for (let p in obj) {
    if (p === ":hover") {
      el[addEventListener]("mouseover", () => {
        applyStyles(el, obj, p);
      });
      el[addEventListener]("mouseout", () => {
        applyStyles(el, obj, p, true);
      });
    } else if (isMediaQuery(p)) {
      const query = p.slice(p.indexOf("("));
      const mql = window.matchMedia(query);
      mql[addEventListener]("change", (e) => {
        if (e.matches) {
          applyStyles(el, obj, p);
        } else {
          applyStyles(el, obj, p, true);
        }
      });
      if (mql.matches) {
        applyStyles(el, obj, p);
      }
    } else {
      el.style[p] = obj[p];
    }
  }
  el.styled = attrValue;
};
if (!isServer && !globalThis[sym2]) {
  globalThis[sym2] = {};
  const setAttr = Element.prototype[setAttribute];
  Element.prototype[setAttribute] = function(name, value) {
    if (name === "css") {
      const obj = globalThis[sym2][value];
      delete globalThis[sym2][value];
      stylesHandler(this, obj, obj);
      return;
    }
    setAttr(name, value);
  };
  const mo = new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "childList" && record.addedNodes.length) {
        record.addedNodes.forEach((node) => {
          if (node?.hasAttribute?.("css") && !node.styled) {
            const attr = node[getAttribute]("css");
            const obj = JSON.parse(
              node[getAttribute]("css").replaceAll("`", '"')
            );
            stylesHandler(node, obj, attr);
            node.removeAttribute("css");
          }
        });
      }
    });
  });
  mo.observe(document.documentElement, {
    subtree: true,
    childList: true
  });
}

// src/index.ts
var Wrapper = class {
  constructor(o) {
    this.o = o;
    this.id = writeToStore(this.o);
  }
  valueOf() {
    if (true) {
      return this.id;
    } else {
      return JSON.stringify(this.o).replaceAll('"', "`");
    }
  }
};
var createStyles = (defs, opts) => {
  const out = {};
  for (let p in defs) {
    if (opts?.overrides?.[p]) {
      merge(defs[p], opts?.overrides?.[p].o);
    }
    out[p] = new Wrapper(defs[p]);
  }
  return out;
};
var mergeStyles = (base, ...overrides) => {
  const x = merge({}, base.o, ...overrides.map((x2) => x2?.o));
  return new Wrapper(x);
};
export {
  createStyles,
  mergeStyles
};
