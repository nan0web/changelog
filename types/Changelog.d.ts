/**
 * Changelog class extends Markdown to work specifically with CHANGELOG.md files
 */
export default class Changelog extends Markdown {
    constructor(input?: {});
    /** @type {Map<string, Version>} */
    versions: Map<string, Version>;
    title: MDHeading1;
    t: (str: any, repl: any) => any;
    /**
     * Get all versions from changelog in the order they appear in the file
     * @returns {string[]} - Array of version strings
     */
    getVersions(): string[];
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
     * @returns {Version} - The created version object
     */
    addVersion(version: string, options?: {
        date?: string | undefined;
    } | undefined): Version;
    /**
     * Get changelog entry for specific version
     * @param {string} version - Version to retrieve
     * @returns {Version|null} - Version object or null if not found
     */
    getVersion(version: string): Version | null;
    /**
     * Get the latest version from changelog (last in file)
     * @returns {Version | undefined} - Latest version or undefined if not found
     */
    getLatestVersion(): Version | undefined;
    /**
     * Get the most recent version (newest entry in the file)
     * @returns {Version | undefined}
     */
    getRecentVersion(): Version | undefined;
    /**
     * Initialize a new changelog document with required heading elements
     */
    init(): void;
}
import Markdown from "@nan0web/markdown";
import Version from "./Version.js";
import { MDHeading1 } from "@nan0web/markdown";
