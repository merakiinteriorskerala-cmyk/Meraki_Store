import { bench, describe } from 'vitest'
import { getPercentageDiff } from '../get-percentage-diff'

describe('getPercentageDiff', () => {
  bench('basic calculation', () => {
    getPercentageDiff(100, 80)
  })

  bench('large numbers', () => {
    getPercentageDiff(1000000, 800000)
  })

  bench('small floating point numbers', () => {
    getPercentageDiff(0.12345, 0.10000)
  })
})