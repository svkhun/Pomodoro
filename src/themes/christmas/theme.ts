import { Winter, StringLights } from '../../art/Winter'
import { Ornament } from '../../art/Dials'
import type { Theme } from '../types'
export default {
  id:'christmas', name:'Christmas', title:'Christmas Eve', icon:'tree', order:0,
  matches: d => d.getMonth() === 11,
  tokens:{sky:'#142239',horizon:'#74798c',accent:'#8a333c',surface:'#f7f3e9',heading:'"Cormorant Garamond", Georgia, serif'},
  moods:{focus:{light:'#393f57',speed:.74},short:{light:'#6c505a',speed:1.35},long:{light:'#38596a',speed:.55}},
  particles:{kind:'snow',color:'#fff6e7',count:74}, notes:[659.25,830.61,987.77],
  Scene:Winter, Dial:Ornament, Canopy:StringLights
} satisfies Theme
