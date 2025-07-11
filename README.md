# ninjass 🥷

_meaning: inline css-in-js_

![gzipped size](https://img.shields.io/badge/GZip_size-825_B-44cc11?logo=javascript&cacheSeconds=31536000)

A **tiny**, no compile, high performance, css-in-js library that uses inline styles.

```sh
npm i --save ninjass
```

## Usage

```ts
import { createStyle } from "ninjass";

// A react example...
const MyComponent = () => {
  return (
    <div
      css={createStyle({
        color: "green",
        ":hover": { color: "red" },
      })}
    >
      Hello world!
    </div>
  );
};
```

![helloworld](./helloworld.gif)

## Features

- Server Side Rendering ✅
- `:hover` ✅
- css variables ✅
- media queries ✅
- :focus 🚧
- :checked 🚧
- :enabled/:disabled 🚧
- :required/:optional 🚧
- :valid/:invalid 🚧

### Unsupported

- :after/:before 🤔
  - Just add extra elements to the dom
- keyframe animations 🤔
  - add the @keyframe rule to the dom and use `animation`
- auto vendor prefixing 🤔
  - Possible but there's only a small number of less commonly used properties that require vendor prefixing these days...
- :is/:not/:has/:where/:nth-child 🤔
  - Probably not needed...?
