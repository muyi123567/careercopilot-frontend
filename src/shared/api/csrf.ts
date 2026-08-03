/**
 * 进程内共享的 CSRF token（仅内存，不落 localStorage）。
 * 登录/会话恢复成功后由 AuthContext 写入，apiFetch 统一附加到不安全方法请求头。
 */
let csrfToken: string | null = null;

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

export function getCsrfToken(): string | null {
  return csrfToken;
}

export function clearCsrfToken(): void {
  csrfToken = null;
}
