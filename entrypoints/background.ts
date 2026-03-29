import { toMatchPattern } from "@/utils/patterns";
import { getShortcuts } from "@/utils/storage";

const CONTENT_SCRIPT_ID = "key-click-content";

async function registerContentScripts() {
	// Unregister existing content scripts (ignore error if none registered)
	try {
		await browser.scripting.unregisterContentScripts({
			ids: [CONTENT_SCRIPT_ID],
		});
	} catch {
		// No scripts registered yet, that's fine
	}

	// Get all shortcuts and collect unique URL patterns
	const shortcuts = await getShortcuts();
	const uniquePatterns = [...new Set(shortcuts.map((s) => s.urlPattern))];

	if (uniquePatterns.length === 0) {
		return; // No shortcuts, no content scripts needed
	}

	// Convert to Chrome match patterns
	const matchPatterns = uniquePatterns.map(toMatchPattern);

	// Register the content script
	await browser.scripting.registerContentScripts([
		{
			id: CONTENT_SCRIPT_ID,
			matches: matchPatterns,
			js: ["content-scripts/content.js"],
			runAt: "document_idle",
		},
	]);
}

export default defineBackground(() => {
	// Register on startup
	registerContentScripts();

	// Re-register on install/update
	browser.runtime.onInstalled.addListener(() => {
		registerContentScripts();
	});

	// Re-register when shortcuts change
	browser.storage.onChanged.addListener((changes, areaName) => {
		if (areaName !== "sync") return;
		if (changes.shortcuts) {
			registerContentScripts();
		}
	});
});
