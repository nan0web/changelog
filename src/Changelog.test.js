import { describe, it } from 'node:test'
import assert from 'node:assert'
import { MDHeading2, MDParagraph, MDHorizontalRule } from "@nan0web/markdown"
import Changelog from './Changelog.js'
import Version from './Version.js'
import Change from './Change.js'
import Section from './Section.js'

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

		const addedVersion = changelog.addVersion("1.2.0", { date: "2025-01-01" })

		// Verify version was added to versions map
		assert.ok(changelog.versions.has('1.2.0'))

		// Check that the added version appears at the correct location
		assert.ok(addedVersion instanceof Version)
		assert.strictEqual(addedVersion.ver, '1.2.0')
		// Check that the content includes the version string
		assert.ok(addedVersion.content.includes('[1.2.0]'))
		assert.ok(addedVersion.content.includes('2025-01-01'))
	})

	it('should retrieve a specific version correctly', () => {
		const changelog = new Changelog()
		changelog.parse(sampleChangelog)
		const versionEntry = changelog.getVersion('1.1.0')

		assert.ok(versionEntry)
		assert.ok(versionEntry instanceof Version)
		assert.strictEqual(versionEntry.ver, '1.1.0')
	})

	it('should get latest version (last in file)', () => {
		const changelog = new Changelog()
		changelog.parse(sampleChangelog)
		const latestVersion = changelog.getLatestVersion()

		assert.ok(latestVersion)
		assert.strictEqual(latestVersion.ver, '1.0.0') // Last version entry in the sample file
	})

	it.todo('should add change to existing version', () => {
		const changelog = new Changelog()
		changelog.parse(sampleChangelog)
		const version = changelog.addVersion("1.1.1", { date: "2025-01-01" })
		version.add("added")
		const section = version.getSection("added")
		section.add("Additional feature")

		assert.ok(version)

		// Check that the version has the added section
		assert.ok(section)
		assert.ok(section.children.length > 0)

		// Check that the document also reflects this change
		let found = false
		for (const element of changelog.document.children) {
			if (element instanceof Version && element.ver === '1.1.1') {
				const addedSection = element.getSection('Added')
				if (addedSection && addedSection.toString().includes('Additional feature')) {
					found = true
					break
				}
			}
		}
		assert.ok(found, 'Change should be added to document')
	})

	it.todo('should create new version when adding change', () => {
		const changelog = new Changelog()
		changelog.parse(sampleChangelog)

		changelog.addVersion(
			new Version({ ver: "2.0.0" }).add(
				new Section("added").add("Major new feature")
			)
		)

		const version = changelog.getVersion('2.0.0')
		assert.ok(version)

		// Check that the version has the added section
		const section = version.getSection('Added')
		assert.ok(section)
		assert.ok(section.children.length > 0)
		assert.ok(section.toString().includes('Major new feature'))
	})
})
