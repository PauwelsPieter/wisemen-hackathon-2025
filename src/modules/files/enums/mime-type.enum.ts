import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger'

export enum MimeType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TXT = 'text/plain',
  HTML = 'text/html',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  TIFF = 'image/tiff',
  BMP = 'image/bmp',
  HEIC = 'image/heic',
  WEBP = 'image/webp',
  GIF = 'image/gif',
  OCTET_STREAM = 'application/octet-stream'
}

export function MimeTypeApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: MimeType,
    enumName: 'MimeType'
  })
}
