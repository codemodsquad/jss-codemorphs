# jss-codemorphs

[![CircleCI](https://circleci.com/gh/codemodsquad/jss-codemorphs.svg?style=svg)](https://circleci.com/gh/codemodsquad/jss-codemorphs)
[![Coverage Status](https://codecov.io/gh/codemodsquad/jss-codemorphs/branch/master/graph/badge.svg)](https://codecov.io/gh/codemodsquad/jss-codemorphs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/jss-codemorphs.svg)](https://badge.fury.io/js/jss-codemorphs)

jscodeshift transform for converting from CSS to JSS

[Try it out!](https://codemodsquad.github.io/jss-codemorphs/)

# Table of Contents

<!-- toc -->

- [JSCodeshift Transforms](#jscodeshift-transforms)
  - [`css-to-jss`](#css-to-jss)
- [Node.js API](#nodejs-api)
  - [`convertCssToJss`](#convertcsstojss)
  - [`convertCssToJssString`](#convertcsstojssstring)

<!-- tocstop -->

# JSCodeshift Transforms

## `css-to-jss`

Converts CSS to JSS. Accepts `selectionStart` and `selectionEnd` options if you only want to convert
a subrange of a file.

### Before

```ts
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
```

### Command

```
jscodeshift -t path/to/jss-codemorphs/css-to-jss.js <file>
```

### After

```ts
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
  '& $baz:after': {
    content: '"whoo"',
  },
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
  $foo: {
    '& $barQux': {
      color: 'orange',
    },
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
baz: {},
```

# Node.js API

## `convertCssToJss`

```js
import convertCssToJss from 'jss-codemorphs/convertCssToJss'
```

Converts CSS to JSS. Returns an array of JS `ObjectProperty` AST nodes
representing the JSS. If you just want the string text, use `convertCssToJssString`.

Signature:

```js
declare function convertCssToJss(rawCss: string): ObjectProperty[]
```

## `convertCssToJssString`

```js
import { convertCssToJssString } from 'jss-codemorphs/convertCssToJss'
```

Converts CSS to JSS. Returns the resulting JSS code as a string. You can
pass `recast.Options` as the second argument to customize the code format.
Uses `{ tabWidth: 2, useTabs: false, quote: 'single' }` as default options.

Signature:

```js
declare function convertCssToJssString(
  rawCss: string,
  options?: recast.Options
): string
```
