export const input = `
const styles = {
/* selectionStart */
@media screen and (min-width: 480px) {
  body {
    background-color: lightgreen;
    color: white;
  }
}

#main {
  border: 1px solid black;
}

ul li {
  padding: 5px;
}
/* selectionEnd */
}
`

export const expected = `
const styles = {
  '@media screen and (min-width: 480px)': {
    '@global': {
      body: {
        backgroundColor: 'lightgreen',
        color: 'white',
      }
    },
  },
  '@global': {
    '#main': {
      border: '1px solid black',
    },
    'ul li': {
      padding: 5,
    },
  }
}
`
