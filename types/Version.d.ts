/**
 * @typedef {string | object} VersionInput
 * @property {number} [major=0]
 * @property {number} [minor=0]
 * @property {number} [patch=0]
 * @property {Date | string} [date=new Date()]
 * @property {MDElement[]} [children=[]]
 * @property {string} [content=""]
 */
export default class Version extends MDHeading2 {
    /**
     * Creates Version from input
     * @param {VersionInput} input
     * @returns {Version}
     */
    static from(input: VersionInput): Version;
    /**
     * @param {VersionInput} [input]
     */
    constructor(input?: VersionInput);
    /** @type {number} */
    major: number;
    /** @type {number} */
    minor: number;
    /** @type {number} */
    patch: number;
    /** @type {Date} */
    date: Date;
    children: any;
    /**
     * @returns {string}
     */
    get ver(): string;
    /**
     * @param {Section} section
     */
    add(section: Section): this;
    /**
     * @returns {string}
     */
    getContent(): string;
    /**
     * @param {string} input
     */
    setContent(input: string): void;
    /**
     * Checks if version is higher than other version
     * @param {VersionInput} version
     * @returns {boolean}
     */
    higherThan(version: VersionInput): boolean;
    /**
     * Checks if version is lower than other version
     * @param {VersionInput} version
     * @returns {boolean}
     */
    lowerThan(version: VersionInput): boolean;
    /**
     * Checks if version is acceptable for other version (>= other)
     * @param {VersionInput} version
     * @returns {boolean}
     */
    acceptableTo(version: VersionInput): boolean;
    /**
     * @param {object} [input]
     * @param {number} [input.indent=0]
     * @param {string} [input.format=".md"]
     * @param {boolean} [input.skipPrefix=false]
     * @returns {string}
     */
    toString(input?: {
        indent?: number | undefined;
        format?: string | undefined;
        skipPrefix?: boolean | undefined;
    } | undefined): string;
}
export type VersionInput = string | object;
import { MDHeading2 } from "@nan0web/markdown";
import Section from "./Section.js";
