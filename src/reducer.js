import removeComments from './utils/removeComment'

export default function reducer(state, { type, payload }) {
  switch (type) {
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: payload
      };
    case 'IS_LOGGED_IN':
      return {
        ...state,
        isAuth: payload
      };
    case 'SIGNOUT_USER':
      return {
        ...state,
        isAuth: false,
        currentUser: null
      };
    case 'CREATE_DRAFT':
      return {
        ...state,
        currentPin: null,
        draft: {
          latitude: 0,
          longitude: 0
        }
      };
    case 'UPDATE_DRAFT_LOCATION':
      return {
        ...state,
        draft: payload
      };
    case 'DELETE_DRAFT':
      return {
        ...state,
        draft: null
      };
    case 'GET_PINS':
      return {
        ...state,
        pins: payload
      };
    case 'CREATE_PIN':
      const newPin = payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
      return {
        ...state,
        pins: [ newPin , ...prevPins ]
      };
    case 'SET_PIN':
      let pin = payload
      if ((typeof payload) === "string") {
        pin = state.pins.find( pin => pin._id === payload)
      }
      return {
        ...state,
        currentPin: pin,
        draft: null
      };
    case 'DELETE_PIN':
      const deletedPin = payload;
      const filteredPins = state.pins.filter(pin => pin._id !== deletedPin._id);
      if (state.currentPin) {
        const isCurrentPin = deletedPin._id === state.currentPin._id;
        if (isCurrentPin) {
          return {
            ...state,
            pins: filteredPins,
            currentPin: null
          };
        }
      }
      return {
        ...state,
        pins: filteredPins
      };
    case 'CREATE_COMMENT':
      const updatedCurrentPin = payload;
      const updatedPins = state.pins.map(pin =>
        pin._id === updatedCurrentPin._id ? updatedCurrentPin : pin
      )
      // 在pins增加一个comment 他是去掉了image属性的Pin
      let newComment = updatedCurrentPin.comments[ updatedCurrentPin.comments.length - 1 ]
      newComment = JSON.parse( JSON.stringify( newComment ) )
      newComment.title = newComment.text
      newComment._id = updatedCurrentPin._id + updatedCurrentPin.comments.length
      newComment.pinId = updatedCurrentPin._id
      newComment.longitude = updatedCurrentPin.longitude
      newComment.latitude = updatedCurrentPin.latitude  
      updatedPins.unshift( newComment )
      return {
        ...state,
        pins: updatedPins,
        currentPin: updatedCurrentPin
      }

    case "SELECT_FRIEND":
      // 查出所有与他有关的点
      const friendPins = []
      removeComments(state).forEach(pin => pin.author._id === payload && friendPins.push(pin))
      return {
        ...state,
        friend: friendPins
      }

      case "DESELECT_FRIEND":
        return {
          ...state,
          friend: null
        }
    default:
      return state;
  }

}
