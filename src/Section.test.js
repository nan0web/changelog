import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Section from './Section.js'
import Change from './Change.js'

describe('Section', () => {
	it('should create section from object with change arrays', () => {
		const section = new Section({
			content: 'Added',
			added: ['- Feature A', '- Feature B']
		})

		assert.equal(section.content, 'Added')
		assert.equal(section.children.length, 1) // Should have one list child
	})

	it('should add change items correctly', () => {
		const section = new Section({ content: 'Added' })
		
		// Add string change
		section.add('- New feature')
		
		// Add Change object
		section.add(new Change({ content: 'Another feature' }))
		
		assert.equal(section.children.length, 1) // Should have one list child
		const list = section.children[0]
		assert.equal(list.children.length, 2) // Should have two list items
	})

	it('should create section from existing section', () => {
		const existing = new Section({ content: 'Fixed' })
		const section = Section.from(existing)
		
		assert.strictEqual(section, existing)
	})
})