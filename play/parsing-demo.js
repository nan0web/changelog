#!/usr/bin/env node

import Changelog from "../src/Changelog.js"
import { pressAnyKey } from "./utils.js"

const SAMPLE_CHANGELOG = `# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
---

## [1.1.1] - 2024-02-15
### Fixed
- Corrected race condition in data sync module
- Fixed UI glitch when opening the settings panel

### Security
- Patched vulnerability CVE‑2024‑1234 in authentication flow

---

## [1.1.0] - 2024-01-20
### Added
- Introduced dark mode theme support
- Added export to CSV functionality for reports

### Changed
- Refactored network layer to use native fetch API
- Updated dependencies to latest stable versions

---

## [1.0.0] - 2023-12-01
### Added
- Initial release of AwesomeApp
- Core features: user authentication, dashboard, and data visualization
- Basic CLI interface for quick project scaffolding`

export async function runBasicParsingDemo(console) {
	console.clear()
	console.success("Changelog Parsing Demo")
	console.info("Demonstrating how to parse existing changelog files")

	// --- Changelog Parsing Demo ---
	const log = new Changelog()
	log.parse(SAMPLE_CHANGELOG)

	console.info("\n📝 Parsed Changelog Structure:")
	console.info(String(log.document))

	await pressAnyKey(console)

	console.info("\n🔢 Extracted Versions:")
	const versions = log.getVersions()
	console.info(JSON.stringify(versions, null, 2))

	await pressAnyKey(console)

	console.info("\n🔍 Latest Version Info:")
	const latest = log.getLatestVersion()
	const recent = log.getRecentVersion()
	console.info(`Latest (oldest): ${latest}`)
	console.info(`Recent (newest): ${recent}`)

	console.success("\nBasic parsing demo completed! ✨")
	await pressAnyKey(console)
}