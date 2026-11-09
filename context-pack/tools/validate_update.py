#!/usr/bin/env python3
"""Validate research-pack consistency and illustrative musical relations, not an app/model."""
import csv
import json
import re
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def read_json(name):
    return json.loads((ROOT/name).read_text(encoding='utf-8'))
def rows(name):
    with (ROOT/name).open(newline='',encoding='utf-8') as f:
        return list(csv.DictReader(f))
def check_case(source,case):
    reply=case['replyEvents']
    if len(source)!=len(reply): return False
    if [x['id'] for x in source] != [x['id'] for x in reply]: return False
    changed=set()
    for a,b in zip(source,reply):
        for key in set(a)|set(b):
            if a.get(key)!=b.get(key): changed.add(key)
    return bool(changed) and changed <= set(case['permittedChangedFields'])

def main():
    catalogue=rows('references/sources.csv')
    ids={r['id'] for r in catalogue}
    assert len(ids)==len(catalogue)
    assert all(r['canonical_source_id'] in ids for r in catalogue)
    comparisons=rows('research/competitor_matrix.csv')
    assert len(comparisons)==29
    for row in comparisons:
        assert set(row['source_ids'].split('; ')) <= ids,row['name']
        assert row['uncertainty']
    assert len(rows('research/search_log.csv'))==31
    suite=read_json('content/primary_suite.plan.json')
    assert suite['humanEducatorApproved'] is False and suite['implemented'] is False
    assert {b['id'] for b in suite['bands']}=={'F','1-2','3-4','5-6'}
    assert len(suite['domains'])==8
    mission_ids={m['id'] for m in suite['missions']}
    assert len(mission_ids)==5
    for band in suite['bands']:
        assert band['mission'] in mission_ids
        assert set(band['sourceIds']) <= ids
    for m in suite['missions']:
        assert len(m['steps'])>=5
        assert m['humanEducatorApproved'] is False and m['implemented'] is False
        assert set(m['sourceIds']) <= ids
    examples=read_json('content/music_reply.examples.json')
    assert examples['fixtureOnly'] and not examples['executedModelOutputs'] and not examples['realStudentData']
    for case in examples['cases']:
        assert case['playbackRole']=='partner_demonstration'
        assert not case['independentEvidence']
        assert check_case(examples['sourceEvents'],case)==case['expectedAccept'],case['id']
    manifest=read_json('content/model_manifest.template.json')
    assert manifest['templateOnly'] and not manifest['approvedForShipping']
    assert manifest['selectedModel'] is None and manifest['actualDeviceMeasurements'] is None
    claims=read_json('content/release_claims.json')
    assert claims['globalExclusivityEstablished'] is False
    assert claims['childEfficacyEstablished'] is False
    contract=read_json('content/music_reply.schema.json')
    assert contract['additionalProperties'] is False
    required={'requestId','sourcePhraseHash','provenance','operation','parameters','goalId'}
    assert required <= set(contract['required'])
    for file in ['MASTER_CONTEXT.md','research/INNOVATION_AUDIT.md','specs/AI_MUSIC_INTERACTION.md',
                 'specs/FEASIBILITY_AND_SUSTAINABILITY.md','references/Carmen_Research_and_Product_Strategy.md']:
        text=(ROOT/file).read_text(encoding='utf-8')
        for group in re.findall(r'\[([A-Z][A-Z0-9_; -]+)\]',text):
            for ref in re.findall(r'\b[A-Z]\d\d\b',group):
                assert ref in ids,(file,ref)
    master=(ROOT/'MASTER_CONTEXT.md').read_text(encoding='utf-8')
    assert 'Ages 7–10, around Years 2–4' not in master
    assert 'No microphone/camera permissions.' not in master
    assert '## 16.' in master and '## 18.' in master
    assert len((ROOT/'CLAUDE.md').read_text().splitlines())<200
    for path in ROOT.rglob('*.json'):
        json.loads(path.read_text(encoding='utf-8'))
    print('PASS: 29 comparisons, 31 query records, four primary bands plus older extension,')
    print(f'{len(examples["cases"])} illustrative musical relations, claim/model boundaries and reference integrity.')
    print('Not tested: app execution, actual model inference, device performance, child learning,')
    print('educator suitability, complete curriculum coverage, legal/accessibility compliance or uniqueness.')

if __name__=='__main__':
    main()

