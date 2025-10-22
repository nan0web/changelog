import { describe, it } from 'node:test'
import assert from 'node:assert'
import Changelog from './Changelog.js'
import Change from './Change.js'
import { MDHeading1, MDHeading2 } from "@nan0web/markdown"

const sampleChangelog = `# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
---

## [1.1.1] - 2024-01-03
### Added
- New feature Y

---

## [1.1.0] - 2024-01-02
### Changed
- Improved performance of module X

---

## [1.0.0] - 2024-01-01
### Added
- Initial release
- Core functionality implemented`

describe('Changelog', () => {
	it('should parse changelog text', () => {
		const changelog = new Changelog()
		const elements = changelog.parse(sampleChangelog)

		assert.ok(Array.isArray(elements))
		const rows = elements.map(String).join("").split("\n")
		assert.ok(rows.includes("# Changelog"))
		assert.ok(rows.includes("All notable changes to this project will be documented in this file."))
		assert.ok(rows.includes("## [1.1.1] - 2024-01-03"))
		assert.ok(rows.includes("### Added"))
		assert.ok(rows.includes("## [1.1.0] - 2024-01-02"))
		assert.ok(rows.includes("### Changed"))
		assert.ok(rows.includes("- Improved performance of module X"))
		assert.ok(rows.includes("## [1.0.0] - 2024-01-01"))
		assert.ok(rows.includes("- Initial release"))
		assert.ok(rows.includes("- Core functionality implemented"))
	})

	it('should get versions in correct order', () => {
		const changelog = new Changelog()
		changelog.parse(sampleChangelog)
		const versions = changelog.getVersions()

		assert.deepStrictEqual(versions, ['1.1.1', '1.1.0', '1.0.0'])
	})

	it.todo('should add new version entry properly', () => {
		const changelog = new Changelog()
		changelog.parse(sampleChangelog)
		// Reset to a clean state to avoid confusion with existing elements

		const initialLength = changelog.document.children.length

		// Create a real Change instance with content
		const newChange = new Change({
			major: 1,
			minor: 2,
			patch: 0,
			date: '2025-01-01',
			added: "- New features added", // Will be parsed into an MDList with 1 item
		})

		changelog.addChange(newChange)
		const newLength = changelog.document.children.length

		// The change adds these elements:
		// - HR (---)
		// - Empty paragraph
		// - Version heading (## [1.3.0] - 2025-01-01)
		// - Category heading (### Added)
		// - List item (- New features added)
		// So we expect +5 elements total.
		assert.strictEqual(newLength, initialLength + 5)

		// Check that the added version appears at the correct location
		const hrElement = changelog.document.children[0]
		const paraElement = changelog.document.children[1]
		const versionHeading = changelog.document.children[2]

		assert.ok(hrElement.constructor.name.includes('MDHorizontalRule'))
		assert.ok(paraElement instanceof MDParagraph)
		assert.strictEqual(paraElement.content, "")
		assert.ok(versionHeading instanceof MDHeading2)
		assert.ok(versionHeading.content.includes('[1.3.0]'))
		assert.ok(versionHeading.content.includes('2025-01-01'))
	})

	it('should retrieve a specific version correctly', () => {
		const changelog = new Changelog()
		changelog.parse(sampleChangelog)
		const versionEntry = changelog.get('1.1.0')

		assert.ok(versionEntry)
		assert.strictEqual(versionEntry.version, '1.1.0')
		assert.strictEqual(versionEntry.date, '2024-01-02')
		assert.ok(versionEntry.changes.changed)
		assert.ok(versionEntry.changes.changed.length > 0)
	})

	it('should get latest version (last in file)', () => {
		const changelog = new Changelog()
		changelog.parse(sampleChangelog)
		const latestVersion = changelog.getLatestVersion()

		assert.strictEqual(latestVersion, 'v1.0.0') // Last version entry in the sample file
	})
})
