import React, { PureComponent } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'

export const COL_WIDTH = 10

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
            const isFirstItem = i === 0
            const isLastItem = i === iterations - 1
            return (
              <View 
                key={i}
                style={[
                  styles.column,
                  isFirstItem && styles.columnFirst,
                  isLastItem && styles.columnLast
                ]}
              >
                <View style={[
                  styles.tick,
                  isDivisibleByFive && styles.tickDivisibleByFive,
                  isHighest && styles.tickHighest
                ]}/>
                {isDivisibleByFive && <Text style={[
                  styles.text,
                  isFirstItem && styles.textFirst,
                  isLastItem && styles.textLast
                ]}>{value}</Text>}
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
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  column: {
    height: 51,
    width: COL_WIDTH,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  columnFirst: {
    width: COL_WIDTH / 2 + 1,
    alignItems: 'flex-start'
  },
  columnLast: {
    width: COL_WIDTH / 2 + 1,
    alignItems: 'flex-end'
  },
  tick: {
    width: 1,
    height: 37,
    backgroundColor: '#979797'
  },
  tickHighest: {
    width: 2,
    height: '100%',
    backgroundColor: '#00c12e'
  },
  tickDivisibleByFive: {
    width: 2,
    backgroundColor: '#a3a3a3'
  },
  text: {
    position: 'absolute',
    left: '50%',
    bottom: -15,
    width: 100,
    marginLeft: -50,
    textAlign: 'center',
    color: '#a3a3a3',
    fontSize: 10
  },
  textFirst: {
    left: 0
  },
})
