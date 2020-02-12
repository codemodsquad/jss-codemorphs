# jss-codemorphs

[![CircleCI](https://circleci.com/gh/codemodsquad/jss-codemorphs.svg?style=svg)](https://circleci.com/gh/codemodsquad/jss-codemorphs)
[![Coverage Status](https://codecov.io/gh/codemodsquad/jss-codemorphs/branch/master/graph/badge.svg)](https://codecov.io/gh/codemodsquad/jss-codemorphs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/jss-codemorphs.svg)](https://badge.fury.io/js/jss-codemorphs)

[Work in Progress] jscodeshift transforms for converting from CSS to JSS

## Example

### Before

```js
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
```

### After

```js
const styles = {
  foo: {
    color: 'green',
    '& $barQux': {
      color: 'red',
    },
    '& .baz': {
      color: 'blue',
    },
  },
  barQux: {
    color: 'white',
  },
  '@media screen': {
    $foo: {
      '& $barQux': {
        color: 'orange',
      },
    },
  },
}
```
