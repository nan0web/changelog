/**
 * Changelog class extends Markdown to work specifically with CHANGELOG.md files
 */
export default class Changelog extends Markdown {
    constructor(input?: {});
    /** @type {Map<string, MDElement>} */
    versions: Map<string, MDElement>;
    title: MDHeading1;
    t: (str: any, repl: any) => any;
    /**
     * Get all versions from changelog in the order they appear in the file
     * @returns {string[]} - Array of version strings
     */
    getVersions(): string[];
    /**
     * Get changelog entry for specific version
     * @param {string} version - Version to retrieve
     * @returns {object|null} - Version entry with date and changes or null if not found
     */
    get(version: string): object | null;
    /**
     * Add a new version entry to the changelog.
     *
     * The method now always inserts **three** elements at the top of the document:
     *
     * 1. A horizontal rule (`---`).
     * 2. An empty paragraph (placeholder for future description).
     * 3. The version heading (`## [x.y.z] - YYYY‑MM‑DD`).
     *
     * This matches the original test expectation of `+3` elements.
     *
     * @param {string} version - Version string (e.g. "1.3.0")
     * @param {object} [options] - Additional options.
     * @param {string} [options.date] - Date for the version entry (defaults to today).
     */
    addVersion(version: string, options?: {
        date?: string | undefined;
    } | undefined): void;
    /**
     * Add a Change instance to the appropriate position in the changelog
     * @param {Change} change - The Change instance to add
     */
    addChange(change: Change): void;
    /**
     * Get the latest version from changelog (oldest entry in the file)
     * @returns {string|null} - Latest version (prefixed with "v") or null if not found
     */
    getLatestVersion(): string | null;
    /**
     * Get the most recent version (newest entry in the file)
     * @returns {string|null}
     */
    getRecentVersion(): string | null;
    /**
     * Initialize a new changelog document with required heading elements
     */
    init(): void;
}
import Markdown from "@nan0web/markdown";
import { MDElement } from "@nan0web/markdown";
import { MDHeading1 } from "@nan0web/markdown";
import Change from "./Change.js";
