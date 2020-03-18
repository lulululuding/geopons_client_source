import React, { useState, useCallback, useContext } from 'react';
import MapPop from '../components/MapPop';
import ListPage from '../components/FeedList';
import TopBar from '../components/TopBar'
import Navigation from '../components/navigation'
import FriendList from '../components/FriendList'
import Context from '../context'
import './App.css'

const styles = {
    root: {
        width: "100%",
        maxWidth: "600px",
        margin: " 0 auto",
        background: 'white',
        height: '100vh'
    }
}

function App () {
    const [ isMapOpen, setMapOpen ] = useState(false);
    const [ thePin, setThePin ] = useState(null);
    const { dispatch }  = useContext(Context)

    const setMap = useCallback(() => {
        if (isMapOpen) {
             // 如果是查看好友 退出时清楚state中的好友
            dispatch({ type: 'DESELECT_FRIEND' })
        }
        setMapOpen(!isMapOpen);
    }, [ isMapOpen, setMapOpen ]);

    const addPin = useCallback(() => { setThePin(null); setMap() },[setMap, setThePin]);

    const selectFriend = useCallback((_id) => {
        setThePin(null)
        dispatch({ type: "SELECT_FRIEND" ,payload: _id })
        setMap()
    }, [ dispatch, setMap ])

    return (
        <div style={styles.root}>
            <TopBar addPin={addPin} />
            <Navigation />
            <FriendList select={selectFriend} />
            <ListPage setMapOpen={setMap} setPin={setThePin} />
            <MapPop isOpen={isMapOpen} setClose={setMap} thePin={thePin} /> 
        </div>
    )
}

export default App