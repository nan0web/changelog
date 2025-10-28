import { describe, it, before, beforeEach } from "node:test"
import assert from "node:assert/strict"
import FS from "@nan0web/db-fs"
import { NoConsole } from "@nan0web/log"
import {
	DatasetParser,
	DocsParser,
	runSpawn,
} from "@nan0web/test"
import {
	Change,
	Changelog,
	Version,
} from "./index.js"
import Section from "./Section.js"

const fs = new FS()
let pkg

// Load package.json once before tests
before(async () => {
	const doc = await fs.loadDocument("package.json", {})
	pkg = doc
})

let console = new NoConsole()

beforeEach(() => {
	console = new NoConsole()
})

/**
 * Core test suite that also serves as the source for README generation.
 *
 * The block comments inside each `it` block are extracted to build
 * the final `README.md`. Keeping the comments here ensures the
 * documentation stays close to the code.
 */
function testRender() {
	/**
	 * @docs
	 * # @nan0web/changelog
	 *
	 * Parse and modify changelogs programmatically.
	 *
	 * <!-- %PACKAGE_STATUS% -->
	 *
	 * ## Description
	 *
	 * The `@nan0web/changelog` package provides tools to parse, manipulate, and generate `CHANGELOG.md` files in a structured way.
	 * Inspired by [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
	 *
	 * Core classes:
	 *
	 * - `Changelog` — parses and manages the entire changelog document.
	 * - `Version` — represents a version entry with SemVer comparison.
	 * - `Change` — encapsulates change entries like Added, Fixed, etc.
	 * - `Section` — groups related changes under headings (e.g., `### Added`).
	 *
	 * Use cases:
	 *
	 * - Automate release notes generation.
	 * - Validate changelog structure in CI.
	 * - Query latest or specific version changes.
	 * - Programmatically add new changes or versions.
	 *
	 * ## Installation
	 */
	it("How to install with npm?", () => {
		/**
		 * ```bash
		 * npm install @nan0web/changelog
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/changelog")
	})
	/**
	 * @docs
	 */
	it("How to install with pnpm?", () => {
		/**
		 * ```bash
		 * pnpm add @nan0web/changelog
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/changelog")
	})
	/**
	 * @docs
	 */
	it("How to install with yarn?", () => {
		/**
		 * ```bash
		 * yarn add @nan0web/changelog
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/changelog")
	})

	/**
	 * @docs
	 * ## Usage
	 *
	 * ### Initialize a Changelog
	 *
	 * Start with an empty changelog and add required metadata.
	 */
	it("How to initialize a new Changelog?", () => {
		//import { Changelog } from '@nan0web/changelog'
		const log = new Changelog()
		log.init()

		console.info(String(log.document))
		// # Changelog
		// All notable changes to this project will be documented in this file.
		//
		// The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
		//
		// ---
		assert.ok(console.output()[0][1].includes("# Changelog"))
		assert.ok(console.output()[0][1].includes("All notable changes to this project will be documented in this file."))
	})

	/**
	 * @docs
	 * ### Parse Existing Changelog
	 *
	 * Parse a markdown string into a structured changelog.
	 */
	it("How to parse existing changelog text?", () => {
		//import { Changelog } from '@nan0web/changelog'
		const log = new Changelog()
		const text = `# Changelog
All notable changes to this project will be documented in this file.

## [1.0.0] - 2023-12-01
### Added
- Initial release`
		log.parse(text)

		console.info(String(log.document))
		// # Changelog
		// All notable changes to this project will be documented in this file.
		//
		// ---
		//
		//
		// ## [1.0.0] - 2023-12-01
		// ### Added
		//
		// - Initial release
		//
		assert.ok(console.output()[0][1].includes("## [1.0.0] - 2023-12-01"))
		assert.ok(console.output()[0][1].includes("### Added"))
	})

	/**
	 * @docs
	 * ### Add a New Change
	 *
	 * Create a `Change` and add it under the right version.
	 */
	it("How to add a new change to a version?", () => {
		//import { Changelog } from '@nan0web/changelog'
		const log = new Changelog()
		log.parse(`# Changelog
\n
## [1.0.0] - 2023-12-01
### Added
- Initial release`)

		const recent = log.getRecentVersion()
		recent?.getSection("Added")?.add("New CLI support")

		console.info(String(log.document))
		// # Changelog
		//
		//
		// ---
		//
		//
		// ## [1.0.0] - 2023-12-01
		// ### Added
		//
		// - Initial release
		// - New CLI support
		//
		assert.ok(recent)
		const output = console.output()[0][1]
		assert.ok(output.includes("# Changelog"))
		assert.ok(output.includes("## [1.0.0] - 2023-12-01"))
		assert.ok(output.includes("### Added"))
		assert.ok(output.includes("- Initial release"))
		assert.ok(output.includes("- New CLI support"))
	})

	/**
	 * @docs
	 * ### Add Another Change to Existing Version
	 *
	 * Add changes incrementally to the same version.
	 */
	it("How to add additional changes to an existing version?", () => {
		//import { Changelog, Version, Section } from '@nan0web/changelog'
		const log = new Changelog()

		// Initialize with some content
		log.init()
		const version = new Version({
			major: 1,
			minor: 1,
			patch: 0,
			date: "2024-03-01"
		})
		version.add(
			new Section({ content: "Added" }).add("New CLI support")
		)
		version.add(
			new Section({ content: "Fixed" }).add("Bug in version parsing")
		)

		log.document.add(version)
		version.getSection("Fixed")?.add("Crash on startup")

		console.info(String(log.document))
		// # Changelog
		// All notable changes to this project will be documented in this file.
		//
		// The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
		//
		// ---
		// ## [1.1.0] - 2024-03-01
		// ### Added
		// - New CLI support
		//
		// ### Fixed
		// - Bug in version parsing
		// - Crash on startup
		assert.ok(log)
		const output = console.output()[0][1]
		assert.ok(output.includes("# Changelog"))
		assert.ok(output.includes("## [1.1.0] - 2024-03-01"))
		assert.ok(output.includes("### Added"))
		assert.ok(output.includes("New CLI support"))
		assert.ok(output.includes("### Fixed"))
		assert.ok(output.includes("Bug in version parsing"))
		assert.ok(output.includes("Crash on startup"))

		const addedIndex = output.indexOf("### Added")
		const fixedIndex = output.indexOf("### Fixed")
		assert.ok(fixedIndex > addedIndex, "Fixed section should appear after Added")
	})

	/**
	 * @docs
	 * ### Get Versions
	 *
	 * Extract list of versions in order they appear (newest first).
	 */
	it("How to get list of versions in changelog?", () => {
		//import { Changelog } from '@nan0web/changelog'
		const log = new Changelog()
		log.parse(`# Changelog
\n
## [1.1.1] - 2024-02-15
\n
## [1.1.0] - 2024-01-20
\n
## [1.0.0] - 2023-12-01`)

		const versions = log.getVersions()
		console.info(JSON.stringify(versions))
		// ["1.1.1","1.1.0","1.0.0"]
		assert.deepStrictEqual(console.output()[0][1], '["1.1.1","1.1.0","1.0.0"]')
	})

	/**
	 * @docs
	 * ### Get Latest and Recent Version
	 *
	 * Use `getLatestVersion()` for oldest, `getRecentVersion()` for newest.
	 */
	it("How to get latest and recent versions?", () => {
		//import { Changelog } from '@nan0web/changelog'
		const log = new Changelog()
		log.parse(`# Changelog
\n
## [1.1.1] - 2024-02-15
\n
## [1.1.0] - 2024-01-20
\n
## [1.0.0] - 2023-12-01`)

		const latest = log.getLatestVersion()
		const recent = log.getRecentVersion()

		console.info(`Latest: ${latest?.ver}, Recent: ${recent?.ver}`)
		// Latest: 1.0.0, Recent: 1.1.1
		assert.equal(console.output()[0][1], "Latest: 1.0.0, Recent: 1.1.1")
	})

	/**
	 * @docs
	 * ### Retrieve Specific Version Changes
	 *
	 * Extract structured data for a specific version.
	 */
	it("How to retrieve changes for a specific version?", () => {
		//import { Changelog } from '@nan0web/changelog'
		const log = new Changelog()
		log.parse(`# Changelog
\n
## [1.1.0] - 2024-01-20
### Added
- Dark mode
- CSV export
\n
## [1.0.0] - 2023-12-01
### Added
- Initial release`)

		const entry = log.getVersion('1.1.0')
		console.info(JSON.stringify(entry?.ver))
		// "1.1.0"
		assert.equal(console.output()[0][1], '"1.1.0"')
	})

	/**
	 * @docs
	 * ### Version Comparison
	 *
	 * Compare versions using SemVer rules.
	 */
	it("How to compare versions using SemVer?", () => {
		//import { Version } from '@nan0web/changelog'
		const v1 = new Version("1.2.3")
		const v2 = new Version("1.2.4")
		const v3 = new Version("1.3.0")

		console.info(`v1 < v2: ${v1.lowerThan(v2)}`)
		// v1 < v2: true
		console.info(`v2 > v1: ${v2.higherThan(v1)}`)
		// v2 > v1: true
		console.info(`v3 >= v1: ${v3.acceptableTo(v1)}`)
		// v3 >= v1: true
		assert.equal(console.output()[0][1], "v1 < v2: true")
		assert.equal(console.output()[1][1], "v2 > v1: true")
		assert.equal(console.output()[2][1], "v3 >= v1: true")
	})

	/**
	 * @docs
	 * ### Version String Formatting
	 *
	 * Generate version strings in markdown or plain text.
	 */
	it("How to format Version as string in different formats?", () => {
		//import { Version, Section } from '@nan0web/changelog'
		const v = new Version({ major: 1, minor: 2, patch: 3, date: "2025-01-01" })
		const section = new Section({ content: "Added" })
		section.add(new Change({ content: "New feature" }))
		v.add(section)

		console.info(`Markdown:\n${v.toString()}`)
		// Markdown:
		// ## [1.2.3] - 2025-01-01
		// ### Added
		// - New feature
		//

		console.info(`Text:\n${v.toString({ format: ".txt" })}`)
		// Text:
		// v1.2.3 - 2025-01-01
		//   Added
		//     - New feature
		assert.equal(console.output()[0][1], "Markdown:\n## [1.2.3] - 2025-01-01\n### Added\n- New feature\n\n")
		assert.equal(console.output()[1][1], "Text:\nv1.2.3 - 2025-01-01\n  Added\n    - New feature")
	})

	/**
	 * @docs
	 * ## API
	 *
	 * ### Changelog
	 *
	 * * **Properties**
	 *   * `versions` – Map of version strings to `Version` instances.
	 *   * `title` – `MDHeading1` of the document.
	 *   * `document` – The root `MDElement` tree.
	 *
	 * * **Methods**
	 *   * `parse(text)` – parses markdown into structured blocks.
	 *   * `getVersions()` – returns array of version strings.
	 *   * `getVersion(version)` – returns `Version` object for a version.
	 *   * `addChange(change)` – adds a `Change` to the right version.
	 *   * `getLatestVersion()` – returns oldest version (last in file).
	 *   * `getRecentVersion()` – returns newest version (first in file).
	 *   * `init()` – initializes a new changelog with boilerplate.
	 *
	 * ### Version
	 *
	 * * **Properties**
	 *   * `major`, `minor`, `patch` – SemVer components.
	 *   * `date` – release date.
	 *   * `ver` – getter for `"major.minor.patch"` string.
	 *   * `content` – formatted version line.
	 *
	 * * **Methods**
	 *   * `higherThan(other)` – true if this version is greater.
	 *   * `lowerThan(other)` – true if this version is smaller.
	 *   * `acceptableTo(other)` – true if this >= other.
	 *   * `toString()` – returns markdown string of version and children.
	 *   * `toString({ format: '.txt' })` – returns text-mode flat string.
	 *   * `static from(input)` – creates a Version from string/object.
	 *
	 * ### Change
	 *
	 * * **Properties**
	 *   * `major`, `minor`, `patch` – version targeting.
	 *   * `date` – change date.
	 *   * `content` – change description.
	 *
	 * * **Methods**
	 *   * `static from(input)` – returns a Change instance.
	 *   * `static fromElementString(str)` – parse from markdown list item.
	 *
	 * ### Section
	 *
	 * * **Methods**
	 *   * `add(change)` – adds a change item to this section.
	 *
	 * ## Java•Script
	 */
	it("Uses `d.ts` files for autocompletion", () => {
		assert.equal(pkg.types, "./types/index.d.ts")
	})

	/**
	 * @docs
	 * ## CLI Playground
	 *
	 * Run interactive demos.
	 */
	it("How to run playground script?", async () => {
		/**
		 * ```bash
		 * pnpm play
		 * ```
		 */
		assert.ok(String(pkg.scripts?.play))
		// @todo try to run as echo "INPUT:\n1\n \n \n \n2\n \n \n\ \n3\n \n \n\ \n4\n" | node play/main.js --debug
		assert.ok(await fs.loadDocument("play/main.js"))
	})

	/**
	 * @docs
	 * ## Contributing
	 */
	it("How to contribute? - [check here](./CONTRIBUTING.md)", async () => {
		assert.equal(pkg.scripts?.precommit, "npm test")
		assert.equal(pkg.scripts?.prepush, "npm test")
		assert.equal(pkg.scripts?.prepare, "husky")
		const text = await fs.loadDocument("CONTRIBUTING.md")
		assert.ok(String(text).includes("# Contributing"))
	})

	/**
	 * @docs
	 * ## License
	 */
	it("How to license ISC? - [check here](./LICENSE)", async () => {
		assert.ok(fs)
		const text = await fs.loadDocument("LICENSE")
		assert.ok(String(text).includes("ISC"))
	})
}

describe("README.md testing", testRender)

describe("Rendering README.md", async () => {
	const format = new Intl.NumberFormat("en-US").format
	const parser = new DocsParser()
	const text = String(parser.decode(testRender))
	await fs.saveDocument("README.md", text)
	const dataset = DatasetParser.parse(text, pkg.name)
	await fs.saveDocument(".datasets/README.dataset.jsonl", dataset)

	it(`document is rendered in README.md [${format(Buffer.byteLength(text))}b]`, async () => {
		const saved = await fs.loadDocument("README.md")
		assert.ok(saved.includes("## License"))
	})
})
