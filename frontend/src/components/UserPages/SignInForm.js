import React, { Component } from 'react';
import './Page.css';
import { apiUrl } from '../../helpers/apiClient';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import { green, red } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/appContext';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 20,
  },
  TextField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  Button: {
    width: 300,
  },
  ButtonMargin: {
    marginTop: theme.spacing.unit,
  },
  ItemCenter: {
    alignSelf: 'center',
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  GoogleCol: {
    color: 'white',
    backgroundColor: red[600],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
  NaverCol: {
    color: 'white',
    backgroundColor: '#1EC800',
    '&:hover': {
      backgroundColor: green[800],
    },
  },
});

class SignInPage extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    // formFieldInput : 해당 객체의 property에 사용자가 각 칸에 입력한 값들을 저장한다.
    // formFieldValid : 각 칸에 입력된 값 (formFiledInput 객체의 properties)의 상태를 저장한다(null, error, warning etc)
    // formFieldMessage : 유효성 검사를 통과하지 못한 칸 아래에 나타낼 오류 메시지를 저장한다.
    this.state = {
      formFieldInput: {
        email: '',
        password: '',
      },
      formFieldValid: {
        emailValid: null,
        passwordValid: null,
      },
      formFieldMessage: {
        emailValError: '',
        passwordValError: '',
      },
    };
  }

  onChange = name => e => {
    const value = e.target.value;

    this.setState(prevState => ({
      formFieldInput: {
        ...prevState.formFieldInput,
        [name]: value,
      },
    }));
  };

  onSubmit = async e => {
    e.preventDefault();
    const { email, password } = this.state.formFieldInput;
    const { state, message } =  await this.context.actions.signin(email, password);
    
    if (message === "Missing credentials") {
      return this.context.actions.snackbarOpenHandler('이메일 또는 비밀번호를 입력해주세요.', 'warning');
    }
    else if (state === "warning") {
      return this.context.actions.snackbarOpenHandler('입력하신 이메일 또는 비밀번호가 잘못 되었습니다.', state);
    }
    this.context.actions.snackbarOpenHandler(message, state);
    localStorage.setItem('user-info', JSON.stringify({ email: email, loginStatus: true, }));
    this.props.history.push("/");
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="login" style={{ minHeight: '100vh', margin: '0', padding: '0' }}>
        <main
          className={classes.main}
          style={{
            position: 'absolute',
            right: '25%',
            left: '25%',
            top: '8%',
          }}
        >
          <CssBaseline />
          <Paper className={classes.paper} style={{ paddingTop: '0', marginTop: 0 }}>
            <Avatar className={classes.avatar} style={{ marginTop: '3vh' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" style={{ fontWeight: '700', marginTop: '2vh' }}>
              로그인
            </Typography>
            <form onSubmit={this.onSubmit} className={classes.container}>
              <TextField
                id="emailInp"
                label="이메일"
                fullWidth
                className={classes.textField}
                value={this.state.formFieldInput.email}
                helperText={this.state.formFieldMessage.emailValError}
                onChange={this.onChange('email')}
                margin="normal"
              />
              <TextField
                id="passwordInp"
                label="비밀번호"
                fullWidth
                type="password"
                className={classes.textField}
                value={this.state.formFieldInput.password}
                helperText={this.state.formFieldMessage.passwordValError}
                onChange={this.onChange('password')}
                margin="normal"
              />
              <Button style={{ marginTop: 50 }} className={`${classes.Button} ${classes.ItemCenter}`} type="submit" fullWidth color="primary" variant="contained">
                로그인
              </Button>
              <a className={`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href={`${apiUrl}/users/google_auth`}>
                <Button variant="contained" className={`${classes.GoogleCol} ${classes.Button}`}>
                  구글 계정으로 시작하기
                </Button>
              </a>
              <a className={`removeLinkDec ${classes.ButtonMargin} ${classes.ItemCenter}`} href={`${apiUrl}/users/naver_auth`}>
                <Button variant="contained" className={`${classes.NaverCol} ${classes.Button}`}>
                  네이버 계정으로 시작하기
                </Button>
              </a>
              <Button style={{ marginTop: 19, fontSize: 16, width:'fit-content', }} component={Link} to="/signup" color="primary">회원가입</Button>
            </form>
          </Paper>
        </main>
      </div>
    );
  }
}

SignInPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
export default withStyles(styles)(SignInPage);
