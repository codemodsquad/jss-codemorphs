export const input = `
const styles = {
/* selectionStart */
.foo {
  font-size-adjust: 2.35;
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  foo: {
    fontSizeAdjust: 2.35,
  }
}
`
