import React from 'react';
import { withStyles, Typography ,} from '@material-ui/core';
import { Favorite, } from '@material-ui/icons';

const styles = theme => ({
  root: {
    width: '100%',
    height: 160,
		background: '#353E48',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	container: {
		width: '100%',
		height: '90%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: '#B4B7BB',
		display: 'flex',
	},
	favoriteIcon: {
		color: '#F64060',
	},
});

const Footer = (props) => {
	const { classes } = props;
	return (
		<div className={classes.root}>
			<div className={classes.container}>
				<Typography className={classes.text} variant="h5">StudyHub Web Dev Project.</Typography>
				<Typography className={classes.text} style={{ fontSize: 15, }}><Favorite className={classes.favoriteIcon}/>Copyright © 2019. StudyHub(Yu JaeSeo, Jeong JinLee, Choi JunSung). All right reserved.<Favorite className={classes.favoriteIcon}/></Typography>
			</div>
		</div>
	);
}

export default withStyles(styles)(Footer);