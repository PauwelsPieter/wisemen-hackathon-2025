import { describe, it } from 'node:test'
import { expect } from 'expect'
import { FORBIDDEN_S3_CHARACTERS, sanitizeS3Key } from '../sanitize-s3-key.js'

describe('sanitizeS3Key - Unit Tests', () => {
  it('replaces repeated slashes with a single slash', () => {
    const originalKey = 'testFolder////////testFolder//test.csv'
    const sanitizedKey = sanitizeS3Key(originalKey)

    expect(originalKey).not.toEqual(sanitizedKey)
    expect(sanitizedKey).toEqual('testFolder/testFolder/test.csv')
  })

  it('removes slash prefixes', () => {
    const originalKey = '/test.csv'
    const sanitizedKey = sanitizeS3Key(originalKey)

    expect(originalKey).not.toEqual(sanitizedKey)
    expect(sanitizedKey).toEqual('test.csv')
  })

  it('removes all forbidden characters when not passing a \'replaceWith\' value ', () => {
    const originalKey = `${FORBIDDEN_S3_CHARACTERS}/only-remaining-text`
    const sanitizedKey = sanitizeS3Key(originalKey)

    expect(originalKey).not.toEqual(sanitizedKey)
    expect(sanitizedKey).toEqual('only-remaining-text')
  })

  it('replaces all forbidden characters with the given \'replaceWith\' value', () => {
    const originalKey = `${FORBIDDEN_S3_CHARACTERS}`
    const sanitizedKey = sanitizeS3Key(originalKey, 'a')

    const expectedKey = 'a'.repeat(FORBIDDEN_S3_CHARACTERS.length)

    expect(originalKey).not.toEqual(sanitizedKey)
    expect(sanitizedKey).toEqual(expectedKey)
  })

  it('removes non-printable ascii and non-printable extended ascii characters characters', () => {
    const originalKey = `${String.fromCharCode(0)}/${String.fromCharCode(128)}/only-remaining-text`
    const sanitizedKey = sanitizeS3Key(originalKey)

    expect(originalKey).not.toEqual(sanitizedKey)
    expect(sanitizedKey).toEqual('only-remaining-text')
  })
})
