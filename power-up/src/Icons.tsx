import type { CSSProperties } from 'react';
const paths: Record<string, React.ReactNode> = {
  play:<path d="m9 5 11 7-11 7Z"/>,pause:<path d="M8 5v14M16 5v14"/>,
  book:<><path d="M12 5v16M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Z"/></>,
  compass:<><circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/></>,
  check:<path d="m5 12 4 4L19 6"/>,arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
  chevron:<path d="m9 5 7 7-7 7"/>,back:<path d="m15 5-7 7 7 7"/>,down:<path d="m6 9 6 6 6-6"/>,
  volume:<><path d="M11 4 6 8H3v8h3l5 4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></>,
  repeat:<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>,
  star:<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>,
  spark:<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3ZM20 2v4m-2-2h4"/>,
  mic:<><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11v1a7 7 0 0 0 14 0v-1M12 19v3M8 22h8"/></>,
  stop:<rect x="6" y="6" width="12" height="12" rx="2"/>,
  bulb:<><path d="M9 18h6M10 21h4M8 14a7 7 0 1 1 8 0l-1 3H9Z"/></>,
  pen:<path d="m4 16-1 5 5-1L20 8l-4-4ZM13 7l4 4"/>,
  clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  menu:<path d="M4 6h16M4 12h16M4 18h16"/>,close:<path d="m6 6 12 12M18 6 6 18"/>,
  heart:<path d="M12 20S3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12-9 12Z"/>,
  globe:<><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>,
  home:<><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/></>,
  chart:<><path d="M4 3v18h17M8 16v-5M13 16V6M18 16V9"/></>,
  leaf:<><path d="M4 20C1 5 12 3 21 3c0 10-3 19-17 17ZM4 20 16 8"/></>,
  ear:<path d="M7 8a5 5 0 1 1 9 3c-2 2-2 4-3 6-2 4-6 3-6 0M10 9a2 2 0 1 1 3 2"/>,
};
export default function Icon({name,size=20,className='',style}: {name:string;size?:number;className?:string;style?:CSSProperties}) {
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>{paths[name]??paths.spark}</svg>;
}
