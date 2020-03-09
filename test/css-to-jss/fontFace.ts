export const input = `
const styles = {
/* selectionStart */
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot');
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  '@font-face': {
    fontFamily: 'MyWebFont',
    src: 'url(webfont.eot)'
  }
}
`
