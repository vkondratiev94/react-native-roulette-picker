import React, {Component} from 'react'
import AmountPicker from './components/AmountPicker'

export default class App extends Component {
  render() {
    return (
      <AmountPicker
        amount={250}
        highestBid={213}
      />
    )
  }
}