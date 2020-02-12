export const input = `
const styles = {
/* selectionStart */
.foo {
  display: box;
  display: flex-box;
  display: flex;
  & .bar {
    /* definitely not a fallback anywhere, just wanted to test a property with a dash */
    align-items: blah;
    align-items: flex-start;
  }
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  foo: {
    display: 'flex',
    '& .bar': {
      alignItems: 'flex-start',
      fallbacks: [{
        alignItems: 'blah'
      }]
    },
    fallbacks: [
      {
        display: 'box'
      },
      {
        display: 'flex-box'
      }
    ],
  }
}
`
