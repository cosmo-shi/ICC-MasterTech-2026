import { LESSON_DETAIL } from '../data/detail.ts';
import { usePrefs } from '../state/prefs.tsx';

/** Optional deeper explanation. Open by default for Years 5–6 and older learners; anyone can open it. */
export function MoreDetail({ lessonId }: { lessonId: string }) {
  const { prefs } = usePrefs();
  const lines = LESSON_DETAIL[lessonId];
  if (!lines?.length) return null;
  const open = prefs.pathway === '5-6' || prefs.pathway === 'older';
  return (
    <details className="more-detail" open={open}>
      <summary>More detail</summary>
      {lines.map((l) => (
        <p key={l}>{l}</p>
      ))}
    </details>
  );
}
