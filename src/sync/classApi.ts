// The teacher's side of classes, as the signed-in teacher. Every call goes through a database
// function; row-level security decides what comes back (supabase/migrations, tools/verify-db).
import { teacherAuth } from '../auth/teacherAuth.ts';
import type { ClassPlan } from './classLink.ts';
import type { EvidenceRow, SeatInfo } from './status.ts';

export interface ClassSummary {
  id: string;
  name: string;
  space_id: string;
  space_name: string;
  teaches: boolean;
  students: number;
}
export interface Assignment {
  id: string;
  activity_id: string;
  student_ids: string[] | null;
  supports: Record<string, boolean>;
  note: string | null;
  created_at: string;
}
export interface BoardStudent {
  id: string;
  nickname: string;
  seat: SeatInfo | null;
  plan: ClassPlan | null;
  evidence: EvidenceRow[];
}
export interface Board {
  class: { id: string; name: string; space_id: string };
  students: BoardStudent[];
  assignments: Assignment[];
}
export interface Note {
  id: string;
  body: string;
  created_at: string;
  mine: boolean;
  author?: string;
}
export interface StudentDetail {
  student: { id: string; nickname: string; class_id: string };
  plan: (ClassPlan & { updated_by: string | null }) | null;
  evidence: EvidenceRow[];
  notes: Note[];
}
export interface PlanChange {
  next_activity: string | null;
  supports: Record<string, boolean>;
  skill_overrides: Record<string, 'practise' | 'secure'>;
}

const first = <T,>(r: T | T[]): T => (Array.isArray(r) ? r[0] : r);

export const classApi = {
  available: () => teacherAuth.configured && !!teacherAuth.current(),
  classes: () => teacherAuth.rpc<ClassSummary[]>('my_classes'),
  createClass: (space: string, name: string) => teacherAuth.rpc<{ id: string; name: string }>('create_class', { space, class_name: name.trim().slice(0, 60) }).then(first),
  board: (classId: string) => teacherAuth.rpc<Board | null>('class_board', { class: classId }),
  addStudent: (classId: string, nickname: string) => teacherAuth.rpc<{ id: string; nickname: string }>('add_student', { class: classId, nickname: nickname.trim().slice(0, 30) }),
  removeStudent: (student: string) => teacherAuth.rpc<boolean>('remove_student', { student }),
  /** A new single-use code for the learner's device (valid 14 days). Unlinks any current device. */
  issueCode: (student: string) => teacherAuth.rpc<string>('issue_seat_code', { student }),
  assign: (classId: string, activity: string, learners: string[] | null, supports: Record<string, boolean>, note: string) =>
    teacherAuth.rpc<Assignment>('assign', { class: classId, activity, learners, supports, note }),
  closeAssignment: (id: string) => teacherAuth.rpc<boolean>('close_assignment', { assignment: id }),
  student: (student: string) => teacherAuth.rpc<StudentDetail | null>('student_detail', { student }),
  /** Saves only if nobody changed the plan since `expected`; otherwise returns the newer plan. */
  setPlan: (student: string, change: PlanChange, expected: number) =>
    teacherAuth
      .rpc<{ version: number; conflict: boolean; plan: ClassPlan & { updated_by: string | null } }[]>('set_support_plan', { student, next_activity: change.next_activity, supports: change.supports, skill_overrides: change.skill_overrides, expected })
      .then(first),
  addNote: (student: string, body: string) => teacherAuth.rpc<Note>('add_note', { student, body: body.trim().slice(0, 1000) }),
};
