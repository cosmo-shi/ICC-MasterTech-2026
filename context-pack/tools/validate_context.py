#!/usr/bin/env python3
"""Validate this context pack's draft data. This does not test an app."""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def main():
    pack = load("content/lessons.seed.json")
    sources = load("content/content_sources.json")
    manifest = load("content/asset_manifest.template.json")
    with (ROOT / "references/sources.csv").open(encoding="utf-8", newline="") as f:
        catalogue = list(csv.DictReader(f))
    ids = [s["id"] for s in catalogue]
    assert len(ids) == len(set(ids)), "Duplicate research source ID"
    source_ids = {s["id"] for s in sources["sources"]}
    assert source_ids <= set(ids), "Lesson source missing from research catalogue"
    lessons = pack["lessons"]
    lesson_ids = {x["id"] for x in lessons}
    assert len(lessons) == len(lesson_ids) == 10
    assert pack["licence"] == "CC-BY-SA-4.0"
    assert pack["humanEducatorApproved"] is False
    assert manifest["templateOnly"] is True
    assert manifest["approvedForShipping"] is False
    names = {60: "C4", 62: "D4", 64: "E4", 65: "F4", 67: "G4", 69: "A4", 71: "B4", 72: "C5"}
    pattern_count = event_count = 0
    for lesson in lessons:
        lid = lesson["id"]
        assert lesson["licence"] == pack["licence"]
        assert lesson["reviewStatus"] == "draft_pending_primary_music_educator"
        assert set(lesson["sourceIds"]) <= source_ids, lid
        assert set(lesson["prerequisites"]) <= lesson_ids, lid
        assert lid not in lesson["prerequisites"], lid
        assert [h["level"] for h in lesson["hints"]] == ["question", "clue", "answer"]
        assert lesson["instruction"] and lesson["objective"] and lesson["explanation"]
        if lesson["assessment"]["mode"] in {"free-exploration", "creative-completion"}:
            assert lesson["assessment"]["score"] is False
        if lesson["assessment"]["mode"] == "pitch-sequence":
            assert lesson["assessment"]["checkTiming"] is False
        if lesson["assessment"].get("checkDuration"):
            assert "note-off" in lesson["requiredInputCapabilities"]
            assert lesson["supportedInstruments"] == ["keyboard"]
        for field in ("practice", "independent"):
            pattern = lesson.get(field)
            if pattern is None:
                continue
            pattern_count += 1
            assert pattern["instrument"] in lesson["supportedInstruments"]
            assert pattern["timeSignature"] == [4, 4]
            assert pattern["beatUnit"] == "crotchet"
            assert pattern["totalBeats"] % 4 == 0
            cursor = 0
            eids = set()
            for event in pattern["events"]:
                event_count += 1
                assert event["id"] not in eids
                eids.add(event["id"])
                assert event["onsetBeats"] == cursor, (lid, field, "gap/overlap")
                assert event["durationBeats"] > 0
                assert event["kind"] in {"note", "drum", "rest"}
                cursor += event["durationBeats"]
                if event["kind"] == "note":
                    assert pattern["instrument"] == "keyboard"
                    assert names[event["pitch"]["midi"]] == event["pitch"]["name"]
                elif event["kind"] == "drum":
                    assert pattern["instrument"] == "drums"
                    assert event["soundId"] in {"kick", "snare"}
                else:
                    assert "pitch" not in event and "soundId" not in event
            assert cursor == pattern["totalBeats"], (lid, field, "duration mismatch")
        if lesson.get("practice") and lesson.get("independent"):
            a = [{k: v for k, v in e.items() if k != "id"} for e in lesson["practice"]["events"]]
            b = [{k: v for k, v in e.items() if k != "id"} for e in lesson["independent"]["events"]]
            assert a != b, (lid, "independent task repeats practice")
        for target in lesson.get("exampleLessonIdsByInstrument", {}).values():
            assert target in lesson_ids
    visiting, done = set(), set()

    def visit(lid):
        assert lid not in visiting, "Prerequisite cycle"
        if lid in done:
            return
        visiting.add(lid)
        for dependency in next(x for x in lessons if x["id"] == lid)["prerequisites"]:
            visit(dependency)
        visiting.remove(lid)
        done.add(lid)

    for lid in lesson_ids:
        visit(lid)
    master = (ROOT / "MASTER_CONTEXT.md").read_text(encoding="utf-8")
    for group in re.findall(r"\[([A-Z][A-Z0-9_]+(?:; [A-Z][A-Z0-9_]+)*)\]", master):
        for source in group.split("; "):
            assert source in ids, ("Unknown master source", source)
    for source in catalogue:
        if not source["url"].startswith("https://"):
            assert (ROOT / source["url"]).is_file(), source["url"]
    root_lines = len((ROOT / "CLAUDE.md").read_text(encoding="utf-8").splitlines())
    assert root_lines < 200, "Keep project instructions concise"
    print(f"PASS: {len(lessons)} draft lessons, {pattern_count} patterns, {event_count} events, {len(catalogue)} source records; CLAUDE.md {root_lines} lines.")
    print("Not checked: app behaviour, trained AI, audio assets, educator suitability, real-device performance, accessibility or legal compliance.")


if __name__ == "__main__":
    main()
