import { getShortcutsForUrl } from "@/utils/storage";
import type { KeyCombo, Shortcut } from "@/utils/types";

function keyCombosMatch(a: KeyCombo, b: KeyCombo): boolean {
	return (
		a.key === b.key &&
		a.ctrlKey === b.ctrlKey &&
		a.shiftKey === b.shiftKey &&
		a.altKey === b.altKey &&
		a.metaKey === b.metaKey
	);
}

function executeShortcut(shortcut: Shortcut): void {
	try {
		const elements = document.querySelectorAll(shortcut.selector);

		if (elements.length === 0) {
			console.warn(
				`[Key-Click] Warning: no element found for selector "${shortcut.selector}"`,
			);
		} else if (elements.length === 1) {
			(elements[0] as HTMLElement).click();
		} else {
			console.warn(
				`[Key-Click] Warning: selector "${shortcut.selector}" matched ${elements.length} elements. Clicking the first one.`,
			);
			(elements[0] as HTMLElement).click();
		}
	} catch (err) {
		console.error(
			`[Key-Click] Error: invalid selector "${shortcut.selector}"`,
			err,
		);
	}
}

export default defineContentScript({
	matches: ["<all_urls>"],
	registration: "runtime",

	async main() {
		let shortcuts: Shortcut[] = await getShortcutsForUrl(window.location.href);

		let pendingSequence: KeyCombo[] = [];
		let sequenceTimeout: ReturnType<typeof setTimeout> | null = null;

		function resetSequence(): void {
			pendingSequence = [];
			if (sequenceTimeout !== null) {
				clearTimeout(sequenceTimeout);
				sequenceTimeout = null;
			}
		}

		browser.storage.onChanged.addListener(async (changes, areaName) => {
			if (areaName !== "sync") return;
			if (changes.shortcuts) {
				shortcuts = await getShortcutsForUrl(window.location.href);
			}
		});

		document.addEventListener("keydown", (event: KeyboardEvent) => {
			const target = event.target as HTMLElement;
			if (
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				target instanceof HTMLSelectElement ||
				target.isContentEditable
			) {
				resetSequence();
				return;
			}

			const currentCombo: KeyCombo = {
				key: event.key,
				ctrlKey: event.ctrlKey,
				shiftKey: event.shiftKey,
				altKey: event.altKey,
				metaKey: event.metaKey,
			};

			if (sequenceTimeout !== null) {
				clearTimeout(sequenceTimeout);
				sequenceTimeout = null;
			}

			pendingSequence = [...pendingSequence, currentCombo];

			const n = pendingSequence.length;

			const prefixMatch = shortcuts.find(
				(s) =>
					s.keyCombos.length > n &&
					s.keyCombos
						.slice(0, n)
						.every((combo, i) => keyCombosMatch(combo, pendingSequence[i])),
			);

			const fullMatch = shortcuts.find(
				(s) =>
					s.keyCombos.length > 0 &&
					s.keyCombos.length === n &&
					s.keyCombos.every((combo, i) =>
						keyCombosMatch(combo, pendingSequence[i]),
					),
			);

			if (prefixMatch) {
				event.preventDefault();
				event.stopPropagation();
				sequenceTimeout = setTimeout(() => resetSequence(), 1000);
			} else if (fullMatch) {
				event.preventDefault();
				event.stopPropagation();
				executeShortcut(fullMatch);
				resetSequence();
			} else {
				resetSequence();
			}
		});
	},
});
