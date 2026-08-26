export interface UserProfile {
  avatarDataUrl: string | null
  name: string
  email: string
  phone: string
  organization: string
  title: string
  researchInterests: string
}

export type SaveUserProfileResult =
  | { ok: true }
  | { ok: false; error: string }

const STORAGE_KEY = 'intelligent-research-portal:user-profile:v1'
const STORAGE_VERSION = 1
const MAX_AVATAR_DATA_URL_LENGTH = 500_000
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/

export const defaultUserProfile: UserProfile = {
  avatarDataUrl: null,
  name: '张三',
  email: '',
  phone: '',
  organization: '',
  title: '',
  researchInterests: '',
}

interface StoredUserProfile {
  version: typeof STORAGE_VERSION
  updatedAt: string
  data: UserProfile
}

const cloneDefaultProfile = (): UserProfile => ({ ...defaultUserProfile })

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
)

const normalizeText = (value: string) => value.normalize('NFC').trim()

const isSafeAvatarDataUrl = (value: unknown): value is string | null => {
  if (value === null) return true
  if (typeof value !== 'string' || value.length > MAX_AVATAR_DATA_URL_LENGTH) return false
  return /^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/]+={0,2}$/.test(value)
}

const readString = (
  source: Record<string, unknown>,
  key: keyof Omit<UserProfile, 'avatarDataUrl'>,
  maxLength: number,
): string | null => {
  const value = source[key]
  if (typeof value !== 'string') return null
  const normalized = normalizeText(value)
  if (Array.from(normalized).length > maxLength) return null
  return normalized
}

const parseUserProfile = (value: unknown): UserProfile | null => {
  if (!isRecord(value) || !isSafeAvatarDataUrl(value.avatarDataUrl)) return null

  const name = readString(value, 'name', 30)
  const email = readString(value, 'email', 254)
  const phone = readString(value, 'phone', 30)
  const organization = readString(value, 'organization', 60)
  const title = readString(value, 'title', 40)
  const researchInterests = readString(value, 'researchInterests', 200)

  if (
    name === null
    || email === null
    || phone === null
    || organization === null
    || title === null
    || researchInterests === null
    || name.length === 0
  ) return null

  if (
    [name, email, phone, organization, title, researchInterests].some((field) => CONTROL_CHARACTERS.test(field))
    || (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) return null

  if (phone.length > 0) {
    const normalizedPhone = phone.replace(/[\s()-]/g, '')
    if (!/^\+?\d{7,15}$/.test(normalizedPhone)) return null
  }

  return {
    avatarDataUrl: value.avatarDataUrl,
    name,
    email,
    phone,
    organization,
    title,
    researchInterests,
  }
}

const readStoredProfile = (value: unknown): UserProfile | null => {
  if (!isRecord(value)) return null

  if (value.version === STORAGE_VERSION && isRecord(value.data)) {
    return parseUserProfile(value.data)
  }

  // Accept the unwrapped shape used by early local prototypes, then rewrite it
  // in the versioned format on the next successful save.
  return parseUserProfile(value)
}

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return cloneDefaultProfile()

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return cloneDefaultProfile()
    return readStoredProfile(JSON.parse(stored)) ?? cloneDefaultProfile()
  } catch {
    return cloneDefaultProfile()
  }
}

export function saveUserProfile(profile: UserProfile): SaveUserProfileResult {
  if (typeof window === 'undefined') {
    return { ok: false, error: '当前环境不支持本地存储。' }
  }

  const normalized = parseUserProfile(profile)
  if (!normalized) {
    return { ok: false, error: '个人资料格式无效，请检查后重试。' }
  }

  const stored: StoredUserProfile = {
    version: STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    data: normalized,
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    return { ok: true }
  } catch {
    return { ok: false, error: '无法保存到本机，请释放浏览器存储空间后重试。' }
  }
}
