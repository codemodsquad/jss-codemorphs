export const input = `
const styles = {
/* selectionStart */
.test {
  background: red !important;
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  test: {
    background: [['red'], '!important'],
  }
}
`
