export const input = `
const styles = {
/* selectionStart */
.button:hover {
  border: 1px solid blue;
  box-shadow: 0 0 0 10px blue, 0 0 0 15px green;
}
.button {
  border: none;
  margin: 5px 10px;
  font-size: 12px;
  background: white contain no-repeat;
  transition: background color font-size;
  line-height: 1;
  transition-duration: 300ms;
}
/* selectionEnd */
}
`

export const options = {}

export const expected = `
const styles = {
  '$button:hover': {
    border: '1px solid blue',
    boxShadow: '0 0 0 10px blue, 0 0 0 15px green'
  },
  button: {
    border: 'none',
    margin: '5px 10px',
    fontSize: 12,
    background: 'white contain no-repeat',
    transition: 'background color font-size',
    lineHeight: '1',
    transitionDuration: 300
  },
}
`
