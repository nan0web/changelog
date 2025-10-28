import { MDListItem } from "@nan0web/markdown"

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
	static from(input) {
		if (input instanceof Change) return input
		if ("string" === typeof input) return this.fromElementString(input)
		return new Change(input)
	}

	/**
	 * Creates Change from markdown string
	 * @param {string} content
	 * @returns {Change}
	 */
	static fromElementString(content) {
		// Remove leading dash and space if present
		const cleanContent = content.replace(/^-\s*/, '')
		return new Change({ content: cleanContent })
	}
}
