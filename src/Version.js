import { MDElement, MDHeading2 } from "@nan0web/markdown"
import Section from "./Section.js"

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
	/** @type {number} */
	major
	/** @type {number} */
	minor
	/** @type {number} */
	patch
	/** @type {Date} */
	date

	/**
	 * @param {VersionInput} [input]
	 */
	constructor(input = {}) {
		super({})

		if ("string" === typeof input) {
			input = { content: input }
		}

		const {
			major = 0,
			minor = 0,
			patch = 0,
			date = new Date(),
			children = [],
			content = "",
		} = input
		this.major = Number(major)
		this.minor = Number(minor)
		this.patch = Number(patch)
		// Ensure stored date is UTC midnight to keep ISO string stable
		if (date instanceof Date) {
			this.date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
		} else {
			this.date = new Date(date)
			// Set to UTC midnight
			this.date.setUTCHours(0, 0, 0, 0)
		}
		this.children = children
		if (content) {
			this.setContent(content)
		}
	}

	/**
	 * @returns {string}
	 */
	get ver() {
		return `${this.major}.${this.minor}.${this.patch}`
	}

	/**
	 * @param {Section} section
	 */
	add(section) {
		if (!(section instanceof Section)) {
			throw new Error([
				"Only Section instances can be added. But provided",
				// @ts-ignore
				"object" === typeof section ? section.constructor.name : typeof section
			].join(": "))
		}
		return super.add(section)
	}

	/**
	 * @returns {string}
	 */
	getContent() {
		return `[${this.ver}] - ${this.date.toISOString().slice(0, 10)}`
	}

	/**
	 * @param {string} input
	 */
	setContent(input) {
		const [version, date] = String(input).split(" - ")
		let [
			major = "0", minor = "0", patch = "0"
		] = version.replace(/[^\.v0-9]+/g, "").split(".")
		if (major.startsWith("v")) major = major.slice(1)
		this.major = Number(major)
		this.minor = Number(minor)
		this.patch = Number(patch)
		this.date = new Date(date)
	}

	/**
	 * Checks if version is higher than other version
	 * @param {VersionInput} version
	 * @returns {boolean}
	 */
	higherThan(version) {
		version = Version.from(version)
		if (this.major > version.major) return true
		if (this.major < version.major) return false
		if (this.minor > version.minor) return true
		if (this.minor < version.minor) return false
		return this.patch > version.patch
	}

	/**
	 * Checks if version is lower than other version
	 * @param {VersionInput} version
	 * @returns {boolean}
	 */
	lowerThan(version) {
		version = Version.from(version)
		if (this.major < version.major) return true
		if (this.major > version.major) return false
		if (this.minor < version.minor) return true
		if (this.minor > version.minor) return false
		return this.patch < version.patch
	}

	/**
	 * Checks if version is acceptable for other version (>= other)
	 * @param {VersionInput} version
	 * @returns {boolean}
	 */
	acceptableTo(version) {
		version = Version.from(version)
		return !this.lowerThan(version)
	}

	/**
	 * @param {object} [input]
	 * @param {number} [input.indent=0]
	 * @param {string} [input.format=".md"]
	 * @param {boolean} [input.skipPrefix=false]
	 * @returns {string}
	 */
	toString(input = {}) {
		const {
			indent = 0,
			format = ".md",
			skipPrefix = false
		} = input
		const tab = "  "
		this.content = this.getContent()
		if (".md" == format) {
			return super.toString({ indent, format })
		}
		const date = this.date.toISOString().slice(0, 10)
		const title = `${tab.repeat(indent)}${skipPrefix ? "" : "v"}${this.ver} - ${date}`
		if (".txt" == format) {
			return title + "\n" + this.children.map(c => c.toString({ indent, format }))
		}
		return title
	}

	/**
	 * Creates Version from input
	 * @param {VersionInput} input
	 * @returns {Version}
	 */
	static from(input) {
		if (input instanceof Version) return input
		return new Version(input)
	}
}
