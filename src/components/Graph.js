import React, { PureComponent } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'

export const COL_WIDTH = 50

export default class Graph extends PureComponent {
  render() {
    const {highestBid, to, step} = this.props
    const iterations = (to / step) + 1
    return (
      <View style={styles.container}>
        {
          _.times(iterations).map(i => {
            const value = i * step
            const isHighest = value === highestBid || (value - step < highestBid && value > highestBid)
            const isDivisibleByFive = i % 5 === 0
            return (
              <View key={i} style={[
                styles.column,
                isHighest && styles.columnHighest,
              ]}>
                <Text style={[isDivisibleByFive && !isHighest && styles.textDivisible]}>{value}</Text>
              </View>
            )
          })
        }
      </View>
    )
  }
}

Graph.propTypes = {
  to: PropTypes.number.isRequired,
  highestBid: PropTypes.number
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  column: {
    height: 20,
    width: COL_WIDTH,
    alignItems: 'center',
    borderWidth: 1
  },
  columnHighest: {
    backgroundColor: '#00FF00'
  },
  textDivisible: {
    color: '#FF0000'
  }
})
