/* eslint-env browser, commonjs */

import * as React from 'react'
import ReactDOM from 'react-dom'
import Root from './Root'

let reloads = 0
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('#root not found')

function mount(Root: React.ComponentType<any>): void {
  ReactDOM.render(<Root key={++reloads} />, rootElement)
}

if ((module as any).hot instanceof Object) {
  ;(module as any).hot.accept('./Root', () => {
    mount(require('./Root').default)
  })
}

mount(Root)
