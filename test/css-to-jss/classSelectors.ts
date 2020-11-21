export const input = `
const styles = {
/* selectionStart */
.foo {
  color: green;
  & .bar-qux, & .glorm:after {
    color: red;
  }
  & .baz {
    color: blue;
  }
}
.glorm {
  color: green;
}
.bar-qux {
  color: white;
}
@media screen {
  .foo {
    & .bar-qux {
      color: orange;
    }
  }
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  foo: {
    color: 'green',
    '& $barQux, & $glorm:after': {
      color: 'red',
    },
    '& $baz': {
      color: 'blue',
    }
  },
  baz: {},
  glorm: {
    color: 'green',
  },
  barQux: {
    color: 'white',
  },
  '@media screen': {
    '$foo': {
      '& $barQux': {
        color: 'orange',
      }
    }
  },
}
`
