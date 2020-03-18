import React, { memo, useCallback, useMemo, useContext, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, IconButton } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn'
import { MsgType } from './Type'
import Feed from './Feed'
import Context from '../context' 
import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries'
import PinSubscription from './subscription'

const styles = {
    root: {
        width: '100%',
        maxWidth: '600px',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    pinItem: {
        height: '270px'
    },
    commentItem: {
        height: '90px'
    }
}

const MyItem = memo(function MyItem ({ item, setMapOpen, setPin }) {
    const { primaryMsg, type } = useMemo(() => {
        const type = item.hasOwnProperty('image') ? MsgType.Pin : MsgType.Comment
        let { title } = item
        if ( !!title && title.length > 50) title = title.substr(0,50) + "..."
        return { primaryMsg: title, type }
    }, [ item ]);

    const selectPin = useCallback(() => {
        setPin(item)
        setMapOpen()
    },[ setPin, setMapOpen, item ]);

    return (
        <ListItem 
            alignItems="flex-start" 
            key={item._id} 
            style={type === MsgType.Comment ? styles.commentItem: styles.pinItem}
        >
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={item.author.picture} />
            </ListItemAvatar>
            <ListItemText
                primary={ item.author.name }
                secondary={
                    <>
                        <Typography
                            component="span"
                            variant="body2"
                            style={{ display: 'inline' }}
                            color="textPrimary"
                        >
                            { !!primaryMsg && primaryMsg }
                        </Typography>
                    </>
                }
            />
            {
                type === MsgType.Comment ? 
                    <IconButton onClick={selectPin} style={{ justifySelf: 'end' }}>
                        <LocationOnIcon color="primary" />
                    </IconButton> 
                :
                    <Feed setPin={selectPin} item={item} />
            }
        </ListItem>
    )
})

const ListPage = memo(function ({ setMapOpen, setPin }) {
    const { dispatch, state } = useContext(Context)
    const client = useClient()

    useEffect(() => {
        getPins()
    } ,[])

    const getPins = useCallback(async () => {
        const { getPins } = await client.request(GET_PINS_QUERY);
        dispatch({ type: 'GET_PINS', payload: getPins });
    },[dispatch, client ])

    const setThePin = useCallback( item => {
        setPin(item)
        dispatch( { type: 'SET_PIN', payload: item } )
    }, [ dispatch ])

    return (
        <>
            <List style={styles.root}>
                { state.pins.map( pin => <MyItem key={pin.id} setMapOpen={setMapOpen} item={pin} setPin={setThePin} /> ) }
            </List>
            <PinSubscription dispatch={dispatch} />
        </>
    )
})

// const pins = [
//     { name: "Jimmy", type: MsgType.Pin, position: { longitude: 116.123465, latitude: 39.456787 , id:"1"} },
//     { name: "Lee", type: MsgType.Pin, position: { longitude: 120.30, latitude: 31.57 , id:"2"} },
//     { name: "Lee", type: MsgType.Comment, position: { longitude: 120.30, latitude: 31.57 , id:"2"},content:"Great? How could you do that?" , id:"3"} ,
// ];

export default ListPage;
