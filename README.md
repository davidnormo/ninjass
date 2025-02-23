# ninjass (Inline JS CSS)

A tiny, no compile, high performance, css-in-js library that uses inline styles.

## To consider

- ~~Which attribute name to use? `styles` is too close to `style` which may cause confusion~~
- ~~Is there a way to avoid serialising then deserialising?~~
- What API should be exposed? i.e. meta library or not
  - ~~APIs to define in or out component styles would be nice~~ (just use native `style` in this case)
  - ~~Also being about to compose these together~~
- Typescript
- Can it be optimised so same styles aren't applied? Even at React level?

## To explore

- Server Side Rendering ✅
  - Client side ✅
  - Server side ✅
- :hover ✅
- css variables ✅
- :after/:before 🤔
  - just add extra elements to the component
- media queries ✅
- keyframe animations 🤔
  - add the @keyframe rule to the dom and use `animation`
- auto vendor prefixing 🤔
  - Possible but there's only a small number of less commonly used properties that require vendor prefixing
- :is/:not/:has/:where/:nth-child 🤔
  - Probably not needed...?
- :focus
- :checked
- :enabled/:disabled
- :required/:optional
- :valid/:invalid
