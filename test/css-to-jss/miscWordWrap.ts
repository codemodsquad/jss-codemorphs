export const input = `
const styles = {
  foo: {
    /* selectionStart */
    white-space: -moz-pre-wrap !important;  /* Mozilla, since 1999 */
    white-space: -webkit-pre-wrap;          /* Chrome & Safari */ 
    white-space: -pre-wrap;                 /* Opera 4-6 */
    white-space: -o-pre-wrap;               /* Opera 7 */
    white-space: pre-wrap;                  /* CSS3 */
    word-wrap: break-word;                  /* Internet Explorer 5.5+ */
    word-break: break-all;
    white-space: normal;
    /* selectionEnd */
  }
}
`

export const expected = `
const styles = {
  foo: {
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    whiteSpace: 'normal',
    fallbacks: [
      {
        whiteSpace: [['-moz-pre-wrap'], '!important'],
      },
      {
        whiteSpace: '-webkit-pre-wrap',
      },
      {
        whiteSpace: '-pre-wrap',
      },
      {
        whiteSpace: '-o-pre-wrap',
      },
      {
        whiteSpace: 'pre-wrap',
      },
    ],
  }
}
`
