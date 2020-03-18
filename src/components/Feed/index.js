import React, { useState, memo } from "react";
import MySlider from './slider'
import "./index.scss";
import VisibilityIcon from '@material-ui/icons/VisibilityOutlined'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ChatIcon from '@material-ui/icons/Chat'

const BackBar = memo( ({ isAct, setPin }) => (
  <div className={isAct ? "back-bar active" : 'back-bar' }>
    <nav className={isAct ? "inner active" : 'inner' }>
      <span>
        <VisibilityIcon /> 22
      </span>
      <span>
        <ThumbUpIcon /> 24
      </span>
      <span>
        <ChatIcon /> 30
      </span>
      <input type="button" value="Get Pos" onClick={setPin} />
    </nav>
  </div>
) )

const ForeFront = memo(({ images }) => (
  <div className='fore-front'>
    <MySlider images={images} />
  </div>
) )


const Feed =  memo(({ setPin, item }) => {
  const [ isAct, setAct ] = useState(false);

  return (
    <div className="feed" onClick={() => setAct(!isAct)} >
      <ForeFront images={item.image} />
      <BackBar isAct={isAct} setPin={setPin} />
    </div>
  );
} )

export default Feed