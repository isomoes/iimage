const APP_TITLE = 'iimage playground'

export function getDocumentTitle(isDev: boolean) {
  return isDev ? `[DEV] ${APP_TITLE}` : APP_TITLE
}
