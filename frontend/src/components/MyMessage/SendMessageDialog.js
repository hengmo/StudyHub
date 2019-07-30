import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogActions, TextField, } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { AppContext } from '../../contexts/appContext';
import RequestButton from '../UIElements/RequestButton';

const styles = {
  appBar: {
    position: 'relative',
    paddingRight: "0!important",
  },
  flex: {
    flex: 1,
  },
  dialogBody:{
    margin: '20px 15px',
    width: 'calc(100% - 30px)',
  },
  dialogTextField:{
    margin: '8px',
    width: 'calc(100% - 16px)'
  }
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SendMessageDialog extends Component {
  static contextType = AppContext;

  state = {
    messageTitle: '',
    messageBody: '',
    sendMessageTo: '',
    buttonLoading: false,
  };

  sendMessage = async () => {
    const { sendMessageTo, messageTitle, messageBody } = this.state;
    const { email } = JSON.parse(localStorage.getItem('user-info'));

    if (sendMessageTo === '' || messageTitle === '' || messageBody === ''){
      this.context.actions.snackbarOpenHandler("공란이 있을 수 없습니다.",'warning');
      return false;
    }
    else if (sendMessageTo.trim() === email){
      this.context.actions.snackbarOpenHandler("자기 자신에게 쪽지를 전송할 수 없습니다.",'warning');
      return false;
    }

    this.setState({
      buttonLoading: true,
    });
    const res = await this.context.actions.sendMessage(sendMessageTo.trim(), messageTitle, messageBody);
    this.context.actions.snackbarOpenHandler(res.message, res.state, { vertical: 'bottom', horizontal: 'left' });
    this.props.handleClose();
    this.setState({
      buttonLoading: false,
    });
  }

  handleTextFieldOnBlur = e => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    });
  }

  setToInitialState = (to = null) =>{
    console.log('setToInitial State');
    this.setState({
      ...this.state,
      messageTitle: null,
      messageBody: null,
      sendMessageTo: to,
    });
  }

  render() {
    const { buttonLoading } = this.state;
    const { classes, open, initialRecipientEmail } = this.props;

    return (
      <Dialog
        open={open}
        onClose={()=> this.props.handleClose()}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              쪽지 작성
            </Typography>
            <IconButton color="inherit" onClick={()=> this.props.handleClose()} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.dialogBody}>
          <TextField
            disabled={initialRecipientEmail ? true : false}
            id="outlined-full-width"
            label="받는 사람"
            name='sendMessageTo'
            defaultValue={initialRecipientEmail}
            className={classes.dialogTextField}
            placeholder="아이디(이메일)"
            fullWidth
            margin="normal"
            variant="outlined"
            autoFocus={!Boolean(initialRecipientEmail)}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={this.handleTextFieldOnBlur}
          />

          <TextField
            id="outlined-full-width"
            label="제목"
            name = 'messageTitle'
            autoFocus = {Boolean(this.props.initialRecipientEmail)}
            className = {classes.dialogTextField}
            placeholder="내용"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={this.handleTextFieldOnBlur}
          />

          <TextField
            id="outlined-full-width"
            label="내용"
            name='messageBody'
            multiline
            rows="12"
            className={classes.dialogTextField}
            placeholder="내용"
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={this.handleTextFieldOnBlur}
          />

          <DialogActions style={{ margin: 0, }}>
            <RequestButton value="전송" buttonLoading={buttonLoading} clickHandler={this.sendMessage} />
          </DialogActions>
        </div>
      </Dialog>
    );
  }
}

SendMessageDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  initialRecipientEmail: PropTypes.string.isRequired,
};

export default withStyles(styles)(SendMessageDialog);