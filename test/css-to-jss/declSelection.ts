export const input = `
const styles = {
  foo: {
    /* selectionStart */
    background-color: lightgreen;
    color: white;
    /* selectionEnd */
  }
}
`

export const expected = `
const styles = {
  foo: {
    backgroundColor: 'lightgreen',
    color: 'white',
  }
}
`
