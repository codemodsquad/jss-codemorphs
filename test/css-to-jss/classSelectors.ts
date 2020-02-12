export const input = `
const styles = {
/* selectionStart */
.foo {
  color: green;
  & .bar-qux {
    color: red;
  }
  & .baz {
    color: blue;
  }
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
    '& $barQux': {
      color: 'red',
    },
    '& .baz': {
      color: 'blue',
    }
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
