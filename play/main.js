#!/usr/bin/env node

import process from "node:process"
import Logger from "@nan0web/log"

import { runBasicParsingDemo } from "./parsing-demo.js"
import { runVersionComparisonDemo } from "./version-demo.js"
import { runChangelogModificationDemo } from "./modification-demo.js"

const console = new Logger({ level: Logger.detectLevel(process.argv) })

console.clear()
console.info(Logger.style(Logger.LOGO, { color: "magenta" }))

// Store automated inputs if provided
let automatedInputs = []
let inputIndex = 0

// Flag to track if we've read all input
let inputReadingComplete = false

async function readAutomatedInputs() {
	if (inputReadingComplete || process.stdin.isTTY) {
		return
	}
	
	return new Promise((resolve) => {
		let data = ''
		process.stdin.setEncoding('utf8')
		
		process.stdin.on('data', (chunk) => {
			data += chunk
		})
		
		process.stdin.on('end', () => {
			automatedInputs = data.split('\n').filter(line => line.trim())
			inputReadingComplete = true
			resolve()
		})
	})
}

async function chooseDemo() {
	const demos = [
		{ name: "Basic Parsing", value: "parsing" },
		{ name: "Version Comparison", value: "version" },
		{ name: "Changelog Modification", value: "modification" },
		{ name: "← Exit", value: "exit" }
	]

	// Check if we have automated inputs
	if (!process.stdin.isTTY) {
		// Wait for input reading to complete
		if (!inputReadingComplete) {
			await readAutomatedInputs()
		}
		
		if (inputIndex >= automatedInputs.length) {
			return "exit"
		}
		
		const choice = automatedInputs[inputIndex++]
		const demoChoice = parseInt(choice)
		
		if (demoChoice >= 1 && demoChoice <= demos.length) {
			console.info("[INPUT] " + choice)
			return demos[demoChoice - 1].value
		}
		
		return "exit"
	}

	// Interactive mode for TTY
	if (process.stdin.isTTY) {
		// Dynamically import select only when needed in TTY mode
		const { select } = await import("@nan0web/ui-cli")
		const choice = await select({
			title: "Select changelog demo to run:",
			prompt: "[me]: ",
			invalidPrompt: Logger.style("[me invalid]", { color: "red" }) + ": ",
			options: demos.map(d => d.name),
			console
		})

		return demos[choice.index].value
	}

	// If we reach here, we're in a non-TTY environment with no automated input
	console.warn("No input available")
	return "exit"
}

async function showMenu() {
	console.info("\n" + "=".repeat(50))
	console.info("Demo completed. Returning to menu...")
	console.info("=".repeat(50) + "\n")
}

async function runDemo(demoType) {
	switch (demoType) {
		case "parsing":
			await runBasicParsingDemo(console)
			break
		case "version":
			await runVersionComparisonDemo(console)
			break
		case "modification":
			await runChangelogModificationDemo(console)
			break
		case "exit":
			process.exit(0)
			break
		default:
			console.warn("Unknown demo type selected")
	}
}

async function main() {
	// Read automated inputs at start if needed
	if (!process.stdin.isTTY) {
		await readAutomatedInputs()
	}
	
	while (true) {
		try {
			const demoType = await chooseDemo()

			if (demoType === "exit") {
				process.exit(0)
				break
			}

			await runDemo(demoType)
			await showMenu()
		} catch (error) {
			if (error.message && error.message.includes("cancel")) {
				console.warn("\nDemo selection cancelled. Returning to menu...")
				await showMenu()
			} else {
				throw error
			}
		}
	}
}

main().then(() => {
	process.exit(0)
}).catch(err => {
	console.error(err)
	process.exit(1)
})