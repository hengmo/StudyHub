import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonProgress: {
    color: 'black',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class RequestButton extends React.Component {
  state = {
    success: false,
  };

  handleButtonClick = async () => {
    const { clickHandler } = this.props;
    if(!(await clickHandler())) return;
  };

  render() {
    const { classes, value, buttonLoading, } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={buttonLoading}
            onClick={() => this.handleButtonClick() }
          >
            {value}
          </Button>
          {buttonLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
      </div>
    );
  }
}

RequestButton.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  buttonLoading: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func.isRequired,
};

export default withStyles(styles)(RequestButton);