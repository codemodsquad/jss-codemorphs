export const input = `
const styles = {
/* selectionStart */
.button:after {
  content: 'JSS';
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  '.button:after': {
    content: '"JSS"',
  }
}
`
