export const input = `
const styles = {
/* selectionStart */
.foo.bar {
  border: 1px solid blue;
}
/* selectionEnd */
}
`

export const options = {}

export const expected = `
const styles = {
  foo: {},
  bar: {},
  '$foo$bar': {
    border: '1px solid blue',
  },
}
`
