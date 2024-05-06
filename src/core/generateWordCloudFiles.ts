import { chromium } from 'playwright'
import { logger } from '../logger/logger.js'
import type { Options } from '../options/Options.js'
import { profiles } from '../profile/profiles.js'
import { generateWordCloudFile } from './generateWordCloudFile.js'

export const generateWordCloudFiles = async (options: Options): Promise<void> => {
  const targetProfiles = options.profile === undefined ? profiles : profiles.filter((profile) => profile.name === options.profile)

  if (targetProfiles.length === 0) {
    throw new Error('There are no profiles.')
  }

  logger.info('Launch browser')
  const browser = await chromium.launch({ headless: options.headless })
  const page = await browser.newPage()
  logger.info('Open https://www.wordclouds.com/')
  await page.goto('https://www.wordclouds.com/')

  for (const profile of targetProfiles) {
    await generateWordCloudFile(page, profile)
  }

  logger.info('Close browser')
  await browser.close()
}
