import { LanternRiver } from '../../art/River'
import { LanternDial } from '../../art/Dials'
import type { Theme } from '../types'
export default {
  id:'loy', name:'Loy Krathong', title:'Lantern River', icon:'lantern', order:1,
  // November 24 is the 2026 festival. Other years remain manually selectable.
  matches: d => d.getFullYear() === 2026 && d.getMonth() === 10 && d.getDate() === 24,
  tokens:{sky:'#28213b',horizon:'#ad7773',accent:'#89412e',surface:'#faf0dd',heading:'"Cormorant Garamond", Georgia, serif'},
  moods:{focus:{light:'#4b3853',speed:.55},short:{light:'#864d55',speed:.95},long:{light:'#45445e',speed:.4}},
  particles:{kind:'ember',color:'#ffcc84',count:47}, notes:[392,493.88,587.33],
  Scene:LanternRiver, Dial:LanternDial
} satisfies Theme
