import { formatKeyCombo } from "@/utils/keyCombo";
import type { Shortcut } from "@/utils/types";

interface Props {
	shortcuts: Shortcut[];
	onDelete: (id: string) => void;
}

export function ShortcutList({ shortcuts, onDelete }: Props) {
	if (shortcuts.length === 0) {
		return (
			<p className="text-neutral-400 text-sm py-4 text-center">
				No shortcuts for this page
			</p>
		);
	}

	return (
		<ul>
			{shortcuts.map((shortcut) => (
				<li
					key={shortcut.id}
					className="flex items-center justify-between py-2 border-b border-neutral-700"
				>
					<div className="flex flex-col gap-1 min-w-0">
						<span className="text-white font-semibold text-sm">
							{shortcut.name}
						</span>
						<span className="bg-neutral-700 px-2 py-0.5 rounded text-xs font-mono text-white self-start">
							{formatKeyCombo(shortcut.keyCombo)}
						</span>
						<code className="text-neutral-400 text-xs truncate">
							{shortcut.selector}
						</code>
						<span className="text-neutral-400 text-xs truncate">
							{shortcut.urlPattern}
						</span>
					</div>
					<button
						type="button"
						onClick={() => onDelete(shortcut.id)}
						className="text-red-400 hover:text-red-300 ml-3 text-lg leading-none shrink-0"
					>
						×
					</button>
				</li>
			))}
		</ul>
	);
}
