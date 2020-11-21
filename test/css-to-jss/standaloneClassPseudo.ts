export const input = `
const styles = {
/* selectionStart */
.button:hover {
  border: 1px solid blue;
  box-shadow: 0 0 0 10px blue, 0 0 0 15px green;
}
/* selectionEnd */
}
`

export const options = {}

export const expected = `
const styles = {
  button: {},
  '$button:hover': {
    border: '1px solid blue',
    boxShadow: '0 0 0 10px blue, 0 0 0 15px green'
  },
}
`
