import React, { memo } from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera'
import RoomIcon from '@material-ui/icons/RoomOutlined'

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        height: '68px',
        backgroundColor: 'white',
        fontSize: '15px',
        zIndex: '10'
    },
    h1: {
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
        height: '38px',
        fontSize: 0,
        backgroundImage: 'url(/assets/logo.jpg)',
        backgroundSize: 'contain',
        backgroundPosition:'center',
        backgroundRepeat: 'no-repeat'
    },
    span: {
        padding: '0 20px'
    }
}

const TopBar = memo(({ addPin }) => {
    return (
        <div style={styles.wrapper}>
            <span style={styles.span}>
                <PhotoCameraIcon />
            </span>
            <div style={styles.h1}></div>
            <span style={styles.span} onClick={addPin}>
                <RoomIcon />
            </span>
        </div>
    )
})

export default TopBar