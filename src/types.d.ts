export type StyledElement = HTMLElement & {
    styled?: any;
};
export type StyleDef = {
    [k: string]: unknown;
} & {
    ":hover"?: {
        [k: string]: string;
    };
    [mediaQuery: `@media (${string})`]: {
        [k: string]: string;
    };
};
