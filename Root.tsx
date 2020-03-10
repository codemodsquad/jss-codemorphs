import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, Theme } from '@material-ui/core/styles'
import debounce from 'lodash/debounce'
import noop from 'lodash/noop'
import j from 'jscodeshift'
import { convertCssToJssString } from '../src/convertCssToJss'
import classNames from 'classnames'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: '1 1 auto',
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  input: {
    flex: '0 0 50%',
    display: 'flex',
    flexDirection: 'column',
  },
  output: {
    flex: '0 0 50%',
    display: 'flex',
    flexDirection: 'column',
  },
  textarea: {
    flex: '1 1 auto',
    fontFamily: 'monospace',
    fontSize: theme.typography.pxToRem(14),
  },
  error: {
    color: 'red',
  },
}))

const example = `@keyframes alarm {
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
`

export default function Root(): React.ReactNode {
  const classes = useStyles()
  const [input, setInput] = React.useState(example)
  const [output, setOutput] = React.useState<string | Error>('')
  const [updating, setUpdating] = React.useState(false)

  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<any>) => {
      setInput(event.target.value)
    },
    [setInput]
  )

  const updateOutput = React.useMemo(
    () =>
      debounce((input: string): void => {
        let converted: string | Error
        try {
          converted = convertCssToJssString(input).replace(/^ {2,}/gm, match =>
            match.substring(match.length / 2)
          )
        } catch (error) {
          converted = error
        }
        setOutput(converted)
        setUpdating(false)
      }, 250),
    [setOutput, setUpdating]
  )

  React.useEffect(() => {
    setUpdating(true)
    updateOutput(input)
  }, [input, setUpdating, updateOutput])

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">jss-codemorphs</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.main}>
        <div className={classes.input}>
          <Typography variant="h6" color="initial">
            Input CSS
          </Typography>
          <textarea
            value={input}
            className={classes.textarea}
            onChange={handleInputChange}
          />
        </div>
        <div className={classes.output}>
          <Typography variant="h6" color="initial">
            Output JSS
          </Typography>
          {updating ? (
            <CircularProgress variant="indeterminate" />
          ) : (
            <textarea
              value={output instanceof Error ? output.message : output}
              readOnly
              className={classNames(classes.textarea, {
                [classes.error]: output instanceof Error,
              })}
            />
          )}
        </div>
      </div>
    </div>
  )
}
