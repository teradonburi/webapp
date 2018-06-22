import React from 'react'

class Test extends React.Component {

  constructor(props) {
    super(props)
    this.state = { a: 'abc'}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log('----this.props----', this.props)
    console.log('----nextProps----', nextProps)
    console.log('----prevState----', prevState)
    return prevState
  }

  componentDidMount () {}

  render () {
    console.log('----this.state----', this.state)
    return <div/>
  }
}

const arr = ['a', 'b', 'c']

export default class MainPage extends React.Component {
  state = {
    idx: 0,
  }

  buttonClick = () => {
    const { idx } = this.state
    this.setState({idx: (idx + 1) % arr.length})
  }

  render () {

    return (
      <div>
        <button onClick={this.buttonClick}>Button</button>
        <Test myprop={arr} idx={this.state.idx} />
      </div>
    )
  }
}
