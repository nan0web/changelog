#!/usr/bin/env node

import Version from "../src/Version.js"
import { pressAnyKey } from "./utils.js"

export async function runVersionComparisonDemo(console) {
	console.clear()
	console.success("Version Comparison Demo")
	console.info("Demonstrating SemVer version comparison utilities")

	// --- Version Creation Demo ---
	console.info("\n📦 Version Creation:")

	const v1 = new Version("v1.2.3")
	const v2 = new Version({ major: 1, minor: 2, patch: 4 })
	const v3 = new Version({ major: 2, minor: 0, patch: 0 })

	console.info(`Version 1: ${v1.ver} (${v1.toString()})`)
	console.info(`Version 2: ${v2.ver} (${v2.toString()})`)
	console.info(`Version 3: ${v3.ver} (${v3.toString()})`)

	await pressAnyKey(console)

	// --- Version Comparison Demo ---
	console.info("\n⚖️ Version Comparisons:")

	console.info(`${v1.ver} > ${v2.ver}: ${v1.higherThan(v2)}`)
	console.info(`${v1.ver} < ${v2.ver}: ${v1.lowerThan(v2)}`)
	console.info(`${v2.ver} > ${v1.ver}: ${v2.higherThan(v1)}`)
	console.info(`${v2.ver} < ${v1.ver}: ${v2.lowerThan(v1)}`)
	console.info(`${v3.ver} > ${v1.ver}: ${v3.higherThan(v1)}`)
	console.info(`${v1.ver} < ${v3.ver}: ${v1.lowerThan(v3)}`)
	console.info(`${v1.ver} >= ${v2.ver}: ${v1.acceptableTo(v2)}`)
	console.info(`${v2.ver} >= ${v1.ver}: ${v2.acceptableTo(v1)}`)

	await pressAnyKey(console)

	// --- Version Stringification Demo ---
	console.info("\n📄 Version Stringification:")

	console.info(`Markdown format: ${v1.toString()}`)
	console.info(`Text format: ${v1.toString({ format: ".txt" })}`)
	console.info(`Version only: ${v1.toString({ skipPrefix: true })}`)

	console.success("\nVersion comparison demo completed! ✨")
	await pressAnyKey(console)
}