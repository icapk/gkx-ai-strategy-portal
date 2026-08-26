import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import type { UserProfile } from '../profile'
import { Modal } from './Modal'

interface ProfileSettingsModalProps {
  profile: UserProfile
  onClose: () => void
  onSave: (profile: UserProfile) => string | null
}

type TextProfileField = Exclude<keyof UserProfile, 'avatarDataUrl'>
type ProfileErrors = Partial<Record<TextProfileField, string>>

const MAX_AVATAR_BYTES = 2 * 1024 * 1024
const AVATAR_SIZE = 256
const ALLOWED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/

const fieldOrder: TextProfileField[] = [
  'name',
  'email',
  'phone',
  'organization',
  'title',
  'researchInterests',
]

const textLimits: Record<TextProfileField, number> = {
  name: 30,
  email: 254,
  phone: 30,
  organization: 60,
  title: 40,
  researchInterests: 200,
}

const fieldLabels: Record<TextProfileField, string> = {
  name: '姓名',
  email: '邮箱',
  phone: '手机号',
  organization: '所属机构',
  title: '职务职称',
  researchInterests: '研究方向',
}

const errorStyle = {
  margin: '6px 0 0',
  color: 'var(--danger)',
  fontSize: '12px',
  lineHeight: '18px',
} as const

const visuallyHiddenStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const

const normalizeText = (value: string) => value.normalize('NFC').trim()

const normalizedProfile = (profile: UserProfile): UserProfile => ({
  avatarDataUrl: profile.avatarDataUrl,
  name: normalizeText(profile.name),
  email: normalizeText(profile.email),
  phone: normalizeText(profile.phone),
  organization: normalizeText(profile.organization),
  title: normalizeText(profile.title),
  researchInterests: normalizeText(profile.researchInterests),
})

const profilesEqual = (first: UserProfile, second: UserProfile) => (
  first.avatarDataUrl === second.avatarDataUrl
  && fieldOrder.every((field) => first[field] === second[field])
)

const validateField = (field: TextProfileField, rawValue: string): string | undefined => {
  const value = normalizeText(rawValue)
  const label = fieldLabels[field]

  if (field === 'name' && value.length === 0) return '请输入姓名。'
  if (CONTROL_CHARACTERS.test(value)) return `${label}不能包含控制字符。`
  if (Array.from(value).length > textLimits[field]) return `${label}最多${textLimits[field]}个字符。`

  if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return '请输入有效的邮箱地址。'
  }

  if (field === 'phone' && value) {
    const normalizedPhone = value.replace(/[\s()-]/g, '')
    if (!/^\+?\d{7,15}$/.test(normalizedPhone)) return '请输入7至15位有效电话号码。'
  }

  return undefined
}

const validateProfile = (profile: UserProfile): ProfileErrors => {
  const errors: ProfileErrors = {}
  for (const field of fieldOrder) {
    const error = validateField(field, profile[field])
    if (error) errors[field] = error
  }
  return errors
}

const readFileAsDataUrl = (file: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onerror = () => reject(new Error('read-failed'))
  reader.onload = () => typeof reader.result === 'string'
    ? resolve(reader.result)
    : reject(new Error('read-failed'))
  reader.readAsDataURL(file)
})

const loadImage = (source: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error('decode-failed'))
  image.src = source
})

const prepareAvatar = async (file: File): Promise<string> => {
  const source = await readFileAsDataUrl(file)
  const image = await loadImage(source)
  if (!image.naturalWidth || !image.naturalHeight) throw new Error('decode-failed')

  const cropSize = Math.min(image.naturalWidth, image.naturalHeight)
  const sourceX = (image.naturalWidth - cropSize) / 2
  const sourceY = (image.naturalHeight - cropSize) / 2
  const canvas = document.createElement('canvas')
  canvas.width = AVATAR_SIZE
  canvas.height = AVATAR_SIZE

  const context = canvas.getContext('2d')
  if (!context) throw new Error('process-failed')
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE)
  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE,
  )

  const result = canvas.toDataURL('image/jpeg', 0.86)
  if (!result.startsWith('data:image/jpeg;base64,') || result.length > 500_000) {
    throw new Error('process-failed')
  }
  return result
}

export function ProfileSettingsModal({ profile, onClose, onSave }: ProfileSettingsModalProps) {
  const [draft, setDraft] = useState<UserProfile>(() => ({ ...profile }))
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [avatarError, setAvatarError] = useState('')
  const [formError, setFormError] = useState('')
  const [confirmClose, setConfirmClose] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const avatarRequestRef = useRef(0)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const avatarButtonRef = useRef<HTMLButtonElement | null>(null)
  const discardMessageRef = useRef<HTMLParagraphElement | null>(null)
  const fieldRefs = useRef<Partial<Record<TextProfileField, HTMLInputElement | HTMLTextAreaElement>>>({})

  const dirty = useMemo(() => !profilesEqual(draft, profile), [draft, profile])
  const researchInterestCount = Array.from(draft.researchInterests).length

  useEffect(() => () => {
    avatarRequestRef.current += 1
  }, [])

  useEffect(() => {
    if (!confirmClose) return
    const frame = window.requestAnimationFrame(() => discardMessageRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [confirmClose])

  const updateField = (field: TextProfileField, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setFormError('')
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }))
    }
  }

  const validateOnBlur = (field: TextProfileField) => {
    setErrors((current) => ({ ...current, [field]: validateField(field, draft[field]) }))
  }

  const requestClose = () => {
    if (dirty) {
      setConfirmClose(true)
      return
    }
    onClose()
  }

  const discardChanges = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onClose()
  }

  const selectAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setAvatarError('')
    setFormError('')
    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setAvatarError('请选择 PNG、JPEG 或 WebP 图片。')
      avatarButtonRef.current?.focus()
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError('图片大小不能超过 2 MiB。')
      avatarButtonRef.current?.focus()
      return
    }

    const requestId = avatarRequestRef.current + 1
    avatarRequestRef.current = requestId
    setAvatarBusy(true)
    try {
      const avatarDataUrl = await prepareAvatar(file)
      if (avatarRequestRef.current !== requestId) return
      setDraft((current) => ({ ...current, avatarDataUrl }))
    } catch {
      if (avatarRequestRef.current === requestId) {
        setAvatarError('无法读取这张图片，请选择其他图片。')
        avatarButtonRef.current?.focus()
      }
    } finally {
      if (avatarRequestRef.current === requestId) setAvatarBusy(false)
    }
  }

  const removeAvatar = () => {
    avatarRequestRef.current += 1
    setAvatarBusy(false)
    setAvatarError('')
    setFormError('')
    setDraft((current) => ({ ...current, avatarDataUrl: null }))
  }

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (avatarBusy) return

    const normalized = normalizedProfile(draft)
    const nextErrors = validateProfile(normalized)
    setDraft(normalized)
    setErrors(nextErrors)
    setFormError('')

    const firstInvalidField = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalidField) {
      window.requestAnimationFrame(() => fieldRefs.current[firstInvalidField]?.focus())
      return
    }

    try {
      const saveError = onSave(normalized)
      if (saveError) {
        setFormError(saveError)
        return
      }
      onClose()
    } catch {
      setFormError('保存个人资料时发生错误，请重试。')
    }
  }

  if (confirmClose) {
    return (
      <Modal
        title="放弃修改？"
        onClose={() => setConfirmClose(false)}
        onSubmit={discardChanges}
        cancelText="继续编辑"
        confirmText="放弃修改"
        confirmDanger
      >
        <p
          ref={discardMessageRef}
          tabIndex={-1}
          style={{ margin: 0, color: 'var(--text-2)', lineHeight: '22px', outline: 'none' }}
        >
          个人资料尚未保存，放弃后本次修改将无法恢复。
        </p>
      </Modal>
    )
  }

  return (
    <Modal
      title="个人信息设置"
      onClose={requestClose}
      onSubmit={submitProfile}
      confirmText="保存"
      confirmDisabled={avatarBusy || !dirty}
    >
      {formError && (
        <div
          role="alert"
          style={{ marginBottom: '14px', padding: '8px 12px', borderRadius: '4px', color: 'var(--danger)', background: '#fff2f0' }}
        >
          {formError}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <img
          src={draft.avatarDataUrl ?? '/assets/avatar-user.svg'}
          alt="头像预览"
          style={{ width: '64px', height: '64px', flex: '0 0 64px', borderRadius: '50%', objectFit: 'cover', outline: '1px solid rgba(0, 0, 0, 0.1)' }}
        />
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              aria-label="选择头像图片"
              style={visuallyHiddenStyle}
              onChange={(event) => void selectAvatar(event)}
            />
            <button
              ref={avatarButtonRef}
              className="button button--secondary"
              type="button"
              disabled={avatarBusy}
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarBusy ? '处理中…' : '更换头像'}
            </button>
            {draft.avatarDataUrl && (
              <button className="button button--secondary" type="button" disabled={avatarBusy} onClick={removeAvatar}>
                恢复默认
              </button>
            )}
          </div>
          <p className="field-help">支持 PNG、JPEG、WebP，文件不超过 2 MiB</p>
          {avatarError && <p role="alert" style={errorStyle}>{avatarError}</p>}
        </div>
      </div>

      <label className="field-label" htmlFor="profile-name"><span className="required-mark">*</span> 姓名：</label>
      <input
        ref={(element) => { fieldRefs.current.name = element ?? undefined }}
        className="text-field"
        id="profile-name"
        value={draft.name}
        maxLength={30}
        autoComplete="name"
        autoFocus
        aria-invalid={Boolean(errors.name)}
        aria-describedby={errors.name ? 'profile-name-error' : undefined}
        onChange={(event) => updateField('name', event.target.value)}
        onBlur={() => validateOnBlur('name')}
      />
      {errors.name && <p id="profile-name-error" role="alert" style={errorStyle}>{errors.name}</p>}

      <label className="field-label" htmlFor="profile-email">邮箱：</label>
      <input
        ref={(element) => { fieldRefs.current.email = element ?? undefined }}
        className="text-field"
        id="profile-email"
        value={draft.email}
        maxLength={254}
        inputMode="email"
        autoComplete="email"
        aria-invalid={Boolean(errors.email)}
        aria-describedby={errors.email ? 'profile-email-error' : undefined}
        placeholder="name@example.com"
        onChange={(event) => updateField('email', event.target.value)}
        onBlur={() => validateOnBlur('email')}
      />
      {errors.email && <p id="profile-email-error" role="alert" style={errorStyle}>{errors.email}</p>}

      <label className="field-label" htmlFor="profile-phone">手机号：</label>
      <input
        ref={(element) => { fieldRefs.current.phone = element ?? undefined }}
        className="text-field"
        id="profile-phone"
        value={draft.phone}
        maxLength={30}
        inputMode="tel"
        autoComplete="tel"
        aria-invalid={Boolean(errors.phone)}
        aria-describedby={errors.phone ? 'profile-phone-error' : undefined}
        placeholder="请输入手机号"
        onChange={(event) => updateField('phone', event.target.value)}
        onBlur={() => validateOnBlur('phone')}
      />
      {errors.phone && <p id="profile-phone-error" role="alert" style={errorStyle}>{errors.phone}</p>}

      <label className="field-label" htmlFor="profile-organization">所属机构：</label>
      <input
        ref={(element) => { fieldRefs.current.organization = element ?? undefined }}
        className="text-field"
        id="profile-organization"
        value={draft.organization}
        maxLength={60}
        autoComplete="organization"
        aria-invalid={Boolean(errors.organization)}
        aria-describedby={errors.organization ? 'profile-organization-error' : undefined}
        placeholder="请输入所属机构"
        onChange={(event) => updateField('organization', event.target.value)}
        onBlur={() => validateOnBlur('organization')}
      />
      {errors.organization && <p id="profile-organization-error" role="alert" style={errorStyle}>{errors.organization}</p>}

      <label className="field-label" htmlFor="profile-title">职务职称：</label>
      <input
        ref={(element) => { fieldRefs.current.title = element ?? undefined }}
        className="text-field"
        id="profile-title"
        value={draft.title}
        maxLength={40}
        autoComplete="organization-title"
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? 'profile-title-error' : undefined}
        placeholder="请输入职务或职称"
        onChange={(event) => updateField('title', event.target.value)}
        onBlur={() => validateOnBlur('title')}
      />
      {errors.title && <p id="profile-title-error" role="alert" style={errorStyle}>{errors.title}</p>}

      <label className="field-label" htmlFor="profile-research-interests">研究方向：</label>
      <textarea
        ref={(element) => { fieldRefs.current.researchInterests = element ?? undefined }}
        className="text-field"
        id="profile-research-interests"
        value={draft.researchInterests}
        maxLength={200}
        rows={3}
        aria-invalid={Boolean(errors.researchInterests)}
        aria-describedby={errors.researchInterests ? 'profile-research-interests-error' : 'profile-research-interests-help'}
        placeholder="请输入研究方向"
        style={{ height: '76px', resize: 'vertical' }}
        onChange={(event) => updateField('researchInterests', event.target.value)}
        onBlur={() => validateOnBlur('researchInterests')}
      />
      <p id="profile-research-interests-help" className="field-help" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {researchInterestCount}/200
      </p>
      {errors.researchInterests && (
        <p id="profile-research-interests-error" role="alert" style={errorStyle}>{errors.researchInterests}</p>
      )}
    </Modal>
  )
}
