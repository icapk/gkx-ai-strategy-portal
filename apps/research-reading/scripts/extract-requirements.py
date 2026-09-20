"""Read only extraction. Never imports previous status/reason columns."""
import hashlib, json, re
from pathlib import Path
import openpyxl

root = Path(__file__).resolve().parents[1]
source = root.parents[1] / '门户功能扩充表_智能科研+智能阅读.xlsx'
source = root.parents[2] / '门户系统' / source.name
workbook = openpyxl.load_workbook(source, read_only=True, data_only=True)
leaves = {}
for row_number, row in enumerate(workbook.worksheets[0].values, 1):
    if row_number == 1 or row[4] not in ['智能科研', '智能阅读']:
        continue
    module = 'research' if row[4] == '智能科研' else 'reading'
    match = re.match(r'([A-Z]+-\d+-\d+)\s*[｜|：:]\s*(.*)', str(row[9]), re.S)
    if not match:
        raise ValueError((row_number, row[9]))
    code, title = match.groups()
    leaf_id = code.rsplit('-', 1)[0]
    if leaf_id not in leaves:
        leaves[leaf_id] = dict(id=leaf_id, module=module, level4=row[4], level5=row[5], level6=row[6], requirement=row[7], pages=[row[8]], points=[])
    leaves[leaf_id]['points'].append(dict(code=code, title=title, sourceText=row[9], sourceRow=row_number, sourceNumber=row[0]))
points = [p for leaf in leaves.values() for p in leaf['points']]
assert len(points) == len(set(p['code'] for p in points))
output = dict(source=source.name, sheet=workbook.worksheets[0].title, sha256=hashlib.sha256(source.read_bytes()).hexdigest(), leaves=list(leaves.values()))
target = root / 'src' / 'audit' / 'requirements.json'
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
for leaf in leaves.values():
    print(leaf['id'], leaf['module'], leaf['level5'], '/', leaf['level6'], len(leaf['points']))
print('TOTAL', len(points))
