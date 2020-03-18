import React, { memo, useState, useCallback, useRef, useMemo, useContext } from 'react';
import { Dialog, Slide, AppBar, IconButton } from '@material-ui/core';
import MyMap from './map';
import CloseIcon from '@material-ui/icons/Close';
import './MapPop.css';
import CreatePIN from '../createPin'
import CommentPanel from '../comment'
import Context from '../../context'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" timeout="1000" ref={ref} {...props} mountOnEnter unmountOnExit />;
});

const styles = {
    inputDiaWrapper: {
        padding: '10px',
        borderRadius: '30px',
        height: '250px',
    }
}

const MapInputPop = memo(function ({ isOpen, togglePannel, clickPinPos, isAdd }) {

    const { state } = useContext(Context)
    
    return (
        <Dialog
            fullScreen
            maxWidth={'sm'}
            open={isOpen}
            onClose={togglePannel}
            aria-labelledby="max-width-dialog-title"
            TransitionComponent={Transition}
            id='inputDia'
        >
            <div style={styles.inputDiaWrapper}>
                {
                    isAdd && !state.friend ? 
                    <CreatePIN togglePannel={togglePannel} PinPos={clickPinPos} /> 
                    : 
                    <CommentPanel />
                }
            </div>
        </Dialog>
    )
})

const MapPop = memo(function MapPop({ isOpen, setClose, thePin }){
    const [ isInputDiaOpen, setInputDiaOpen ] = useState(false);
    const clickRef = useRef(false);
    const clickPinRef = useRef(0);

    const toggleCloseInput = useCallback( ev => {
        if (!clickRef.current) {
            if (!isInputDiaOpen && ev.hasOwnProperty('lnglat') ) clickPinRef.current = ev.lnglat
            clickRef.current = true
            setInputDiaOpen(!isInputDiaOpen)
            setTimeout(() => clickRef.current = false, 400)
        }
    } ,[isInputDiaOpen, setInputDiaOpen, clickRef, clickPinRef ]);

    const isAdd = useMemo(() => !thePin, [ thePin ]);

    return (
        <div>
            <Dialog 
                fullScreen 
                open={isOpen} 
                onClose={setClose} 
                TransitionComponent={Transition}
            >
                <AppBar >
                    <IconButton edge="start" color="inherit" onClick={setClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </AppBar>
                <MyMap setInput={toggleCloseInput} thePin={thePin} />
                <MapInputPop 
                    isOpen={isInputDiaOpen} 
                    togglePannel={toggleCloseInput} 
                    isAdd={isAdd}
                    clickPinPos={clickPinRef.current} 
                />
            </Dialog>
        </div>
    )
})

export default MapPop