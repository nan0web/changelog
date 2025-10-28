/**
 * @typedef {object} ChangeData
 * @property {string} [content]
 */
export default class Change extends MDListItem {
    /**
     * Creates Change from input
     * @param {ChangeData | string} input
     * @returns {Change}
     */
    static from(input: ChangeData | string): Change;
    /**
     * Creates Change from markdown string
     * @param {string} content
     * @returns {Change}
     */
    static fromElementString(content: string): Change;
}
export type ChangeData = {
    content?: string | undefined;
};
import { MDListItem } from "@nan0web/markdown";
