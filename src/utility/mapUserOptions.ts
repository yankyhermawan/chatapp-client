import type { User } from '@/user/interface'

export const mapUserOptions = (user: User[]) =>
  user.map((dt) => ({
    label: dt.name,
    value: String(dt.id),
  }))
