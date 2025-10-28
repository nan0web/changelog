#!/usr/bin/env node

import Changelog from "../src/Changelog.js"
import Change from "../src/Change.js"
import { pressAnyKey } from "./utils.js"

const INITIAL_CHANGELOG = `# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
---

## [1.0.0] - 2023-12-01
### Added
- Initial release
- Core functionality implemented`

export async function runChangelogModificationDemo(console) {
	console.clear()
	console.success("Changelog Modification Demo")
	console.info("Demonstrating how to add new changes to changelog")

	// --- Initialize Changelog ---
	const log = new Changelog()
	log.parse(INITIAL_CHANGELOG)

	console.info("\n📄 Initial Changelog:")
	console.info(String(log.document))

	await pressAnyKey(console)

	// --- Add New Change ---
	console.info("\n🆕 Adding New Change:")

	const newChange = new Change({
		added: "- Brand new authentication system\n- User profile management",
		changed: "- Improved performance in data fetching",
		fixed: "- Resolved crash on startup in some environments",
		major: 1,
		minor: 1,
		patch: 0,
		date: "2024-03-01"
	})

	log.addChange(newChange)

	console.info("Changelog after adding new change:")
	console.info(String(log.document))

	await pressAnyKey(console)

	// --- Add Another Change to Same Version ---
	console.info("\n➕ Adding Additional Change to Same Version:")

	const secondChange = new Change({
		fixed: "- Security patch for data validation",
		major: 1,
		minor: 1,
		patch: 0,
		date: "2024-03-02"
	})

	log.addChange(secondChange)

	console.info("Changelog after adding second change:")
	console.info(String(log.document))

	console.success("\nChangelog modification demo completed! ✨")
	await pressAnyKey(console)
}