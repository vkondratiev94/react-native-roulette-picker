import React, { Component } from 'react'
import AmountPicker from './components/AmountPicker'
import _ from 'lodash'

export default class App extends Component {
  state = {
    value: null,
  }

  changeAmountHandler = _.debounce(value => {
    this.setState({value})
  }, 100)

  render() {
    return (
      <AmountPicker
        storePrice={489}
        currentBid={200}
        highestBid={213}
        minPricePercent={0.6}
        onStopScrolling={this.changeAmountHandler}
      />
    )
  }
}