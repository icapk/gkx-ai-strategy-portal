import type { Plugin } from 'vite'
export function readingPrdShared(): Plugin
export function prdShared(options?:{endpoint?:string;directory?:string;validate?:(book:unknown)=>boolean}): Plugin
