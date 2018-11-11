import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import Switch from '@material-ui/core/Switch'
import { reduxForm, Field, FieldArray } from 'redux-form'
import { withStyles } from '@material-ui/core'
import { create } from './modules/user'

// TextField
const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  type='text',
  required = false,
  rootClass = '',
}) => (
  <TextField
    required={required}
    classes={{root: rootClass}}
    error={!!(touched && error)}
    label={label}
    type={type}
    variant='outlined'
    helperText={touched && error}
    {...input}
  />
)

// TextArea
const renderTextArea = ({
  input,
  label,
  meta: { touched, error },
  rows = 4,
  required = false,
  rootClass = '',
}) => (
  <TextField
    required={required}
    classes={{root: rootClass}}
    multiline
    rows={rows}
    error={!!(touched && error)}
    label={label}
    variant='outlined'
    helperText={touched && error}
    {...input}
  />
)

// Select
const renderSelect = ({
  input: { value, onChange },
  label,
  children,
  meta: { touched, error },
  onFieldChange,
  required = false,
  rootClass = '',
}) => (
  <TextField
    required={required}
    classes={{root: rootClass}}
    select
    label={label}
    variant='outlined'
    value={value}
    onChange={e => {
      onChange(e.target.value)
      onFieldChange && onFieldChange(e.target.value)
    }}
    helperText={touched && error}
  >
    {children}
  </TextField>
)


// RadioButton
const renderRadio = ({
  input: { value, onChange },
  label,
  children,
  meta: { touched, error },
  onFieldChange,
  row = true,
  required = false,
  rootClass = '',
}) => (
  <FormControl classes={{root: rootClass}} required={required} component='fieldset' error={!!(touched && error)}>
    <FormLabel component='legend'>{label}</FormLabel>
    <RadioGroup
      row={row}
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        onFieldChange && onFieldChange(e.target.value)
      }}
    >
      {children}
    </RadioGroup>
    {touched && error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
)

// CheckButton
const renderCheckBox = ({
  input: { value, onChange },
  label,
  children,
  meta: { touched, error },
  onFieldChange,
  row = true,
  required = false,
  rootClass = '',
}) => (
  <FormControl classes={{root: rootClass}} required={required} component='fieldset' error={!!(touched && error)}>
    <FormLabel component='legend'>{label}</FormLabel>
    <FormGroup
      row={row}
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        onFieldChange && onFieldChange(e.target.value)
      }}
    >
      {children}
    </FormGroup>
    {touched && error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
)

// Switch
const renderSwitch = ({
  input: { value, onChange },
  label,
  onFieldChange,
  rootClass = '',
}) => (
  <FormControlLabel
    classes={{root: rootClass}}
    control={
      <Switch
        checked={value}
        onChange={(e, bool) => {
          onChange(bool)
          onFieldChange && onFieldChange(bool)
        }}
      />
    }
    label={label}
  />
)

const renderFile = withStyles(() => ({
  input: {
    display: 'none',
  },
  button: {
    marginTop: 10,
  },
}))(
  ({
    input: { value, name, onChange },
    label,
    meta: { touched, error },
    classes,
    onFieldChange,
    buttonLabel,
    accept = '*',
    required = false,
    rootClass = '',
  }) => (
    <FormControl classes={{root: rootClass}} required={required} component='fieldset' error={!!(touched && error)}>
      <FormLabel component='legend'>{label}</FormLabel>
      <input
        accept={accept}
        className={classes.input}
        id={name}
        type='file'
        onChange={e => {
          e.preventDefault()
          onChange(e.target.files[0])
          onFieldChange && onFieldChange(e.target.files[0])
        }}
        onBlur={() => {}}
      />
      <label htmlFor={name}>
        <Button classes={{root: classes.button}} variant='outlined' component='span'>
          {buttonLabel || 'アップロード'}
        </Button>
      </label>
      <label>{value && value.name}</label>
      {touched && error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
)

const renderMembers = withStyles(theme => ({
  input: {
    display: 'flex',
  },
  space: {
    marginLeft: 10,
  },
  member: {
    marginTop: 10,
    padding: 10,
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 10,
  },
  header: {
    marginTop: 0,
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
  deleteButton: {
    height: 30,
  },
}))(
  ({
    label,
    fields,
    meta: { error, submitFailed },
    classes,
    required = false,
    rootClass = '',
  }) => (
    <FormControl classes={{root: rootClass}} required={required} component='fieldset' error={!!(submitFailed && error)}>
      <FormLabel component='legend'>{label}</FormLabel>
      {fields.map((member, idx) => (
        <div key={idx} className={classes.member}>
          <h6 className={classes.header}>メンバー{idx + 1}</h6>
          <div className={classes.input}>
            <Field
              name={`${member}.lastName`}
              component={renderTextField}
              label='姓'
              rootClass={classes.space}
            />
            <Field
              name={`${member}.firstName`}
              component={renderTextField}
              label='名'
              rootClass={classes.space}
            />
            <Button classes={{root: [classes.deleteButton, classes.space].join(' ')}} size='small' variant='contained' color='secondary' onClick={() => fields.remove(idx)}>削除</Button>
          </div>
        </div>
      ))}
      <div>
        <Button classes={{root: classes.addButton}} size='medium' variant='contained' color='primary' onClick={() => fields.push({})}>追加</Button>
        {submitFailed && error && <FormHelperText>{error}</FormHelperText>}
      </div>
    </FormControl>
  )
)

@reduxForm({
  form: 'form',
  validate: values => {
    const errors = {}
    if (!values.text) {
      errors.text = '必須項目です'
    }
    if (!values.password) {
      errors.password = '必須項目です'
    }
    if (!values.textarea) {
      errors.textarea = '必須項目です'
    }
    if (!values.select) {
      errors.select = '必須項目です'
    }
    if (!values.radio) {
      errors.radio = '必須項目です'
    }
    if (!values.checkbox) {
      errors.checkbox = '必須項目です'
    }
    if (!values.image) {
      errors.image = '必須項目です'
    }
    if (!values.members || !values.members.length) {
      errors.members = { _error: '１人以上メンバーの追加が必要です' }
    } else {
      const membersArrayErrors = []
      values.members.forEach((member, memberIndex) => {
        const memberErrors = {}
        if (!member || !member.firstName) {
          memberErrors.firstName = '必須項目です'
          membersArrayErrors[memberIndex] = memberErrors
        }
        if (!member || !member.lastName) {
          memberErrors.lastName = '必須項目です'
          membersArrayErrors[memberIndex] = memberErrors
        }
      })
      if (membersArrayErrors.length) {
        errors.members = membersArrayErrors
      }
    }
    return errors
  },
})
@connect(
  state => ({
    user: state.user.user,
  }),
  { create }
)
@withStyles(() => ({
  formControl: {
    marginTop: 10,
    marginBottom: 10,
  },
}))
export default class MainPage extends React.Component {
  state = {
    send: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      images: [],
      uploading: {},
    }
    this.props.initialize({text: 'てきすと'})
  }

  submit = (values) => {
    const params = new FormData()
    params.append('text', values.text)
    params.append('password', values.password)
    params.append('textarea', values.textarea)
    params.append('select', values.select)
    params.append('radio', values.radio)
    params.append('checkbox', values.checkbox)
    params.append('switch', !!values.switch)
    params.append('image', values.image)
    params.append('members', JSON.stringify(values.members))
    this.props.create(params)
  }

  render () {
    const { classes, handleSubmit } = this.props
    const { send } = this.state

    return (
      <form onSubmit={handleSubmit(this.submit)} encType='multipart/form-data'>
        <div style={{width: 400, display: 'flex', flexDirection: 'column'}} >
          <Field name='text' label='テキストフィールド' component={renderTextField} rootClass={classes.formControl} required />
          <Field name='password' type='password' label='パスワード' component={renderTextField} rootClass={classes.formControl} required />
          <Field name='textarea' label='テキストエリア' component={renderTextArea} rootClass={classes.formControl} required />
          <Field name='select' label='セレクト' component={renderSelect} rootClass={classes.formControl} required >
            <MenuItem value=''>未選択</MenuItem>
            <MenuItem value={10}>10円</MenuItem>
            <MenuItem value={20}>20円</MenuItem>
            <MenuItem value={30}>30円</MenuItem>
          </Field>
          <Field name='radio' label='ラジオボタン' component={renderRadio} rootClass={classes.formControl} required >
            <FormControlLabel value='female' control={<Radio />} label='女性' />
            <FormControlLabel value='male' control={<Radio />} label='男性' />
            <FormControlLabel value='other' control={<Radio />} label='その他' />
          </Field>
          <Field name='checkbox' label='チェックボックス' component={renderCheckBox} rootClass={classes.formControl} required >
            <FormControlLabel value='check1' control={<Checkbox />} label='オプション１'/>
            <FormControlLabel value='check2' control={<Checkbox />} label='オプション２'/>
            <FormControlLabel value='check3' control={<Checkbox />} label='オプション３'/>
          </Field>
          <Field name='switch' label='スイッチ' component={renderSwitch} />
          <Field name='image' label='画像' accept='image/*' component={renderFile} rootClass={classes.formControl} required />
          <FieldArray name='members' label='メンバー' component={renderMembers} rootClass={classes.formControl} required />
          <Button type='submit' size='medium' variant='contained' color='primary' >送信</Button>
        </div>
        <div>
          {send && JSON.stringify(send)}
        </div>
      </form>
    )
  }
}
