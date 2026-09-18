import test from 'node:test'
import assert from 'node:assert/strict'
import { spreadsheetValue } from '../src/spreadsheetFormula.ts'
test('spreadsheet arithmetic, references and range aggregation',()=>{const rows=[['2','3','=SUM(A1:B2)'],['4','5','=A1+B1*2'],['=AVERAGE(A1:B2)','=COUNT(A1:B2)']];assert.equal(spreadsheetValue(rows,0,2),'14');assert.equal(spreadsheetValue(rows,1,2),'8');assert.equal(spreadsheetValue(rows,2,0),'3.5');assert.equal(spreadsheetValue(rows,2,1),'4')})
test('spreadsheet rejects code, cycles and division by zero',()=>{assert.equal(spreadsheetValue([['=A1']],0,0),'#CYCLE!');assert.equal(spreadsheetValue([['=1/0']],0,0),'#DIV/0!');assert.equal(spreadsheetValue([['=alert(1)']],0,0),'#FORMULA!')})
