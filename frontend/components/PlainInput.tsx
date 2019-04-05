import { Input } from 'reactstrap'
import Select from 'react-select'

export const PlainInput = props => {
  const cls = `plain-input ${props.className}`
  return <Input {...props} className={cls} />
}

const bsPrimary = '#7adeaef'
const bsLightGray = '#ced4da'

export const PlainSelect = props => (
  <Select
    {...props}
    theme={theme => ({
      ...theme,
      colors: {
        ...theme.colors,

        // border when focused
        primary: bsPrimary,

        // separator
        // caret when not open
        neutral20: bsLightGray,

        // border hover
        neutral30: bsLightGray,

        // caret hover when not open
        neutral40: bsLightGray,

        // caret open not hovered
        neutral60: bsLightGray
      }
    })}
    styles={{
      control: base => ({
        ...base,
        borderStyle: 'none none solid none',
        borderColor: bsLightGray,
        borderRadius: 0,
        borderWidth: '1px',
        backgroundColor: 'transparent'
      }),

      // hide the indicator separator
      indicatorSeparator: () => ({}),

      // only show placeholder when focused
      placeholder: (base, state) => ({
        ...base,
        opacity: state.isFocused ? 1 : 0
      })
    }}
  />
)
