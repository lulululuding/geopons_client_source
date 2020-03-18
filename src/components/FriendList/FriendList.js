import React, { memo, useCallback, useContext, useMemo } from 'react'
// import { makeStyles } from '@material-ui/core/styles'
import './FriendList.css'
import Context from  '../../context'

const Friend = memo(({ friend, select }) => {
    const selectFriend = useCallback(() => select(friend._id) ,[ friend ])

    return (
        <div className="friend" onClick={selectFriend}>
            <span
                className="friend_face"
                style={{ backgroundImage: `url(${friend.picture})` }}
            />
            <span className="friend_name">{ friend.name }</span>
        </div>
    )
})

// const friends = [
//     // { name: "Jim" },
//     // { name: 'Jimmy' },
//     // { name: "Guillum" },
//     // { name: 'Tom' },
//     // { name: 'Nina' },
//     // { name: 'Lee' }
//     // { name: "My" , _id: "5e4f765eefb90e23541ca5d4" },
//     // { name: "Json" , _id:"5e705ac11c9d440000420f9b" }
//     // { name: "Nina" , _id:"5e7062cb1c9d440000420f9d" }
// ]

const FriendList = memo(({ select }) => {

    const { state } = useContext(Context);

    const friends = useMemo(() => {
        const friends = []
        friends.push(state.currentUser)
        friends.push(
            { name: "Json" , _id:"5e705ac11c9d440000420f9b", picture:'/avatar/Json.jpg' }
        )
        return friends
    },[ state.currentUser ])

    return (
        <div className="friend-list-scroll">
            <div className="friend-list">
                <ul style={{ width: `${friends.length * 65}px` }}>
                    {
                        friends.map( friend =>  <li key={friend.name}><Friend select={select} friend={friend} /></li> )
                    }
                </ul>
            </div>
        </div>
    ) 
})

export default FriendList