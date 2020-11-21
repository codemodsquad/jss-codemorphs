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
  button: {},
  '$button:after': {
    content: '"JSS"',
  },
}
`
