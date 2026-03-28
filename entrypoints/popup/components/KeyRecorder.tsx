import { formatKeyCombo } from "@/utils/keyCombo";
import type { KeyCombo } from "@/utils/types";

const MODIFIER_KEYS = new Set(["Control", "Shift", "Alt", "Meta"]);

interface Props {
	value: KeyCombo | null;
	onChange: (combo: KeyCombo) => void;
}

export function KeyRecorder({ value, onChange }: Props) {
	const [isRecording, setIsRecording] = useState(false);

	useEffect(() => {
		if (!isRecording) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			event.preventDefault();
			event.stopPropagation();

			if (event.key === "Escape") {
				setIsRecording(false);
				return;
			}

			if (MODIFIER_KEYS.has(event.key)) return;

			onChange({
				key: event.key,
				ctrlKey: event.ctrlKey,
				shiftKey: event.shiftKey,
				altKey: event.altKey,
				metaKey: event.metaKey,
			});
			setIsRecording(false);
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isRecording, onChange]);

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={() => setIsRecording((prev) => !prev)}
				className={`px-3 py-1 rounded text-sm bg-neutral-700 hover:bg-neutral-600 text-white${isRecording ? " ring-2 ring-orange-500" : ""}`}
			>
				{isRecording ? "Press a key..." : "Record"}
			</button>
			{value ? (
				<span className="bg-neutral-700 px-2 py-0.5 rounded text-xs font-mono text-white">
					{formatKeyCombo(value)}
				</span>
			) : (
				<span className="text-neutral-400 text-sm">None</span>
			)}
		</div>
	);
}
