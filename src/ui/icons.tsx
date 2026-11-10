// Interface icons. One family: Lucide (https://lucide.dev, ISC licence, see ASSETS.md and
// public/licences/lucide.txt). The icons are Lucide's own drawings, imported from the
// `lucide-react` package; nothing here redraws or edits them.
//
// Every interface icon goes through <Icon>, so size, stroke, colour and states are set in one place:
//   - Sizes: 16 (inline with small text), 20 (inside chips and small buttons), 24 (buttons, tabs),
//     32 (choice cards), 48 (empty states, the big Hear-it button).
//   - Stroke: Lucide's 2-unit stroke on the 24 grid, adjusted per size so lines look the same weight
//     (optical alignment): heavier at 16, lighter at 32 and 48.
//   - Colour: always currentColor, so an icon takes its control's text colour in Day and Night,
//     selected (dusk), disabled (faded with the control) and pressed (sun) states. Icons never carry
//     meaning by colour alone.
//   - Icons are decorative (aria-hidden). The control's visible label or aria-label names it; icons
//     that would be ambiguous alone (for children especially) keep a visible word beside them.
//
// Not interface icons, so not here: musical notation (VexFlow and the notation renderer), the
// instruments (functional drawings in instruments.tsx), and the brand mark and scenery (brand.tsx).

import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpen,
  Cable,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleHelp,
  CircleX,
  ClipboardList,
  Cloud,
  Contrast,
  CloudOff,
  CloudUpload,
  Drum,
  Ear,
  FolderOpen,
  GraduationCap,
  Guitar,
  HandHelping,
  HardDrive,
  Headphones,
  Info,
  KeyboardMusic,
  Layers,
  Library,
  Lightbulb,
  ListMusic,
  Lock,
  type LucideIcon,
  Metronome,
  Mic,
  MicOff,
  Minus,
  Music,
  Music2,
  Music3,
  NotebookPen,
  Pause,
  Pencil,
  Piano,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  RotateCwSquare,
  Save,
  Settings,
  Sprout,
  Square,
  Star,
  Trash2,
  TriangleAlert,
  Undo2,
  UserRound,
  Users,
  Volume2,
  X,
} from 'lucide-react';

/** Each name says what the icon means in Carmen, not what it looks like. */
const ICONS = {
  // Places
  play: KeyboardMusic, // the Play tab: the instruments
  learn: BookOpen,
  music: FolderOpen, // My music
  saved: Save,
  empty: ListMusic,
  grownups: GraduationCap, // Teacher
  notes: Library, // Music words (the theory library)
  // Actions
  gear: Settings,
  stop: Square,
  playback: Play,
  pause: Pause,
  undo: Undo2,
  retry: RotateCcw,
  back: ArrowLeft,
  forward: ArrowRight,
  prev: ChevronLeft,
  next: ChevronRight,
  close: X,
  trash: Trash2,
  plus: Plus,
  minus: Minus,
  edit: Pencil,
  note: NotebookPen, // a teacher's note
  assign: ClipboardList,
  sync: RefreshCw,
  // Sound and instruments
  sound: Volume2,
  click: Metronome,
  piano: Piano,
  drum: Drum,
  guitar: Guitar,
  ear: Ear, // hear it / listen to the music
  listen: AudioLines, // Carmen is listening (your turn)
  headphones: Headphones,
  mic: Mic,
  micOff: MicOff,
  midi: Cable,
  record: Circle, // drawn filled (see FILLED): the usual record mark
  // People and help
  people: Users,
  person: UserRound,
  help: HandHelping, // More help
  question: CircleHelp,
  hint: Lightbulb,
  lock: Lock,
  rotate: RotateCwSquare,
  star: Star,
  // Status: always with a word beside them
  check: Check,
  good: CircleCheck,
  near: CircleDot,
  miss: CircleX,
  missed: CircleDashed,
  ring: Circle, // an open circle: started
  half: Contrast, // a half-filled circle: nearly
  alert: TriangleAlert,
  problem: CircleAlert,
  info: Info,
  device: HardDrive, // kept on this device
  cloud: Cloud, // shared with the teacher
  cloudOff: CloudOff,
  pending: CloudUpload, // waiting to send
  // Where to start (a content choice, not an age)
  'path-F': Sprout,
  'path-1-2': Music,
  'path-3-4': Music2,
  'path-5-6': Music3,
  'path-older': Layers,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
export type IconSize = 16 | 20 | 24 | 32 | 48;

/** Lucide's stroke is 2 units on a 24 grid. These keep the drawn line close to 1.6–2.4 px at each size. */
const STROKE: Record<IconSize, number> = { 16: 2.25, 20: 2.1, 24: 2, 32: 1.75, 48: 1.5 };
const FILLED = new Set<IconName>(['record']);

export function Icon({ name, size = 24, className }: { name: IconName; size?: IconSize; className?: string }) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      className={`icon icon-${size}${className ? ` ${className}` : ''}`}
      size={size}
      strokeWidth={STROKE[size]}
      fill={FILLED.has(name) ? 'currentColor' : 'none'}
      aria-hidden="true"
      focusable="false"
    />
  );
}
