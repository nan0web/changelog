import { MDHeading3, MDList, MDElement } from "@nan0web/markdown"
import Change from "./Change.js"

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
	static ADDED = "Added"
	static CHANGED = "Changed"
	static DEPRECATED = "Deprecated"
	static REMOVED = "Removed"
	static FIXED = "Fixed"
	static SECURITY = "Security"
	static ALL = [
		Section.ADDED,
		Section.CHANGED,
		Section.DEPRECATED,
		Section.REMOVED,
		Section.FIXED,
		Section.SECURITY,
	]
	/**
	 *
	 * @param {MDElementProps & SectionProps | string} input
	 */
	constructor(input = {}) {
		if ("string" === typeof input) {
			const content = Section[input.toUpperCase()]
			if (!content) {
				throw new TypeError(["Undefined section", input].join(": "))
			}
			input = { content }
		}
		super(input)
		const {
			added = [],
			changed = [],
			deprecated = [],
			removed = [],
			fixed = [],
			security = [],
		} = input
		added.forEach(el => this.add(el))
		changed.forEach(el => this.add(el))
		deprecated.forEach(el => this.add(el))
		removed.forEach(el => this.add(el))
		fixed.forEach(el => this.add(el))
		security.forEach(el => this.add(el))
	}
	/**
	 * Add a change item to this section
	 * @param {Partial<Change> | string | MDElement} change
	 * @returns {this}
	 */
	add(change) {
		// If there's no list child, create one
		let list = this.children.find(child => child instanceof MDList)
		if (!list) {
			list = new MDList()
			super.add(list)
		}

		// If change is a string, convert it to a Change object
		if (typeof change === 'string') {
			change = Change.fromElementString(change)
		}

		// Add the change to the list
		list.add(Change.from(change))
		return this
	}
	/**
	 * @param {object | string} input
	 * @returns {Section}
	 */
	static from(input) {
		if (input instanceof Section) return input
		return new Section(input)
	}
}
