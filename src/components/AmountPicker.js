import React, { PureComponent } from 'react'
import { Animated, View, StyleSheet, TextInput, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Graph, { COL_WIDTH } from './Graph'

const WIDTH = Dimensions.get('window').width

export default class AmountPicker extends PureComponent {
  state = {
    step: null,
    isDirectBuy: false,
    x: new Animated.Value(0)
  }

  scroll = React.createRef()
  textInput = React.createRef()

  componentDidMount() {
    const {storePrice, currentBid, highestBid, minPricePercent} = this.props

    // --- adding listeners
    this.listener = this.state.x.addListener(this.update)

    // --- dynamically counting step
    let step = _.round(storePrice / 1000)
    if (step < 1) {
      step = 1
    } else if (step > 10) {
      step = 10
    }

    // --- set initial value to textInput component and scroll to position near minPrice / current bid / highest bid on init
    let initValue = _.ceil(storePrice * minPricePercent)
    let initialItemIndex = _.ceil(storePrice * minPricePercent / step)
    if (currentBid) {
      initValue = currentBid
      initialItemIndex = _.ceil(currentBid / step)
    }
    if (highestBid && !currentBid) {
      initValue = highestBid
      initialItemIndex = _.ceil(highestBid / step)
    }
    this.textInput.current.setNativeProps({ text: initValue.toString() })
    this.scroll.current._component.scrollTo({
      x: initialItemIndex * COL_WIDTH,
      animated: false
    })

    // --- set step value to the state
    this.setState({ step })
  }

  componentWillUnmount() {
    // --- removing listeners
    this.state.x.removeListener(this.listener)
  }

  update = ({ value: scrollPosition }) => {
    const {step, isDirectBuy} = this.state
    const {storePrice, onStopScrolling} = this.props

    // --- defining current value depending on scroll posiiton and step
    let val = _.floor(scrollPosition / COL_WIDTH) * step

    // --- fix val greater then storePrice
    if (val > storePrice) val = storePrice
    
    // --- directly set value to textInput component
    const text = val.toString()
    this.textInput.current.setNativeProps({text})

    // --- if current value is equal store price, do direct buy
    if (val === storePrice && !isDirectBuy) {
      this.setState({ isDirectBuy: true })
    } else if (val !== storePrice && isDirectBuy) {
      this.setState({ isDirectBuy: false })
    }

    // set value to parent component
    onStopScrolling(val)
  }

  render() {
    const {x, step, isDirectBuy} = this.state
    const {storePrice, highestBid} = this.props
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
            step={step}
            to={storePrice}
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
  storePrice: PropTypes.number.isRequired,
  currentBid: PropTypes.number,
  highestBid: PropTypes.number,
  minPricePercent: PropTypes.number,
  onStopScrolling: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff'
  },
  scrollContent: {
    paddingHorizontal: WIDTH / 2
  },
  pointer: {
    position: 'absolute',
    top: 0,
    left: WIDTH / 2 - 1,
    width: 2,
    height: '100%',
    backgroundColor: 'red'
  },
  pointerActive: {
    backgroundColor: '#00ff00'
  }
})
