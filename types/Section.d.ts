/** @typedef {import("@nan0web/markdown/types/MDElement.js").MDElementProps} MDElementProps */
/**
 * @typedef {Object} SectionProps
 * @property {Array<Partial<Change> | string>} [added=[]]
 * @property {Array<Partial<Change> | string>} [changed=[]]
 * @property {Array<Partial<Change> | string>} [deprecated=[]]
 * @property {Array<Partial<Change> | string>} [removed=[]]
 * @property {Array<Partial<Change> | string>} [fixed=[]]
 * @property {Array<Partial<Change> | string>} [security=[]]
 */
export default class Section extends MDHeading3 {
    static ADDED: string;
    static CHANGED: string;
    static DEPRECATED: string;
    static REMOVED: string;
    static FIXED: string;
    static SECURITY: string;
    static ALL: string[];
    /**
     * @param {object | string} input
     * @returns {Section}
     */
    static from(input: object | string): Section;
    /**
     *
     * @param {MDElementProps & SectionProps | string} input
     */
    constructor(input?: (MDElementProps & SectionProps) | string);
    /**
     * Add a change item to this section
     * @param {Partial<Change> | string | MDElement} change
     * @returns {this}
     */
    add(change: Partial<Change> | string | MDElement): this;
}
export type MDElementProps = import("@nan0web/markdown/types/MDElement.js").MDElementProps;
export type SectionProps = {
    added?: (string | Partial<Change>)[] | undefined;
    changed?: (string | Partial<Change>)[] | undefined;
    deprecated?: (string | Partial<Change>)[] | undefined;
    removed?: (string | Partial<Change>)[] | undefined;
    fixed?: (string | Partial<Change>)[] | undefined;
    security?: (string | Partial<Change>)[] | undefined;
};
import { MDHeading3 } from "@nan0web/markdown";
import Change from "./Change.js";
import { MDElement } from "@nan0web/markdown";
