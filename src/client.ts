import { StyleDef, StyledElement } from "./types.js";

const isServer = typeof self === "undefined";

const sym = Symbol.for("@ninjass");

const isMediaQuery = (x: any): x is `@media (${string})` =>
  x?.startsWith("@media");

const applyStyles = (el, obj, p, revert = false) => {
  for (let p2 in obj[p]) {
    let val = revert ? obj[p2] : obj[p][p2];
    if (typeof val !== "string") val = "";
    el.style[p2] = val;
  }
};

// Saving a few bytes by holding a function name as a string
// so the variable name can be minified. This helps if the fn is
// used more than once.
const addEventListener = "addEventListener";
const getAttribute = "getAttribute";
const setAttribute = "setAttribute";

/**
 * Internal API
 */

const stylesHandler = function (
  el: StyledElement,
  obj: StyleDef,
  attrValue: any
) {
  if (el.styled === attrValue) {
    return;
  }

  for (let p in obj) {
    // 1. TODO handle other pseudo classes
    // 2. TODO for non-basic styles, defer until js bundle has loaded...
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

if (!isServer && !globalThis[sym]) {
  globalThis[sym] = {};

  const setAttr = Element.prototype[setAttribute];
  Element.prototype[setAttribute] = function (name, value) {
    if (name === "css") {
      const obj = globalThis[sym][value];
      delete globalThis[sym][value];
      stylesHandler(this, obj, obj);
      return;
    }

    setAttr(name, value);
  };

  const mo = new MutationObserver((records) => {
    // TODO will a for loop save more bytes than forEach?
    records.forEach((record) => {
      if (record.type === "childList" && record.addedNodes.length) {
        record.addedNodes.forEach((node: StyledElement) => {
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
    childList: true,
  });
}
