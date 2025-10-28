# @nan0web/changelog

Parse and modify changelogs programmatically.

|[Status](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Documentation|Test coverage|Features|Npm version|
|---|---|---|---|---|
 |🟢 `99.0%` |🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/changelog/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/changelog/blob/main/docs/uk/README.md) |🟢 `94.6%` |✅ d.ts 📜 system.md 🕹️ playground |0.1.0 |

## Description

The `@nan0web/changelog` package provides tools to parse, manipulate, and generate `CHANGELOG.md` files in a structured way.
Inspired by [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Core classes:

- `Changelog` — parses and manages the entire changelog document.
- `Version` — represents a version entry with SemVer comparison.
- `Change` — encapsulates change entries like Added, Fixed, etc.
- `Section` — groups related changes under headings (e.g., `### Added`).

Use cases:

- Automate release notes generation.
- Validate changelog structure in CI.
- Query latest or specific version changes.
- Programmatically add new changes or versions.

## Installation

How to install with npm?
```bash
npm install @nan0web/changelog
```

How to install with pnpm?
```bash
pnpm add @nan0web/changelog
```

How to install with yarn?
```bash
yarn add @nan0web/changelog
```

## Usage

### Initialize a Changelog

Start with an empty changelog and add required metadata.

How to initialize a new Changelog?
```js
import { Changelog } from '@nan0web/changelog'
const log = new Changelog()
log.init()

console.info(String(log.document))
// # Changelog
// All notable changes to this project will be documented in this file.

// The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

// ---
```
### Parse Existing Changelog

Parse a markdown string into a structured changelog.

How to parse existing changelog text?
```js
import { Changelog } from '@nan0web/changelog'
const log = new Changelog()
const text = `# Changelog
All notable changes to this project will be documented in this file.

## [1.0.0] - 2023-12-01
### Added
- Initial release`
log.parse(text)

console.info(String(log.document))
// # Changelog
// All notable changes to this project will be documented in this file.

// ---

// ## [1.0.0] - 2023-12-01
// ### Added

// - Initial release

```
### Add a New Change

Create a `Change` and add it under the right version.

How to add a new change to a version?
```js
import { Changelog } from '@nan0web/changelog'
const log = new Changelog()
log.parse(`# Changelog
\n
## [1.0.0] - 2023-12-01
### Added
- Initial release`)

const recent = log.getRecentVersion()
recent?.getSection("Added")?.add("New CLI support")

console.info(String(log.document))
// # Changelog

// ---

// ## [1.0.0] - 2023-12-01
// ### Added

// - Initial release
// - New CLI support

```
### Add Another Change to Existing Version

Add changes incrementally to the same version.

How to add additional changes to an existing version?
```js
import { Changelog, Version, Section } from '@nan0web/changelog'
const log = new Changelog()

// Initialize with some content
log.init()
const version = new Version({
	major: 1,
	minor: 1,
	patch: 0,
	date: "2024-03-01"
})
version.add(
	new Section({ content: "Added" }).add("New CLI support")
)
version.add(
	new Section({ content: "Fixed" }).add("Bug in version parsing")
)

log.document.add(version)
version.getSection("Fixed")?.add("Crash on startup")

console.info(String(log.document))
// # Changelog
// All notable changes to this project will be documented in this file.

// The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

// ---
// ## [1.1.0] - 2024-03-01
// ### Added
// - New CLI support

// ### Fixed
// - Bug in version parsing
// - Crash on startup
```
### Get Versions

Extract list of versions in order they appear (newest first).

How to get list of versions in changelog?
```js
import { Changelog } from '@nan0web/changelog'
const log = new Changelog()
log.parse(`# Changelog
\n
## [1.1.1] - 2024-02-15
\n
## [1.1.0] - 2024-01-20
\n
## [1.0.0] - 2023-12-01`)

const versions = log.getVersions()
console.info(JSON.stringify(versions))
// ["1.1.1","1.1.0","1.0.0"]
```
### Get Latest and Recent Version

Use `getLatestVersion()` for oldest, `getRecentVersion()` for newest.

How to get latest and recent versions?
```js
import { Changelog } from '@nan0web/changelog'
const log = new Changelog()
log.parse(`# Changelog
\n
## [1.1.1] - 2024-02-15
\n
## [1.1.0] - 2024-01-20
\n
## [1.0.0] - 2023-12-01`)

const latest = log.getLatestVersion()
const recent = log.getRecentVersion()

console.info(`Latest: ${latest?.ver}, Recent: ${recent?.ver}`)
// Latest: 1.0.0, Recent: 1.1.1
```
### Retrieve Specific Version Changes

Extract structured data for a specific version.

How to retrieve changes for a specific version?
```js
import { Changelog } from '@nan0web/changelog'
const log = new Changelog()
log.parse(`# Changelog
\n
## [1.1.0] - 2024-01-20
### Added
- Dark mode
- CSV export
\n
## [1.0.0] - 2023-12-01
### Added
- Initial release`)

const entry = log.getVersion('1.1.0')
console.info(JSON.stringify(entry?.ver))
// "1.1.0"
```
### Version Comparison

Compare versions using SemVer rules.

How to compare versions using SemVer?
```js
import { Version } from '@nan0web/changelog'
const v1 = new Version("1.2.3")
const v2 = new Version("1.2.4")
const v3 = new Version("1.3.0")

console.info(`v1 < v2: ${v1.lowerThan(v2)}`)
// v1 < v2: true
console.info(`v2 > v1: ${v2.higherThan(v1)}`)
// v2 > v1: true
console.info(`v3 >= v1: ${v3.acceptableTo(v1)}`)
// v3 >= v1: true
```
### Version String Formatting

Generate version strings in markdown or plain text.

How to format Version as string in different formats?
```js
import { Version, Section } from '@nan0web/changelog'
const v = new Version({ major: 1, minor: 2, patch: 3, date: "2025-01-01" })
const section = new Section({ content: "Added" })
section.add(new Change({ content: "New feature" }))
v.add(section)

console.info(`Markdown:\n${v.toString()}`)
// Markdown:
// ## [1.2.3] - 2025-01-01
// ### Added
// - New feature

console.info(`Text:\n${v.toString({ format: ".txt" })}`)
// Text:
// v1.2.3 - 2025-01-01
//   Added
//     - New feature
```
## API

### Changelog

* **Properties**
  * `versions` – Map of version strings to `Version` instances.
  * `title` – `MDHeading1` of the document.
  * `document` – The root `MDElement` tree.

* **Methods**
  * `parse(text)` – parses markdown into structured blocks.
  * `getVersions()` – returns array of version strings.
  * `getVersion(version)` – returns `Version` object for a version.
  * `addChange(change)` – adds a `Change` to the right version.
  * `getLatestVersion()` – returns oldest version (last in file).
  * `getRecentVersion()` – returns newest version (first in file).
  * `init()` – initializes a new changelog with boilerplate.

### Version

* **Properties**
  * `major`, `minor`, `patch` – SemVer components.
  * `date` – release date.
  * `ver` – getter for `"major.minor.patch"` string.
  * `content` – formatted version line.

* **Methods**
  * `higherThan(other)` – true if this version is greater.
  * `lowerThan(other)` – true if this version is smaller.
  * `acceptableTo(other)` – true if this >= other.
  * `toString()` – returns markdown string of version and children.
  * `toString({ format: '.txt' })` – returns text-mode flat string.
  * `static from(input)` – creates a Version from string/object.

### Change

* **Properties**
  * `major`, `minor`, `patch` – version targeting.
  * `date` – change date.
  * `content` – change description.

* **Methods**
  * `static from(input)` – returns a Change instance.
  * `static fromElementString(str)` – parse from markdown list item.

### Section

* **Methods**
  * `add(change)` – adds a change item to this section.

## Java•Script

Uses `d.ts` files for autocompletion

## CLI Playground

Run interactive demos.

How to run playground script?
```bash
pnpm play
```

## Contributing

How to contribute? - [check here](./CONTRIBUTING.md)

## License

How to license ISC? - [check here](./LICENSE)
