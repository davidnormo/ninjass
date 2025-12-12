export type StyledElement = HTMLElement & { styled?: any };

export type StyleDef = {
  [sym: symbol]: number;
  [k: string]: unknown;
} & {
  ":hover"?: {
    [k: string]: string;
  };
  [mediaQuery: `@media (${string})`]: {
    [k: string]: string;
  };
};
