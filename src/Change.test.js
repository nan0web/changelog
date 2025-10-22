import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Change from './Change.js'
import { MDElement } from '@nan0web/markdown'

describe('Change', () => {
	it.todo('should create MDElement from string via fromElementString', () => {
		const mdString = '- Feature X added'
		const element = Change.fromElementString(mdString)

		assert.ok(element instanceof MDElement, 'Result must be an MDElement')
		// The root document should contain a single list with one item
		const list = element.children[0]
		assert.ok(list, 'Root should have a child')
		assert.ok(list.constructor.name.includes('MDList'), 'Child must be a list')
		assert.strictEqual(list.children[0].content, 'Feature X added')
	})

	it.todo('constructor should initialise each category as MDElement', () => {
		const input = {
			added: '- Added thing',
			changed: '- Changed thing',
			deprecated: '- Deprecated thing',
			removed: '- Removed thing',
			fixed: '- Fixed thing',
			security: '- Security thing',
		}
		const change = new Change(input)

		// all properties must be MDElement instances
		for (const key of Object.keys(input)) {
			assert.ok(change[key] instanceof MDElement, `${key} must be an MDElement`)
		}
		// verify content of one category
		const addedItem = change.added.children[0].children[0].content
		assert.strictEqual(addedItem, 'Added thing')
	})

	it('static from should return the same instance when given a Change', () => {
		const existing = new Change({ added: '- Foo' })
		const result = Change.from(existing)

		// Should return the exact same instance
		assert.strictEqual(result, existing, 'When input is a Change instance, from() returns the same instance')
	})

	it.todo('static from should create a new instance for plain objects', () => {
		const obj = { added: '- Bar' }
		const change = Change.from(obj)

		assert.ok(change instanceof Change, 'Result must be a Change instance')
		assert.ok(change.added instanceof MDElement, 'added property must be MDElement')
	})
})
