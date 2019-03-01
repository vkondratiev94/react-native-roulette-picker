import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import AmountPicker from './components/AmountPicker'
import _ from 'lodash'

export default class App extends Component {
  state = {
    value: null,
  }

  changeAmountHandler = _.debounce(value => {
    this.setState({value})
  }, 50)

  render() {
    return (
      <View style={styles.container}>
        <AmountPicker
          storePrice={490}
          currentBid={200}
          highestBid={213}
          minPricePercent={0.6}
          onStopScrolling={this.changeAmountHandler}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
})