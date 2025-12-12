import { useMemo } from "react";
import { __getLatestId, __reset } from "./id.ts";
import { createStyle, mergeStyles } from "./index.ts";
import { render, screen } from "@testing-library/react";

beforeEach(() => {
  __reset();
});

const sym = Symbol.for("@ninjass");

describe("component test", () => {
  const Test = () => {
    const css = useMemo(() => ({ color: "red" }), []);

    return (
      <div data-testid="test" css={createStyle(css)}>
        hello
      </div>
    );
  };

  it("on rerender, doesn't update if the style hasn't changed", () => {
    const { rerender } = render(<Test />);

    expect(__getLatestId()).toBe(1);
    expect(screen.getByTestId("test").style.color).toBe("red");

    rerender(<Test />);

    expect(__getLatestId()).toBe(1);
    expect(screen.getByTestId("test").style.color).toBe("red");
  });
});

describe("createStyle", () => {
  it("returns an object with the same keys", () => {
    const styles = createStyle({
      color: "red",
    });
    expect(styles).toEqual(__getLatestId());
  });

  it("getting the value of the styles returns it's id", () => {
    const styles = createStyle({
      color: "red",
    });

    const id = styles.valueOf();
    expect(id).toBe(1);

    expect(globalThis[sym][id]).toEqual(
      expect.objectContaining({
        color: "red",
      })
    );
  });

  it("on the server, the value is stringified", () => {
    global.self = undefined;
    const styles = createStyle({
      color: "red",
    });

    const id = styles.valueOf();
    expect(id).toBe("{`color`:`red`}");
  });
});

describe("mergeStyles", () => {
  it("merges styles together", () => {
    const s1 = {
      color: "red",
      fontSize: "12px",
    };

    const s2 = {
      color: "green",
      padding: "5px",
    };

    const s3 = mergeStyles(s1, s2);
    expect(s3).toEqual({
      color: "green",
      fontSize: "12px",
      padding: "5px",
    });
  });

  it("deep merges styles together", () => {
    const s1 = {
      color: "red",
      ":hover": {
        color: "green",
        background: "#000",
      },
    };

    const s2 = {
      color: "green",
      ":hover": {
        color: "red",
      },
    };

    const s3 = mergeStyles(s1, s2);
    expect(s3).toEqual({
      color: "green",
      ":hover": {
        color: "red",
        background: "#000",
      },
    });
  });
});
