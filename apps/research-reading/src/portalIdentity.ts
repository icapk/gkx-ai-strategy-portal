/** Prototype portal adapter: team permissions never confer portal roles. */
export interface PortalIdentity { id:number; institutionId:string; role:'管理员'|'普通成员' }
export const defaultIdentity:PortalIdentity={id:1,institutionId:'demo-institution',role:'普通成员'}
export function currentIdentity():PortalIdentity {
  try { const value=JSON.parse(localStorage.getItem('research:portal-identity:v1')??'null'); if(value&&Number.isInteger(value.id)&&typeof value.institutionId==='string'&&['管理员','普通成员'].includes(value.role))return value } catch { /* Use the independent ordinary portal identity for legacy sessions. */ }
  return defaultIdentity
}
