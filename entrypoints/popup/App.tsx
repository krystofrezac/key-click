import {
	addShortcut,
	getShortcuts,
	getShortcutsForUrl,
	removeShortcut,
} from "@/utils/storage";
import type { Shortcut } from "@/utils/types";
import { ShortcutForm } from "./components/ShortcutForm";
import { ShortcutList } from "./components/ShortcutList";

function App() {
	const [currentUrl, setCurrentUrl] = useState<string>("");
	const [filteredShortcuts, setFilteredShortcuts] = useState<Shortcut[]>([]);
	const [allShortcuts, setAllShortcuts] = useState<Shortcut[]>([]);

	// Load current tab URL and shortcuts on mount
	useEffect(() => {
		async function init() {
			const tabs = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			const url = tabs[0]?.url ?? "";
			setCurrentUrl(url);

			const all = await getShortcuts();
			setAllShortcuts(all);
			const filtered = await getShortcutsForUrl(url);
			setFilteredShortcuts(filtered);
		}
		init();
	}, []);

	// Listen for storage changes to keep list in sync
	useEffect(() => {
		const listener = async (_changes: unknown, areaName: string) => {
			if (areaName !== "sync") return;
			const all = await getShortcuts();
			setAllShortcuts(all);
			if (currentUrl) {
				const filtered = await getShortcutsForUrl(currentUrl);
				setFilteredShortcuts(filtered);
			}
		};

		browser.storage.onChanged.addListener(listener);
		return () => {
			browser.storage.onChanged.removeListener(listener);
		};
	}, [currentUrl]);

	const handleAdd = useCallback(async (shortcut: Shortcut) => {
		await addShortcut(shortcut);
	}, []);

	const handleDelete = useCallback(async (id: string) => {
		await removeShortcut(id);
	}, []);

	return (
		<div className="p-4">
			<h1 className="text-lg font-bold mb-3">Key-Click</h1>

			<section className="mb-4">
				<h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">
					Shortcuts
				</h2>
				<ShortcutList shortcuts={filteredShortcuts} onDelete={handleDelete} />
			</section>

			<section>
				<h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-2">
					Add Shortcut
				</h2>
				<ShortcutForm onAdd={handleAdd} existingShortcuts={allShortcuts} />
			</section>
		</div>
	);
}

export default App;
