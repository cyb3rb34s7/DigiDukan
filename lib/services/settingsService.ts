/**
 * Settings Service Layer
 * Manages app-wide configuration
 */

import { prisma } from '../prisma'
import { Settings } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export class SettingsService {
  /**
   * Get current settings (creates default if missing)
   */
  async getSettings(): Promise<Settings> {
    let settings = await prisma.settings.findUnique({
      where: { id: 1 }
    })

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 1,
          defaultMargin: new Decimal(10.0),
          language: 'hi'
        }
      })
    }

    return settings
  }

  /**
   * Update settings
   */
  async updateSettings(data: {
    defaultMargin?: number
    language?: string
  }): Promise<Settings> {
    // Ensure settings exist
    await this.getSettings()

    const updateData: any = {}
    if (data.defaultMargin !== undefined) {
      updateData.defaultMargin = new Decimal(data.defaultMargin)
    }
    if (data.language !== undefined) {
      updateData.language = data.language
    }

    const settings = await prisma.settings.update({
      where: { id: 1 },
      data: updateData
    })

    return settings
  }
}
