import test from 'node:test'
import assert from 'node:assert/strict'
import { advance, catchUp, dayKey, defaults, fresh, left, toggle } from '../src/timer.ts'
const start=new Date(2026,11,15,9).getTime()

test('pause, reload and resume preserve sub-second remainder',()=>{
  const active=toggle(fresh('focus',defaults),start)
  const paused=toggle(active,start+12345)
  assert.equal(left(paused,start+99999),1500000-12345)
  const restored=JSON.parse(JSON.stringify(paused))
  assert.equal(toggle(restored,start+99999).endsAt,start+99999+1500000-12345)
})
test('a late tick records one focus session and waits with auto-start off',()=>{
  const active=toggle(fresh('focus',defaults),start)
  const c=catchUp(active,defaults,false,start+7200000)
  assert.equal(c.phase,'short')
  assert.equal(c.endsAt,null)
  assert.deepEqual(c.days[dayKey(start)],{count:1,minutes:25})
  assert.equal(catchUp(c,defaults,false,start+7300000),c)
})
test('auto-start catches up across four focus sessions into a long break',()=>{
  const active=toggle(fresh('focus',defaults),start)
  const c=catchUp(active,defaults,true,start+116*60000)
  assert.equal(c.phase,'long');assert.equal(c.cycle,0)
  assert.equal(left(c,start+116*60000),14*60000)
  assert.deepEqual(c.days[dayKey(start)],{count:4,minutes:100})
})
test('skipping or resetting an unfinished focus earns no credit',()=>{
  const c=advance(fresh('focus',defaults),defaults,false,start,true)
  const last=fresh('focus',defaults,c)
  const skipped=advance(last,defaults,false,start,false)
  assert.equal(skipped.cycle,1);assert.equal(skipped.days[dayKey(start)].count,1)
  assert.equal(fresh('focus',defaults,skipped).cycle,1)
})
test('credits go to local completion date and use the original phase duration',()=>{
  const at=new Date(2026,11,15,23,59,30).getTime()
  const c=toggle(fresh('focus',{...defaults,focus:1}),at)
  const next=catchUp(c,defaults,false,at+120000)
  assert.deepEqual(next.days[dayKey(at+60000)],{count:1,minutes:1})
  assert.equal(next.days[dayKey(at)],undefined)
})
