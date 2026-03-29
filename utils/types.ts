export interface KeyCombo {
	key: string;
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
	metaKey: boolean;
}

export interface Shortcut {
	id: string;
	name: string;
	keyCombos: KeyCombo[];
	selector: string;
	urlPattern: string;
}
