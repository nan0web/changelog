import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Version from './Version.js'
import Section from './Section.js'
import Change from './Change.js'

describe('Version', () => {
	it('should create version from string', () => {
		const version = new Version("v1.2.3")
		assert.equal(version.major, 1)
		assert.equal(version.minor, 2)
		assert.equal(version.patch, 3)
	})

	it('should create version from object', () => {
		const version = new Version({ major: 2, minor: 5, patch: 10 })
		assert.equal(version.major, 2)
		assert.equal(version.minor, 5)
		assert.equal(version.patch, 10)
	})

	it('should compare versions correctly', () => {
		const v1 = new Version("v1.2.3")
		const v2 = new Version("v1.2.4")
		const v3 = new Version("v1.3.0")
		const v4 = new Version("v2.0.0")

		assert.equal(v1.higherThan(v2), false)
		assert.equal(v2.higherThan(v1), true)
		assert.equal(v1.lowerThan(v2), true)
		assert.equal(v2.lowerThan(v1), false)
		assert.equal(v1.acceptableTo(v2), false)
		assert.equal(v2.acceptableTo(v1), true)
		assert.equal(v4.higherThan(v3), true)
	})

	it('should convert to string correctly', () => {
		const version = new Version({ major: 1, minor: 2, patch: 3, date: "2025-01-01" })
		const section = new Section({ content: "Added" })
		section.add(new Change({ content: "New feature" }))
		version.add(section)

		assert.equal(version.toString(), "## [1.2.3] - 2025-01-01\n### Added\n- New feature\n\n")
	})

	it("should convert to .txt correctly", () => {
		const version = new Version({ major: 1, minor: 2, patch: 3, date: "2025-01-01" })
		const section = new Section({ content: "Added" })
		section.add(new Change({ content: "New feature" }))
		version.add(section)

		assert.equal(version.toString({ format: ".txt" }), [
			"v1.2.3 - 2025-01-01",
			"  Added",
			"    - New feature"
		].join("\n"))
	})
})
