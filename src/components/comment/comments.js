import React, { memo, useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@material-ui/core';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import Context from '../../context'


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
	  backgroundColor: theme.palette.background.paper,
	  height: '200px',
	  overflowY: 'auto'
    },
    inline: {
      display: 'inline'
	},
	item: {
		padding: '1px 8px',
	},
	primaryTxt: {
		lineHeight: '1'
	}
}))

// const comments = [
// 	{author: { picture:'/avatar/Jimmy.jpg', name:"Jimmy" }, createdAt:"1583656802469", text:"I've just watched you in the corner"},
// 	{author: { picture:'/avatar/Jimmy.jpg', name:"Jimmy" }, createdAt:"1583656800069", text:"I also want to travel to Swisse!!"},
// 	{author: { picture:'/avatar/Lee.jpg', name:"Lee" }, createdAt:"1583656700469", text:"Bro put you hands up and raise your buggy"},
// 	{author: { picture:'/avatar/Nina.jpg', name:"Nina" }, createdAt:"1583650000469", text:"Looks like an boring man"},
// ]

const Comments = memo(() => {
	const classes = useStyles();
	const { state } = useContext(Context);

	const comments = useMemo(() => {
		if (state.currentPin.hasOwnProperty('comments')){
			return state.currentPin.comments
		}
		const pin = state.pins.find(pin => pin._id === state.currentPin.pinId)
		console.log(pin)
		return pin.comments
	}, [ state.currentPin, state.pins ]);
	
	return (
		<List className={classes.root}>
			{
				comments.map((comment, i) => (
					<ListItem key={i} alignItems="flex-start" className={classes.item}>
						<ListItemAvatar>
							<Avatar src={comment.author.picture} alt={comment.author.name} />
						</ListItemAvatar>
						<ListItemText
							primary={
								<Typography
                                	component="span"
                                	variant="body2"
                                	style={{ display: 'inline' }}
									color="textPrimary"
									className={classes.primaryTxt}
                            	>
                                	{ comment.text }
                            	</Typography>
							}
							secondary={
							<>
								<Typography
									className={classes.inline}
									component="span"
									color="textPrimary"
									variant='button'
								>
									{comment.author.name}
								</Typography>
								· {distanceInWordsToNow(Number(comment.createdAt))} ago
							</>
							}
						/>
					</ListItem>)
				)
			}
		</List>
	);
})

export default Comments