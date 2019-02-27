import React, { PureComponent } from 'react'
import { Animated, View, StyleSheet, TextInput, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Graph, { COL_WIDTH } from './Graph'

export default class AmountPicker extends PureComponent {
  state = {
    step: null,
    isDirectBuy: false,
    x: new Animated.Value(0)
  }

  scroll = React.createRef()
  textInput = React.createRef()

  componentDidMount() {
    const {amount, highestBid} = this.props

    // --- adding listeners
    this.listener = this.state.x.addListener(this.update)

    // --- dynamically counting step
    let step = _.round(amount / 1000)
    if (step < 1) {
      step = 1
    } else if (step > 10) {
      step = 10
    }

    // --- intial scroll to pisition near highest bid
    const initialItemIndex = _.ceil(highestBid / step)
    this.scroll.current._component.scrollTo({ x: initialItemIndex * COL_WIDTH, animated: false })

    // --- set step amount to the state
    this.setState({ step })
  }

  componentWillUnmount() {
    // --- removing listeners
    this.state.x.removeListener(this.listener)
  }

  update = ({ value: scrollPosition }) => {
    const {step, isDirectBuy} = this.state
    const {amount} = this.props

    // --- defining current value depending on scroll posiiton and step
    let val = _.floor(scrollPosition / COL_WIDTH) * step

    // --- fix val greater then amount
    if (val > amount) val = amount
    
    // --- directly set value to textInput component
    const text = val.toString()
    this.textInput.current.setNativeProps({text})

    // --- if current value is equal store price (amount), do direct buy
    if (val === amount && !isDirectBuy) {
      this.setState({ isDirectBuy: true })
    } else if (val !== amount && isDirectBuy) {
      this.setState({ isDirectBuy: false })
    }
  }

  render() {
    const {x, step, isDirectBuy} = this.state
    const {amount, highestBid} = this.props
    return (
      <View style={styles.container}>
        <Animated.ScrollView
          horizontal
          bounces={false}
          ref={this.scroll}
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x }
                }
              }
            ],
            { useNativeDriver: true }
          )}
        >
          <Graph
            to={amount}
            step={step}
            highestBid={highestBid}
          />
        </Animated.ScrollView>
        <View style={[
          styles.pointer,
          isDirectBuy && styles.pointerActive
        ]} />
        <TextInput
          editable={false}
          ref={this.textInput}
        />
      </View>
    )
  }
}

AmountPicker.propTypes = {
  amount: PropTypes.number.isRequired,
  highestBid: PropTypes.number,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff'
  },
  scrollContent: {
    paddingHorizontal: Dimensions.get('window').width / 2
  },
  pointer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: 'red'
  },
  pointerActive: {
    backgroundColor: '#00ff00'
  }
})
