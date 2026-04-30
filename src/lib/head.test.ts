import { describe, expect, it } from 'vitest'
import { getDocumentTitle } from './head'

describe('getDocumentTitle', () => {
  it('shows a dev flag in development', () => {
    expect(getDocumentTitle(true)).toBe('[DEV] iimage playground')
  })

  it('keeps the production title unchanged', () => {
    expect(getDocumentTitle(false)).toBe('iimage playground')
  })
})
