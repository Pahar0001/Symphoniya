// Политика допустимых почтовых доменов при регистрации.
// По требованию заказчика регистрация с иностранных бесплатных почтовых сервисов
// (Google/Gmail и аналоги) запрещена; российские сервисы (mail.ru, Яндекс, Рамблер)
// и корпоративная почта — разрешены.
//
// Список расширяется через переменную окружения BLOCKED_EMAIL_DOMAINS
// (домены через запятую) — без правки кода.

const DEFAULT_BLOCKED_DOMAINS = [
  // Google
  "gmail.com",
  "googlemail.com",
  // Microsoft
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  // Apple
  "icloud.com",
  "me.com",
  "mac.com",
  // Yahoo / прочие иностранные бесплатные
  "yahoo.com",
  "ymail.com",
  "aol.com",
  "gmx.com",
  "mail.com",
  // Proton
  "proton.me",
  "protonmail.com",
];

function blockedDomains(): Set<string> {
  const extra = (process.env.BLOCKED_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  return new Set([...DEFAULT_BLOCKED_DOMAINS, ...extra]);
}

export function emailDomainOf(email: string): string | null {
  const at = email.toLowerCase().trim().split("@");
  return at.length === 2 && at[1] ? at[1] : null;
}

// Возвращает текст ошибки, если домен запрещён к регистрации, иначе null.
export function registrationEmailError(email: string): string | null {
  const domain = emailDomainOf(email);
  if (!domain) return "Некорректный email";
  if (blockedDomains().has(domain)) {
    return "Регистрация с этого почтового сервиса недоступна. Используйте корпоративную или российскую почту (например, mail.ru или Яндекс).";
  }
  return null;
}

export function isRegistrationEmailAllowed(email: string): boolean {
  return registrationEmailError(email) === null;
}
