import type { KeyCombo, Shortcut } from "@/utils/types";
import { KeyRecorder } from "./KeyRecorder";

interface Props {
	onAdd: (shortcut: Shortcut) => void;
	existingShortcuts: Shortcut[];
}

const inputClass =
	"w-full bg-neutral-700 border border-neutral-600 rounded px-3 py-2 text-white text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "text-sm text-neutral-300 mb-1";

export function ShortcutForm({ onAdd, existingShortcuts }: Props) {
	const [name, setName] = useState("");
	const [keyCombo, setKeyCombo] = useState<KeyCombo | null>(null);
	const [selector, setSelector] = useState("");
	const [urlPattern, setUrlPattern] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!name || !keyCombo || !selector || !urlPattern) {
			setError("All fields are required");
			return;
		}

		const isDuplicate = existingShortcuts.some(
			(s) =>
				s.urlPattern === urlPattern &&
				s.keyCombo.key === keyCombo.key &&
				s.keyCombo.ctrlKey === keyCombo.ctrlKey &&
				s.keyCombo.shiftKey === keyCombo.shiftKey &&
				s.keyCombo.altKey === keyCombo.altKey &&
				s.keyCombo.metaKey === keyCombo.metaKey,
		);

		if (isDuplicate) {
			setError(
				"A shortcut with this key combination already exists for this URL pattern",
			);
			return;
		}

		onAdd({ id: crypto.randomUUID(), name, keyCombo, selector, urlPattern });
		setName("");
		setKeyCombo(null);
		setSelector("");
		setUrlPattern("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<div>
				<label htmlFor="name" className={labelClass}>
					Name
				</label>
				<input
					id="name"
					type="text"
					placeholder="Shortcut name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className={inputClass}
				/>
			</div>
			<div>
				{/* biome-ignore lint/a11y/noLabelWithoutControl: KeyRecorder is a custom control */}
				<label className={labelClass}>
					Key combination
					<KeyRecorder value={keyCombo} onChange={setKeyCombo} />
				</label>
			</div>
			<div>
				<label htmlFor="selector" className={labelClass}>
					CSS Selector
				</label>
				<input
					id="selector"
					type="text"
					placeholder=".my-button"
					value={selector}
					onChange={(e) => setSelector(e.target.value)}
					className={inputClass}
				/>
			</div>
			<div>
				<label htmlFor="url-pattern" className={labelClass}>
					URL Pattern
				</label>
				<input
					id="url-pattern"
					type="text"
					placeholder="*.example.com/*"
					value={urlPattern}
					onChange={(e) => setUrlPattern(e.target.value)}
					className={inputClass}
				/>
			</div>
			{error && <p className="text-red-400 text-sm">{error}</p>}
			<button
				type="submit"
				className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2"
			>
				Add
			</button>
		</form>
	);
}
