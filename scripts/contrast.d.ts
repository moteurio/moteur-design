// The contrast checker's measuring functions, for apps that check colour pairs of their own.

/** WCAG contrast of fg on bg, both hex, rgb() or rgba(). A see-through fg is laid over bg first. */
export declare function ratio(fg: string, bg: string): number;
/** A ratio rounded down to one decimal, as text: 4.5 is never really 4.49. */
export declare function shown(ratio: number): string;
