import { browser } from 'wxt/browser';
import type { Shortcut } from '@/utils/types';
import { urlMatchesPattern } from '@/utils/patterns';

const STORAGE_KEY = 'shortcuts';

export async function getShortcuts(): Promise<Shortcut[]> {
  const result = await browser.storage.sync.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as Shortcut[] | undefined) ?? [];
}

export async function addShortcut(shortcut: Shortcut): Promise<void> {
  const shortcuts = await getShortcuts();
  shortcuts.push(shortcut);
  await browser.storage.sync.set({ [STORAGE_KEY]: shortcuts });
}

export async function removeShortcut(id: string): Promise<void> {
  const shortcuts = await getShortcuts();
  const filtered = shortcuts.filter(s => s.id !== id);
  await browser.storage.sync.set({ [STORAGE_KEY]: filtered });
}

export async function getShortcutsForUrl(url: string): Promise<Shortcut[]> {
  const shortcuts = await getShortcuts();
  return shortcuts.filter(s => urlMatchesPattern(url, s.urlPattern));
}
