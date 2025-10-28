import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Change from './Change.js'
import { MDElement } from '@nan0web/markdown'

describe('Change', () => {
	it('should create MDElement from string via fromElementString', () => {
		const mdString = '- Feature X added'
		const element = Change.fromElementString(mdString)

		assert.ok(element instanceof MDElement, 'Result must be an MDElement')
		// Verify the content was set correctly
		assert.strictEqual(element.content, 'Feature X added')
	})

	it('static from should return the same instance when given a Change', () => {
		const existing = new Change({ content: 'Foo' })
		const result = Change.from(existing)

		// Should return the exact same instance
		assert.strictEqual(result, existing, 'When input is a Change instance, from() returns the same instance')
	})

	it('static from should create a new instance for plain objects', () => {
		const obj = { content: 'Bar' }
		const change = Change.from(obj)

		assert.ok(change instanceof Change, 'Result must be a Change instance')
		assert.strictEqual(change.content, 'Bar')
	})
})