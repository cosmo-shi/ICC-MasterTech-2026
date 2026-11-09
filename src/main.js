/*
  App start. Order matters:
  1. apply saved settings (high contrast, control size) before anything is drawn
  2. draw the header, the sound banner and the <main> area
  3. start the router, which draws the screen for the current address
*/
import './styles/tokens.css'
import './styles/base.css'
import './styles/shell.css'

import { getSettings, subscribe } from './settings/settings.js'
import { applySettingsToDocument } from './settings/apply.js'
import { createAppHeader } from './components/app-header.js'
import { createAudioBanner } from './components/audio-banner.js'
import { el } from './components/dom.js'
import { startRouter } from './router.js'

applySettingsToDocument(getSettings())
subscribe(applySettingsToDocument)

const header = createAppHeader()
const banner = createAudioBanner()
const main = el('main', { id: 'main', class: 'app__main' })

document.getElementById('app').replaceChildren(
  el('div', { class: 'app' }, [header.element, banner.element, main]),
)

startRouter({
  outlet: main,
  // First visit goes to onboarding; a returning student opens on the instrument list.
  getHomeHash: () => (getSettings().onboardingDone ? '#/instruments' : '#/onboarding'),
  onRouteChange: ({ name, route }) => {
    header.setCurrent(name)
    banner.update(route?.needsSound)
  },
})
