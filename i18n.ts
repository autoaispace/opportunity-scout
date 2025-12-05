import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['zh-CN', 'en'] as const
export type Locale = (typeof locales)[number]

function isValidLocale(locale: string | undefined): locale is Locale {
  return locale !== undefined && locales.includes(locale as Locale)
}

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  if (!isValidLocale(locale)) {
    notFound()
  }

  // TypeScript now knows locale is Locale (not undefined)
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})

