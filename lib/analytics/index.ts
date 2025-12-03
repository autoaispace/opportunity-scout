import type { EventName, EventProperties, AnalyticsEvent } from './types'

class AnalyticsService {
  private static instance: AnalyticsService
  private isDevelopment: boolean

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  track(event: EventName, properties?: EventProperties): void {
    const analyticsEvent: AnalyticsEvent = {
      name: event,
      properties,
      timestamp: Date.now(),
    }

    if (this.isDevelopment) {
      this.logToConsole(analyticsEvent)
    } else {
      this.sendToBackend(analyticsEvent)
    }
  }

  private logToConsole(event: AnalyticsEvent): void {
    const emoji = this.getEventEmoji(event.name)
    console.log(
      `${emoji} [Analytics]`,
      event.name,
      event.properties || {}
    )
  }

  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    // TODO: Replace with real analytics service (PostHog, Mixpanel, etc.)
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }

  private getEventEmoji(eventName: EventName): string {
    const emojiMap: Record<string, string> = {
      auth: '🔐',
      view: '👀',
      click: '👆',
      checkout: '💳',
      share: '📤',
      error: '❌',
      demand: '💡',
      feed: '📰',
      upgrade: '⭐',
    }

    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (eventName.includes(key)) return emoji
    }

    return '📊'
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance()

// Convenience function for RSC
export function track(event: EventName, properties?: EventProperties): void {
  analytics.track(event, properties)
}

