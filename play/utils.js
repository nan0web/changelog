#!/usr/bin/env node

import process from "node:process"

export async function pressAnyKey(console) {
	// Check if stdin is a TTY before setting raw mode
	if (process.stdin.isTTY) {
		console.info("\n--- press any key ---")
		// Dynamically import next only when needed in TTY mode
		const { next } = await import("@nan0web/ui-cli")
		await next()
		console.clearLine(console.cursorUp())
	} else {
		// For non-TTY environments (like CI or piped input), just wait for a line
		console.info("\n--- press ENTER to continue ---")
		
		// In non-TTY mode, we need to handle input differently
		// Create a promise that resolves when we get a line break
		return new Promise((resolve) => {
			const onData = () => {
				// Read whatever is available (should be an empty line)
				const chunk = process.stdin.read()
				if (chunk !== null) {
					console.clearLine(console.cursorUp())
					process.stdin.removeListener('readable', onData)
					resolve()
				}
			}
			
			// Set the listener
			process.stdin.on('readable', onData)
			
			// Check if there's already data available
			const chunk = process.stdin.read()
			if (chunk !== null) {
				onData()
			}
		})
	}
}