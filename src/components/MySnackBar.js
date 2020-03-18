import React, {  memo } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SnackBarContent from '@material-ui/core/SnackbarContent'

const styles = {
	warningBg: {
		background: 'red'
	}
}

const MySnackBar = memo(({ isOpen, close, msg }) => {

	return (
		<Snackbar
			style={styles.warningBg}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
			open={isOpen}
			autoHideDuration={4000}
			onClose={close}
		>
			<SnackBarContent
				aria-describedby='message-id'
				message={<span id="message-id">{msg}</span>}
				style={styles.warningBg}
				action={[
					<IconButton
						key="close"
						aria-label="Close"
						color="inherit"
						//className={classes.close}
						onClick={close}
					>
						<CloseIcon />
					</IconButton>,
				]}
			/>
		</Snackbar>
	);
})

export default MySnackBar;