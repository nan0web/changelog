import Markdown, {
	MDHeading1, MDHeading2, MDHeading3, MDHorizontalRule, MDParagraph, MDList, MDElement
} from "@nan0web/markdown"
import Change from "./Change.js"
import Version from "./Version.js"
import Section from "./Section.js"

/**
 * Changelog class extends Markdown to work specifically with CHANGELOG.md files
 */
export default class Changelog extends Markdown {
	/** @type {Map<string, Version>} */
	versions = new Map()
	title = new MDHeading1()
	// @todo make the replacements work such in the code below
	t = (str, repl) => str.replace(repl)

	constructor(input = {}) {
		super(input)
		const {
			t = this.t,
		} = input
		this.t = t
	}

	/**
	 * Parse changelog text and extract version information
	 * @throws
	 * @param {string} text - Changelog text content
	 * @returns {MDElement[]}
	 */
	parse(text) {
		const elements = super.parse(text)
		let version, section
		let i = 1
		const t = this.t
		for (const el of elements) {
			if (el instanceof MDHeading1) {
				this.title = new MDHeading1({ content: el.content })
			}
			else if (el instanceof MDHeading2) {
				version = new Version({ content: el.content })
				this.versions.set(version.ver, version)
			}
			else if (el instanceof MDHeading3) {
				if (!version) {
					throw new Error(
						t("Parsing error in a row #{i}: section h3 provided before version h2", { i })
					)
				}
				section = new Section({ content: el.content })
				version.add(section)
			}
			else {
				if (section) {
					section.add(/** @type {string | Change} */ (el))
				}
				else if (version) {
					// Handle content that belongs to version but not to a section
					if (el instanceof MDParagraph) {
						// Skip paragraphs directly under version headings for now
						// In a real changelog, these might be version descriptions
					}
				}
				else {
					this.title.add(el)
				}
			}
			++i
		}

		// Rebuild document with proper structure
		/** @type {MDElement[]} */
		const newChildren = [this.title]
		for (const ver of this.versions.values()) {
			newChildren.push(new MDHorizontalRule())
			newChildren.push(new MDParagraph({ content: "" }))
			newChildren.push(ver)
		}
		this.document.children = newChildren

		return [this.title, ...Array.from(this.versions.values())]
	}

	/**
	 * Get all versions from changelog in the order they appear in the file
	 * @returns {string[]} - Array of version strings
	 */
	getVersions() {
		const versions = []
		for (const element of this.document.children) {
			if (element instanceof Version) {
				versions.push(element.ver)
			}
		}
		return versions
	}

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
	addVersion(version, options = {}) {
		const date = options.date || new Date().toISOString().split('T')[0]
		const versionObj = new Version({ content: `[${version}] - ${date}` })

		// Insert elements at the beginning: HR, empty paragraph, heading
		const hr = new MDHorizontalRule()
		const placeholder = new MDParagraph({ content: "" })

		// Find the position where versions start (after initial header content)
		let insertPosition = this.document.children.length
		for (let i = 0; i < this.document.children.length; i++) {
			if (this.document.children[i] instanceof Version) {
				insertPosition = i
				break
			}
		}

		this.document.children.splice(insertPosition, 0, hr)
		this.document.children.splice(insertPosition + 1, 0, placeholder)
		this.document.children.splice(insertPosition + 2, 0, versionObj)

		// Store Version object
		this.versions.set(version, versionObj)

		return versionObj
	}

	/**
	 * Get changelog entry for specific version
	 * @param {string} version - Version to retrieve
	 * @returns {Version|null} - Version object or null if not found
	 */
	getVersion(version) {
		return this.versions.get(version) || null
	}

	/**
	 * Get the latest version from changelog (last in file)
	 * @returns {Version | undefined} - Latest version or undefined if not found
	 */
	getLatestVersion() {
		const versions = this.getVersions()
		return versions.length ? this.versions.get(versions[versions.length - 1]) : undefined
	}

	/**
	 * Get the most recent version (newest entry in the file)
	 * @returns {Version | undefined}
	 */
	getRecentVersion() {
		const versions = this.getVersions()
		return versions.length ? this.versions.get(versions[0]) : undefined
	}

	/**
	 * Initialize a new changelog document with required heading elements
	 */
	init() {
		if (this.document.children.length > 0) return
		this.document.add(new MDHeading1({ content: "Changelog" }))
		this.document.add(new MDParagraph({ content: "All notable changes to this project will be documented in this file." }))
		this.document.add(new MDParagraph({ content: "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)." }))
		this.document.add(new MDHorizontalRule())
	}
}
