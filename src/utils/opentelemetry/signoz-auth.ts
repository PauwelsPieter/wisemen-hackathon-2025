export function getOTLPExporterHeaders (): Record<string, string> {
  const auth = process.env.SIGNOZ_AUTH
  const key = process.env.SIGNOZ_KEY ?? process.env.SIGNOZ_INGESTION_KEY

  const headers = {
    'content-type': 'application/json'
  }

  if (key == null) {
    return headers
  }

  if (auth === 'basic') {
    headers['Authorization'] = `Basic ${key}`
  } else {
    headers['signoz-access-token'] = key
  }

  return headers
}
