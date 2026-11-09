/*
  Apply saved settings to the page. Runs before the first screen draws
  (so there is no flash) and again after every change.
*/
export function applySettingsToDocument(settings, root = document.documentElement) {
  root.classList.toggle('high-contrast', settings.highContrast)
  root.dataset.controlSize = settings.controlSize
  root.classList.toggle('simplified-layout', settings.simplifiedLayout)
  root.classList.toggle('hide-note-names', !settings.showNoteNames)
  root.classList.toggle('colour-blind-notes', settings.colourBlindNotes)

  // Keep the browser bar colour in step with the page background.
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    const bg = getComputedStyle(root).getPropertyValue('--color-bg').trim()
    if (bg) meta.setAttribute('content', bg)
  }
}
