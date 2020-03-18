const removeComments = (state) => {
    return state.pins.filter(pin => pin.hasOwnProperty('image'))
}

export default removeComments