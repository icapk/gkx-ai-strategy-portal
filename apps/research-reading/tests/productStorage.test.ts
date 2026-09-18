import test from 'node:test'
import assert from 'node:assert/strict'
import { ownsStorageKey, productDatabases } from '../src/productStorage.ts'
test('科研与阅读业务存储不相交，评审资料不在重置范围',()=>{const keys=['gkx-reading-workspace-v1','intelligent-research-portal:documents:v1','intelligent-research-portal:data-tables:v1','research:team-spaces:v1','research:quick-access:v1'];for(const key of keys)assert.notEqual(ownsStorageKey('reading',key),ownsStorageKey('research',key));assert(!productDatabases.research.some(x=>productDatabases.reading.includes(x)));for(const key of ['research-prd','reading-prd','gkx-profile','unrelated'])assert(!ownsStorageKey('research',key)&&!ownsStorageKey('reading',key))})
