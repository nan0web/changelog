#!/usr/bin/env node
/**
 * Playground script – demonstrates the public API of @nan0web/changelog.
 *
 * Features shown:
 *   • Version parsing, comparison and stringification
 *   • Change creation from markdown strings
 *   • Changelog parsing, version extraction, latest/recent version lookup
 *   • Adding a new Change to an existing Changelog
 *   • Simple, colour‑coded console UI for better developer experience
 */

import process from "node:process"
import Logger from "@nan0web/log"
import Change from '../src/Change.js'
import Changelog from '../src/Changelog.js'
import Version from '../src/Version.js'

// Sample changelog content (real‑look project with three versions)
const SAMPLE = `# Changelog
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

async function main(argv) {

	const logger = new Logger(Logger.detectLevel(argv))

	/**
	 * Helper – prints a header with colour.
	 */
	function header(text) {
		logger.info(
			Logger.style(`\n=== ${text} ===\n`, { bgColor: Logger.BG_MAGENTA, color: Logger.WHITE })
		)
	}

	/**
	 * Demonstrates Version utilities.
	 */
	function demoVersion() {
		header('Version API')
		const vStr = 'v1.2.3'
		const v = new Version(vStr)

		logger.info(
			Logger.style('Created from string:', { color: Logger.GREEN }) + ' ' + vStr
		)
		logger.info(
			Logger.style('Parsed →', { color: Logger.GREEN }) + ' ' + v.toString()
		)
		logger.info(
			Logger.style('Major:', { color: Logger.GREEN }) + ' ' + v.major + ' '
			+ Logger.style('Minor:', { color: Logger.GREEN }) + ' ' + v.minor + ' '
			+ Logger.style('Patch:', { color: Logger.GREEN }) + ' ' + v.patch
		)

		const other = new Version('v2.0.0')
		logger.info(
			Logger.style(`Is ${v.toString()} lower than ${other.toString()}?`, { color: Logger.YELLOW })
			+ ' ' + v.lowerThan(other)
		)
		logger.info(
			Logger.style(`Is ${other.toString()} higher than ${v.toString()}?`, { color: Logger.YELLOW })
			+ ' ' + other.higherThan(v)
		)

		const md = Version.stringify(v, { format: '.md', skipPrefix: true })
		logger.info(
			Logger.style('\nMarkdown representation:', { color: Logger.CYAN }) + '\n' + md
		)
	}

	/**
	 * Demonstrates Change creation from markdown strings.
	 */
	function demoChange() {
		header('Change API')
		const md = `- Added a brand new feature
- Fixed a critical bug`

		const change = Change.from({
			added: md,
			fixed: '- Fixed memory leak',
			major: 1,
			minor: 3,
			patch: 0,
			date: '2025-02-15',
		})

		logger.info(
			Logger.style('Change instance created. Version →', { color: Logger.GREEN }) + ' ' + change.toString()
		)
		logger.info(
			Logger.style('Added section content:', { color: Logger.GREEN }) + ' ' + change.added.children[0].content
		)
		logger.info(
			Logger.style('Fixed section content:', { color: Logger.GREEN }) + ' ' + change.fixed.children[0].content
		)
	}

	/**
	 * Demonstrates parsing a changelog and extracting versions.
	 */
	function demoChangelogParse() {
		header('Changelog parsing')
		const log = new Changelog()
		log.parse(SAMPLE)

		logger.info(
			Logger.style('Detected versions (newest → oldest):', { color: Logger.GREEN }) + ' ' + log.getVersions()
		)
		logger.info(
			Logger.style('Latest (last) version in file:', { color: Logger.GREEN }) + ' ' + log.getLatestVersion()
		)
		logger.info(
			Logger.style('Most recent (first) version in file:', { color: Logger.GREEN }) + ' ' + log.getRecentVersion()
		)
	}

	/**
	 * Demonstrates adding a new Change to a parsed changelog.
	 */
	function demoChangelogAdd() {
		header('Adding a Change to Changelog')
		const log = new Changelog()
		log.parse(SAMPLE)

		const newChange = Change.from({
			added: '- Awesome new widget',
			major: 1,
			minor: 3,
			patch: 0,
			date: new Date(),
		})

		log.addChange(newChange)

		logger.info(
			Logger.style('After adding, document length →', { color: Logger.GREEN }) + ' ' + log.document.children.length
		)
		logger.info(
			Logger.style('First element (new version heading):', { color: Logger.GREEN }) + ' ' + log.document.children[0].content
		)
	}

	/**
	 * Run all demos sequentially.
	 */
	demoVersion()
	demoChange()
	demoChangelogParse()
	demoChangelogAdd()
	logger.info(
		Logger.style('All demos completed successfully!', { color: Logger.GREEN, bold: true })
	)
}
main(process.argv.slice(2)).then(() => {
	process.exit(0)
}).catch(err => {
	console.error(err.stack ?? err.message)
	process.exit(1)
})