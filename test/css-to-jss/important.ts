export const input = `
const styles = {
/* selectionStart */
body {
  background: red !important;
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  body: {
    background: [['red'], '!important'],
  }
}
`
