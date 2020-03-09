export const input = `
const styles = {
/* selectionStart */
.test {
  -webkit-transform: translateX(0);
  -moz-transform: translateX(0);
  -ms-transform: translateX(0);
  -o-transform: translateX(0);
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  test: {
    WebkitTransform: 'translateX(0)',
    MozTransform: 'translateX(0)',
    msTransform: 'translateX(0)',
    OTransform: 'translateX(0)',
  }
}
`
