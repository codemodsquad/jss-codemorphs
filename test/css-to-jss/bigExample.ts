export const input = `
const styles = {
/* selectionStart */
@keyframes alarm {
  from {
    color: red;
  }
  50% {
    color: initial;
  }
  to {
    color: red;
  }
}
.foo {
  color: green;
  & .bar-qux, & .glorm:after {
    color: red;
  }
  & .baz:after {
    content: 'whoo';
  }
}
.glorm {
  color: green;
  display: box;
  display: flex-box;
  display: flex;
}
.bar-qux {
  color: white;
  animation: alarm 1s linear infinite;
}
@media screen {
  a {
    text-decoration: none;  
    .foo {
      color: brown;
    }
  }
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
  '@keyframes alarm': {
    from: {
      color: 'red',
    },
    '50%': {
      color: 'initial',
    },
    to: {
      color: 'red',
    },
  },
  foo: {
    color: 'green',
    '& $barQux, & $glorm:after': {
      color: 'red',
    },
    '& .baz:after': {
      content: '"whoo"',
    }
  },
  glorm: {
    color: 'green',
    display: 'flex',
    fallbacks: [
      {
        display: 'box',
      },
      {
        display: 'flex-box',
      },
    ],
  },
  barQux: {
    color: 'white',
    animation: '$alarm 1s linear infinite',
  },
  '@media screen': {
    '$foo': {
      '& $barQux': {
        color: 'orange',
      }
    },
    '@global': {
      a: {
        textDecoration: 'none',
        '& $foo': {
          color: 'brown',
        },
      },
    },
  },
}
`
