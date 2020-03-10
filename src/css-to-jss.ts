import { FileInfo, API, Options } from 'jscodeshift'
import { convertCssToJssString } from './convertCssToJss'

module.exports = function cssToJss(
  fileInfo: FileInfo,
  api: API,
  options: Options
): string | null | undefined | void {
  const selectionStart = options.selectionStart
    ? parseInt(options.selectionStart)
    : 0
  const selectionEnd = options.selectionEnd
    ? parseInt(options.selectionEnd)
    : fileInfo.source.length

  const before = fileInfo.source.substring(0, selectionStart)
  const rawCss = fileInfo.source.substring(selectionStart, selectionEnd)
  const after = fileInfo.source.substring(selectionEnd)

  return `${before}${convertCssToJssString(rawCss)}${after}`
}
