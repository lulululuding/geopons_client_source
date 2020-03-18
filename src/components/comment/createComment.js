import React, { useState, useContext, memo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import { useClient } from '../../client'
import Context from '../../context'
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutations'

const useStyles = makeStyles(theme => ({
    form: {
      display: 'flex',
      justifyContent:'start',
      alignItems: 'center'
    },
    input: {
      flex: '1',
      margin: '0 5px',
      fontSize: '14px'  
    },
    clearButton: {
      padding: 0,
      color: 'red'
    },
    sendButton: {
      padding: 0,
      color: theme.palette.secondary.dark
    }
}) )

const CommentCreate = memo(() => {
    const client = useClient();
    const { state, } = useContext(Context);
    const classes = useStyles();
    const [comment, setComment] = useState('');
  
    const handleSubmitComment = useCallback(async () => {
        const variables = { pinId: state.currentPin._id, text: comment };
        //const { createComment } = await client.request(CREATE_COMMENT_MUTATION, variables);
        await client.request(CREATE_COMMENT_MUTATION, variables)
        setComment('')
        //dispatch({ type:'CREATE_COMMENT', payload: createComment })
    }, [ setComment, comment, client, state ])
    
    return (
        <form className={classes.form}>
            <IconButton
                onClick={() => setComment('')}
                disabled={!comment.trim()}
                className={classes.clearButton}
            >
                <ClearIcon />
            </IconButton>
            <InputBase
                className={classes.input}
                placeholder="Add Comment"
                multiline
                rows='3'
                value={comment}
                onChange={e => setComment(e.target.value)}
            />
            <IconButton
                onClick={handleSubmitComment}
                disabled={!comment.trim()}
                className={classes.sendButton}
            >
                <SendIcon />
            </IconButton>
        </form>
    );
})

export default CommentCreate