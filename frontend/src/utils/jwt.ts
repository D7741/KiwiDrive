// src/utils/jwt.ts
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

export function extractRoleFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token)
  if (!payload) return null
  return (
    (payload['role'] as string) ??
    (payload['Role'] as string) ??
    (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string) ??
    null
  )
}