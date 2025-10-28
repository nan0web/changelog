import { MDElement, MDHeading2 } from "@nan0web/markdown"
import Section from "./Section.js"
import Change from "./Change.js"

/**
 * @typedef {string | object} VersionInput
 * @property {number} [major=0]
 * @property {number} [minor=0]
 * @property {number} [patch=0]
 * @property {Date | string} [date=new Date()]
 * @property {MDElement[]} [children=[]]
 * @property {string} [content=""]
 * @property {string} [ver=""]
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
	/** @type {Section[]} */
	children

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
			ver = "",
			date = new Date(),
			children = [],
			content = "",
		} = input
		this.major = Number(major)
		this.minor = Number(minor)
		this.patch = Number(patch)
		if (ver) {
			const [x, y, z] = ver.split(".")
			this.major = Number(x)
			this.minor = Number(y)
			this.patch = Number(z)
		}
		// Ensure stored date is UTC midnight to keep ISO string stable
		if (date instanceof Date) {
			this.date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
		} else {
			const dateString = String(date)
			if (!dateString) {
				this.date = new Date()
			} else {
				const parsedDate = new Date(dateString)
				if (isNaN(parsedDate.getTime())) {
					throw new RangeError("Invalid time value")
				}
				this.date = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()))
			}
		}
		this.children = children.map(c => Section.from(c))
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
	 * @param {string | Section | MDElement} section
	 * @returns {this}
	 */
	add(section) {
		if ("string" === typeof section) {
			const found = this.findSection(section)
			if (found) {
				return /** @type {this} */ (found)
			}
			const a = Section.from({ content: section })
			super.add(a)
			return /** @type {this} */ (this)
		}
		if (!(section instanceof Section)) {
			throw new Error([
				"Only Section instances can be added. But provided",
				// @ts-ignore
				"object" === typeof section ? section.constructor.name : typeof section
			].join(": "))
		}
		const found = this.findSection(section.content)
		if (found) {
			return /** @type {this} */ (found)
		}
		super.add(/** @type {MDElement} */(section))
		return /** @type {this} */ (this)
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

		const dateString = String(date || "")
		if (!dateString) {
			this.date = new Date()
		} else {
			const parsedDate = new Date(dateString)
			if (isNaN(parsedDate.getTime())) {
				throw new RangeError("Invalid time value")
			}
			// Set to UTC midnight
			this.date = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate()))
		}
	}

	findSection(name) {
		const key = name.toUpperCase()
		const content = Section[key] ?? ""
		return this.children.find(section => content === section.content)
	}

	/**
	 * @param {string} name One of "Added", "Changed", "Removed", "Fixed"
	 * @returns {Section | undefined}
	 */
	getSection(name) {
		let found = this.findSection(name)
		if (!found) {
			found = new Section({ content: name })
			this.add(found)
		}
		return found
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
			let result = title

			// Append child elements formatted as text
			for (const child of this.children) {
				if (child instanceof Section) {
					result += '\n' + tab.repeat(indent + 1) + child.content

					// Process section children (lists)
					for (const list of child.children) {
						for (const item of list.children) {
							if (item instanceof Change) {
								result += '\n' + tab.repeat(indent + 2) + '- ' + item.content
							}
						}
					}
				}
			}

			return result
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
