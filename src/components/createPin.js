import React, { useState, useCallback, memo, useRef } from 'react';
import { fileUpload } from '../api/fileUploader';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery, Typography, TextField, Button } from '@material-ui/core';
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone';
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/SaveTwoTone';
import { CREATE_PIN_MUTATION } from '../graphql/mutations'
import { useClient } from '../client'
import ImgDialogue from './imgPreviewDia'
import { getUploadFiles } from '../utils/scanMap'

const useStyles = makeStyles(theme => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: theme.spacing(.2)
    },
    contentField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '95%'
    },
    input: {
        display: 'none'
    },
    alignCenter: {
        display: 'flex',
        alignItems: 'center'
    },
    iconLarge: {
        fontSize: 40,
        marginRight: theme.spacing(1)
    },
    leftIcon: {
        fontSize: 20,
        marginRight: theme.spacing(1)
    },
    rightIcon: {
        fontSize: 20,
        marginLeft: theme.spacing(1)
    },
    button: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginLeft: 0
    }
}) )

const initMap = () => {
    const map = new Map()
    return map
}

const CreatePin = ({ PinPos, togglePannel }) => {
    const classes = useStyles();
    const mobileSize = useMediaQuery('(max-width: 500px)');
    const client = useClient();
    const [title, setTitle] = useState('');
    const [ imagesCount, setImagesCount ] = useState(0);
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [ isOpen, setOpen ] = useState(false)
    const imagesMapRef = useRef(initMap())
  
    const handleDeleteDraft = useCallback(() => {
        setTitle('');
        setImagesCount(0)
        setContent('');
        // dispatch({ type: 'DELETE_DRAFT' });
        // togglePannel();
    },[ setTitle, setImagesCount, setContent, togglePannel ]);
  
    const handleSubmit = useCallback( async event => {
        try {
            event.preventDefault();
            setSubmitting(true);
            const urls = await fileUpload( getUploadFiles( imagesMapRef.current ) );
            console.log(urls)
            const variables = { 
                title, 
                image: !!urls ? urls : [], 
                content, 
                latitude: PinPos.lat, 
                longitude: PinPos.lng
            };
            await client.request(CREATE_PIN_MUTATION, variables);
            setSubmitting(false);
            handleDeleteDraft();
            togglePannel();
        } catch (err) {
            setSubmitting(false);
            console.error('Error creating pin ', err);
        }
    }, [ imagesMapRef, content, setSubmitting, PinPos, togglePannel, title ]);

    const toggleClose = useCallback(() => {
        setOpen(!isOpen)
    }, [ setOpen, isOpen ])
  
    return (
        <>  
            <ImgDialogue 
                isOpen={isOpen} 
                imagesCount={imagesCount} 
                setImagesCnt={setImagesCount}
                imagesRef={imagesMapRef}
                toggle={toggleClose} 
            />
            <form className={classes.form}>
                <Typography
                    className={classes.alignCenter}
                    component="h2"
                    variant="h4"
                    color="secondary"
                >
                    <LandscapeIcon className={classes.iconLarge} /> Pin Location
                </Typography>
                <div>
                    <TextField
                        name="title"
                        label="title"
                        placeholder="Insert pin title"
                        onChange={e => setTitle(e.target.value)}
                    />
                    <Button
                        style={{ color: imagesCount > 0 && 'green' }}
                        component="span"
                        size="small"
                        className={classes.button}
                        onClick={toggleClose}
                    >
                        <AddAPhotoIcon />
                        { imagesCount }
                    </Button>
                </div>
                <div className={classes.contentField}>
                    <TextField
                        name="content"
                        label="Content"
                        multiline
                        rows={mobileSize ? '3' : '6'}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        onChange={e => setContent(e.target.value)}
                    />
                </div>
                <div>
                    <Button
                        onClick={handleDeleteDraft}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                    >
                        <ClearIcon className={classes.leftIcon} />
                        Discard
                    </Button>
                    <Button
                        type="submit"
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        disabled={!title.trim() || !content.trim() || imagesCount === 0 || submitting}
                        onClick={handleSubmit}
                    >
                        Submit
                        <SaveIcon className={classes.rightIcon} />
                    </Button>
                </div>
            </form>
        </>
    );
}

export default memo(CreatePin)