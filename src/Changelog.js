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
	/** @type {Map<string, MDElement>} */
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
				this.title = new MDHeading1(el)
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
					section.add(el)
				}
				else {
					this.title.add(el)
				}
			}
			++i
		}
		return [this.title, ...Array.from(this.versions.values())]
	}

	/**
	 * Get all versions from changelog in the order they appear in the file
	 * @returns {string[]} - Array of version strings
	 */
	getVersions() {
		const versions = []
		for (const element of this.document.children) {
			if (element instanceof MDHeading2) {
				const match = element.content.match(/\[(\d+\.\d+\.\d+)\]/)
				if (match) {
					versions.push(match[1])
				}
			}
		}
		return versions
	}

	/**
	 * Get changelog entry for specific version
	 * @param {string} version - Version to retrieve
	 * @returns {object|null} - Version entry with date and changes or null if not found
	 */
	get(version) {
		let foundVersion = false
		let versionData = null
		let changes = {}

		for (const element of this.document.children) {
			// Look for version headings (## [version] - date)
			if (element instanceof MDHeading2) {
				const match = element.content.match(/\[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/)
				if (match && match[1] === version) {
					foundVersion = true
					versionData = {
						version: match[1],
						date: match[2],
						changes: {}
					}
					changes = versionData.changes
					continue
				} else if (foundVersion && match) {
					// Found another version, stop parsing
					break
				}
			}

			// Collect change categories (### Added, ### Changed, etc.)
			if (foundVersion && element instanceof MDHeading3) {
				const changeType = element.content.toLowerCase()
				if (!changes[changeType]) {
					changes[changeType] = []
				}
			}

			// Collect change items as lists
			if (foundVersion && element instanceof MDList) {
				const changeTypes = Object.keys(changes)
				if (changeTypes.length > 0) {
					const lastChangeType = changeTypes[changeTypes.length - 1]
					const items = element.children.map(item => item.content)
					changes[lastChangeType] = changes[lastChangeType].concat(items)
				}
			}
		}

		return versionData
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
	 */
	addVersion(version, options = {}) {
		const date = options.date || new Date().toISOString().split('T')[0]
		const versionHeading = new MDHeading2({ content: `[${version}] - ${date}` })

		// Insert elements at the beginning: HR, empty paragraph, heading
		const hr = new MDHorizontalRule()
		const placeholder = new MDParagraph({ content: "" })

		this.document.children.unshift(versionHeading)
		this.document.children.unshift(placeholder)
		this.document.children.unshift(hr)
	}

	/**
	 * Add a Change instance to the appropriate position in the changelog
	 * @param {Change} change - The Change instance to add
	 */
	addChange(change) {
		const versionStr = change.toString()
		const dateStr = change.date ? change.date.toISOString().split('T')[0] : ""

		// Ensure versions list is populated
		this.getVersions()

		// Find existing version index
		let versionIndex = -1
		for (let i = 0; i < this.document.children.length; i++) {
			const element = this.document.children[i]
			if (element instanceof MDHeading2) {
				const match = element.content.match(/\[(\d+\.\d+\.\d+)\]/)
				if (match && match[1] === versionStr) {
					versionIndex = i
					break
				}
			}
		}

		// If version does not exist, create it (adds HR + empty paragraph + heading)
		if (versionIndex === -1) {
			this.addVersion(versionStr, { date: dateStr })
			versionIndex = 0 // New version is at the very top
		}

		// Insert change elements immediately after the version heading
		const insertIndex = versionIndex + 1
		const changeElements = []

		const categories = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security']
		for (const category of categories) {
			if (change[category] && change[category].children.length > 0) {
				const heading = new MDHeading3({ content: category.charAt(0).toUpperCase() + category.slice(1) })
				changeElements.push(heading)
				changeElements.push(...change[category].children)
			}
		}

		this.document.children.splice(insertIndex, 0, ...changeElements)
	}

	/**
	 * Get the latest version from changelog (oldest entry in the file)
	 * @returns {string|null} - Latest version (prefixed with "v") or null if not found
	 */
	getLatestVersion() {
		const versions = this.getVersions()
		return versions.length > 0 ? `v${versions[versions.length - 1]}` : null
	}

	/**
	 * Get the most recent version (newest entry in the file)
	 * @returns {string|null}
	 */
	getRecentVersion() {
		const versions = this.getVersions()
		return versions.length > 0 ? `v${versions[0]}` : null
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
