import { SplashRiver } from '../../art/River'
import { WaterDial } from '../../art/Dials'
import type { Theme } from '../types'
export default {
  id:'songkran', name:'Songkran', title:'Songkran Splash', icon:'water', order:2,
  matches: d => d.getMonth() === 3 && d.getDate() >= 13 && d.getDate() <= 15,
  tokens:{sky:'#326879',horizon:'#b3dfcc',accent:'#1d645f',surface:'#f3f6e7',heading:'"Cormorant Garamond", Georgia, serif'},
  moods:{focus:{light:'#4e9295',speed:.85},short:{light:'#719c86',speed:1.45},long:{light:'#337d89',speed:.55}},
  particles:{kind:'water',color:'#cbfff1',count:45}, notes:[523.25,659.25,783.99],
  Scene:SplashRiver, Dial:WaterDial
} satisfies Theme
