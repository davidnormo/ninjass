import { createStyle, mergeStyles } from "/ninjass.js";

const overrideWrapper = createStyle({
  ":hover": {
    background: "red",
  },
});

const wrapper = createStyle({
  width: "100px",
  height: "100px",
  background: "green",
  ":hover": {
    background: "purple",
  },
  "@media (max-width: 500px)": {
    width: "100%",
  },
});

const Comp = () => {
  const [count, setCount] = React.useState(0);

  const count3 = createStyle(
    count > 2
      ? {
          background: "yellow",
          ":hover": {
            background: "yellow",
          },
        }
      : {}
  );

  return React.createElement("div", {
    onClick: () => console.log("yes", count) || setCount((n) => n + 1),
    css: mergeStyles(wrapper, overrideWrapper, count3),
  });
};

ReactDOM.createRoot(document.querySelector("#root")).render(
  React.createElement(Comp)
);
