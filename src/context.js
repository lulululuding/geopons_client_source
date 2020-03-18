import { createContext } from 'react';

const Context = createContext({
  currentUser: {_id:'5e705940f4ad1b0930fbebd2',name:'18901520980',email:'18901520980',picture:'/avatar/my.jpg'},
  //currentUser: null,
  isAuth: true,
  draft: null,
  pins: [],
  currentPin: null,
  friend: null
});

export default Context;
