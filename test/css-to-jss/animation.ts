export const input = `
const styles = {
/* selectionStart */
@keyframes foo {
  from {
    color: red;
  }
  50% {
    color: blue;
  }
  to {
    color: green;
  }
}
.test {
  animation: foo 1s ease;
  animation-name: foo;
  animation-iteration-count: 1;
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  '@keyframes foo': {
    from: {
      color: 'red',
    },
    '50%': {
      color: 'blue',
    },
    to: {
      color: 'green',
    },
  },
  test: {
    animation: '$foo 1s ease',
    animationName: '$foo',
    animationIterationCount: 1,
  },
}
`
