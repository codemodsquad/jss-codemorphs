export const input = `
const styles = {
/* selectionStart */
body {
  color: green;
}
a:visited {
  text-decoration: none;
}
.foo { }
.test {
  background: red;
  a:visited {
    background: blue;
    .foo {
      background: green;
    }
  }
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  foo: {},
  test: {
    background: 'red',
    '@global': {
      'a:visited': {
        background: 'blue',
        '& $foo': {
          background: 'green',
        },
      },
    },
  },
  '@global': {
    body: {
      color: 'green',
    },
    'a:visited': {
      textDecoration: 'none',
    },
  },
}
`
