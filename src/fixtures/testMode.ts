// Test data mode: open the app with ?testdata to preview the teacher screens with made-up
// learners. Everything is held in memory for this visit only; nothing is read from or written to
// the device, and a banner says so on every screen. Never mixed with real learners' records.
export const TEST_DATA: boolean = typeof location !== 'undefined' && new URLSearchParams(location.search).has('testdata');
