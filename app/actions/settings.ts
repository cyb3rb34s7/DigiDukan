'use server'

/**
 * Settings Server Actions
 * App-wide configuration management
 */

import { SettingsService } from '@/lib/services/settingsService'
import { settingsUpdateSchema } from '@/lib/validations'
import { handleError, successResponse } from '@/lib/utils/errors'
import { ApiResponse, Settings } from '@/lib/types'

const settingsService = new SettingsService()

/**
 * Get current settings
 */
export async function getSettings(): Promise<ApiResponse<Settings>> {
  try {
    const settings = await settingsService.getSettings()
    return successResponse(settings)
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Update settings
 */
export async function updateSettings(
  input: unknown
): Promise<ApiResponse<Settings>> {
  try {
    const validated = settingsUpdateSchema.parse(input)
    const settings = await settingsService.updateSettings(validated)
    return successResponse(settings, 'Settings updated successfully')
  } catch (error) {
    return handleError(error)
  }
}
