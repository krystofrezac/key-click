import { getShortcutsForUrl } from '@/utils/storage';
import type { Shortcut } from '@/utils/types';

export default defineContentScript({
  matches: ['<all_urls>'],
  registration: 'runtime',

  async main() {
    let shortcuts: Shortcut[] = await getShortcutsForUrl(window.location.href);

    browser.storage.onChanged.addListener(async (changes, areaName) => {
      if (areaName !== 'sync') return;
      if (changes.shortcuts) {
        shortcuts = await getShortcutsForUrl(window.location.href);
      }
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        if (
          event.key === shortcut.keyCombo.key &&
          event.ctrlKey === shortcut.keyCombo.ctrlKey &&
          event.shiftKey === shortcut.keyCombo.shiftKey &&
          event.altKey === shortcut.keyCombo.altKey &&
          event.metaKey === shortcut.keyCombo.metaKey
        ) {
          event.preventDefault();
          event.stopPropagation();

          try {
            const elements = document.querySelectorAll(shortcut.selector);

            if (elements.length === 0) {
              console.warn(
                `[Key-Click] Warning: no element found for selector "${shortcut.selector}"`
              );
            } else if (elements.length === 1) {
              (elements[0] as HTMLElement).click();
            } else {
              console.warn(
                `[Key-Click] Warning: selector "${shortcut.selector}" matched ${elements.length} elements. Clicking the first one.`
              );
              (elements[0] as HTMLElement).click();
            }
          } catch (err) {
            console.error(
              `[Key-Click] Error: invalid selector "${shortcut.selector}"`,
              err
            );
          }

          break;
        }
      }
    });
  },
});
