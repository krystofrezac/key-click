import { formatKeyCombo } from "@/utils/keyCombo";
import type { KeyCombo } from "@/utils/types";

const MODIFIER_KEYS = new Set(["Control", "Shift", "Alt", "Meta"]);

interface Props {
	value: KeyCombo[];
	onChange: (combos: KeyCombo[]) => void;
}

export function KeyRecorder({ value, onChange }: Props) {
	const [isRecording, setIsRecording] = useState(false);
	const valueRef = useRef(value);
	valueRef.current = value;

	useEffect(() => {
		if (isRecording && value.length >= 2) {
			setIsRecording(false);
		}
	}, [isRecording, value.length]);

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

			const newCombo: KeyCombo = {
				key: event.key,
				ctrlKey: event.ctrlKey,
				shiftKey: event.shiftKey,
				altKey: event.altKey,
				metaKey: event.metaKey,
			};
			onChange([...valueRef.current, newCombo]);
			setIsRecording(false);
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isRecording, onChange]);

	const handleRemove = (index: number) => {
		onChange(value.filter((_, i) => i !== index));
	};

	const recordingButton = (
		<button
			type="button"
			onClick={() => setIsRecording((prev) => !prev)}
			className="px-3 py-1 rounded text-sm bg-neutral-700 hover:bg-neutral-600 text-white ring-2 ring-orange-500"
		>
			Press a key...
		</button>
	);

	const keyBadge = (combo: KeyCombo, index: number) => (
		<span
			key={index}
			className="bg-neutral-700 px-2 py-0.5 rounded text-xs font-mono text-white flex items-center gap-1"
		>
			{formatKeyCombo(combo)}
			<button
				type="button"
				onClick={() => handleRemove(index)}
				className="leading-none hover:text-neutral-300"
			>
				×
			</button>
		</span>
	);

	const separator = <span className="text-neutral-400 text-sm">→</span>;

	if (isRecording && value.length < 2) {
		return (
			<div className="flex items-center gap-2">
				{value.length === 0 ? (
					<>
						{recordingButton}
						<span className="text-neutral-400 text-sm">None</span>
					</>
				) : (
					<>
						{keyBadge(value[0], 0)}
						{separator}
						{recordingButton}
					</>
				)}
			</div>
		);
	}

	if (value.length === 0) {
		return (
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => setIsRecording(true)}
					className="px-3 py-1 rounded text-sm bg-neutral-700 hover:bg-neutral-600 text-white"
				>
					Record
				</button>
				<span className="text-neutral-400 text-sm">None</span>
			</div>
		);
	}

	if (value.length === 1) {
		return (
			<div className="flex items-center gap-2">
				{keyBadge(value[0], 0)}
				{separator}
				<button
					type="button"
					onClick={() => setIsRecording(true)}
					className="px-3 py-1 rounded text-sm bg-neutral-700 hover:bg-neutral-600 text-white"
				>
					+
				</button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			{keyBadge(value[0], 0)}
			{separator}
			{keyBadge(value[1], 1)}
		</div>
	);
}
