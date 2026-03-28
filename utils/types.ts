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
  keyCombo: KeyCombo;
  selector: string;
  urlPattern: string;
}
