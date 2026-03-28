import type { KeyCombo } from "@/utils/types";

function isMac(): boolean {
	try {
		return navigator.platform.includes("Mac");
	} catch {
		return false;
	}
}

export function formatKeyCombo(combo: KeyCombo): string {
	const mac = isMac();
	const parts: string[] = [];

	if (combo.ctrlKey) parts.push(mac ? "⌃" : "Ctrl");
	if (combo.altKey) parts.push(mac ? "⌥" : "Alt");
	if (combo.shiftKey) parts.push(mac ? "⇧" : "Shift");
	if (combo.metaKey) parts.push(mac ? "⌘" : "Meta");

	const key = combo.key.charAt(0).toUpperCase() + combo.key.slice(1);
	parts.push(key);

	return parts.join(" + ");
}
