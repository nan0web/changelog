#!/usr/bin/env node

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'

describe('playground CLI', () => {
	it('should run all demos and exit correctly with automated input', async () => {
		// Input sequence:
		// 1 - Basic Parsing
		// '' - Press ENTER to continue (3 times)
		// 2 - Version Comparison
		// '' - Press ENTER to continue (3 times)
		// 3 - Changelog Modification
		// '' - Press ENTER to continue (3 times)
		// 4 - Exit
		const inputs = [
			'1\n',   // Select "Basic Parsing"
			'\n',    // Press ENTER to continue
			'\n',    // Press ENTER to continue
			'\n',    // Press ENTER to continue
			'2\n',   // Select "Version Comparison"
			'\n',    // Press ENTER to continue
			'\n',    // Press ENTER to continue
			'\n',    // Press ENTER to continue
			'3\n',   // Select "Changelog Modification"
			'\n',    // Press ENTER to continue
			'\n',    // Press ENTER to continue
			'\n',    // Press ENTER to continue
			'4\n'    // Select "Exit"
		].join('')

		const proc = spawn('node', ['play/main.js'], {
			stdio: ['pipe', 'pipe', 'pipe']
		})

		let output = ''
		proc.stdout.on('data', (data) => {
			output += data.toString()
		})

		let errorOutput = ''
		proc.stderr.on('data', (data) => {
			errorOutput += data.toString()
		})

		// Send all inputs at once
		proc.stdin.write(inputs)
		proc.stdin.end()

		// Wait for process to complete with a timeout
		const exitCode = await Promise.race([
			new Promise((resolve) => proc.on('close', resolve)),
			new Promise((_, reject) => setTimeout(() => reject(new Error('Test timeout')), 10000))
		])

		// Verify that the process exited successfully
		assert.strictEqual(exitCode, 0, `Process should exit with code 0, but exited with ${exitCode}`)

		// Verify input acknowledgments
		assert.ok(output.includes('[INPUT] 1'), 'Should acknowledge input 1')
		assert.ok(output.includes('[INPUT] 2'), 'Should acknowledge input 2')
		assert.ok(output.includes('[INPUT] 3'), 'Should acknowledge input 3')
		assert.ok(output.includes('[INPUT] 4'), 'Should acknowledge input 4')

		// Verify that all demos were run by checking for their titles in output
		assert.ok(output.includes('Changelog Parsing Demo'), 'Should run Basic Parsing demo')
		assert.ok(output.includes('Version Comparison Demo'), 'Should run Version Comparison demo')
		assert.ok(output.includes('Changelog Modification Demo'), 'Should run Changelog Modification demo')

		// Verify that demos completed (by checking for completion messages)
		assert.ok(output.includes('Basic parsing demo completed!'), 'Should complete Basic Parsing demo')
		assert.ok(output.includes('Version comparison demo completed!'), 'Should complete Version Comparison demo')
		assert.ok(output.includes('Changelog modification demo completed!'), 'Should complete Changelog Modification demo')

		// Verify the process shows menu returns
		const menuReturns = (output.match(/Demo completed\. Returning to menu\.\.\./g) || []).length
		assert.strictEqual(menuReturns, 3, 'Should return to menu after each demo (3 times)')
	})
})
