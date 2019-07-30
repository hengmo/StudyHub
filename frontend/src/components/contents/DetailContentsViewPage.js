import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import { withStyles, Button, Typography, Card, CardContent, CardMedia, Avatar, Grid, Menu, MenuItem, Snackbar, } from '@material-ui/core';
import SendMessageDialog from '../MyMessage/SendMessageDialog';
import { AppContext } from '../../contexts/appContext';
import classNames from 'classnames';
import { Group, Place, Update, Category } from '@material-ui/icons';
import { apiUrl } from '../../helpers/apiClient';
import RequestButton from '../UIElements/RequestButton';

const style = theme => ({
  root: {
    background: '#F7F7F7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'white',
  },
  headerContainer: {
    width: '72%',
    height: 'auto',
    margin: '45px 0px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImgContainer: {
    width: '58%',
  },
  coverImgCard: {
    width: '85%',
  },
  informContainer: {
    width: '41%',
  },
  informWrapper: {
    marginTop: 15,
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 7,
  },
  userRequestContainer: {
    height: '88%',
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 150,
    margin: 2,
  },
  main: {
    width: '100%',
    height: 430,
    display: 'flex',
    justifyContent: 'center',
  },
  mainContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '72%',
    marginTop: 50,
  },
  detailContainer: {
    width: '58%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  detailContent: {
    width: '97%',
    marginBottom: 25,
  },
  avatarIcon: {
    backgroundColor: '#90CAF9',
    width: '1.5vw',
    height: '3vh',
  },
  mapContainer: {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  naverMap: {
    width: '100%',
    height: '100%',
  },
  bottom: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    width: '72%',
    height: 'auto',
    display: 'flex',
    marginTop: '4vh',
    marginBottom: '9vh',
  },
  participantsWrapper: {
    width: '58.5%',
    height: '100%',
    marginBottom: '10vh',
  },
  gridContainer: {
    width: '97%',
    maxWidth: 670,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    height: '97%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class DetailContentsViewPage extends Component {
  static contextType = AppContext;

  state = {
    anchorEl: null,
    anchorParticipantsEle: null,
    messageSendDialogOpen: false,
    sendMessageTo: '',
    sendMessageDialog: null,
  };

  leaderMenuOpen = (e, email) => {
    this.setState({
      anchorEl: e.currentTarget,
      sendMessageTo: email,
    });
  };

  participantMenusOpen = (e, email) => {
    this.setState({
      anchorParticipantsEle: e.currentTarget,
      sendMessageTo: email,
    });
  };

  handleClose = () => {
    console.log('handle Close');
    this.setState({ ...this.state, sendMessageTo: '', messageSendDialogOpen: false, anchorEl: null, anchorParticipantsEle: null }, () =>
      this.sendMessageDialog.setToInitialState(),
    );
  };

  handleOpen = () => {
    const { sendMessageTo } = this.state;
    const {
      userInfo: { status: loginStatus },
    } = this.props;
    if (!loginStatus) {
      this.context.actions.snackbarOpenHandler('먼저 로그인 해주세요.', 'warning');
    } else this.setState({ ...this.state, messageSendDialogOpen: true }, this.sendMessageDialog.setToInitialState(sendMessageTo));
  };

  userRendering = () => {
    const {
      classes,
      content,
      participants,
      userInfo: { status: loginStatus, email: loginedUserEmail },
      joinStudy,
      leaveStudy,
      deleteStudy,
      buttonLoading,
    } = this.props;

    if (loginStatus) {
      if (content.leader.email === loginedUserEmail) {
        return <RequestButton value="스터디 삭제" buttonLoading={buttonLoading} clickHandler={deleteStudy} />;
      } else if (participants.map(user => user.email).includes(loginedUserEmail)) {
        return (
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h6">참여중인 스터디 입니다.</Typography>
            <div className={classes.buttonContainer}>
              <div className={classes.wrapper}>
                <RequestButton value="탈퇴하기" buttonLoading={buttonLoading} clickHandler={leaveStudy} />
              </div>
            </div>
          </div>
        );
      }
      return (
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h6">참여 하시겠습니까?</Typography>
          <div className={classes.buttonContainer}>
            <RequestButton value="참여하기" buttonLoading={buttonLoading} clickHandler={joinStudy} />
          </div>
        </div>
      );
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h6">
          스터디에 참여 하려면
          <br />
          로그인 해주세요.
        </Typography>
      </div>
    );
  };

  render() {
    const { classes, content, participants } = this.props;
    const { anchorEl, anchorParticipantsEle, messageSendDialogOpen, sendMessageTo, snackbarOpen } = this.state;
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return (
      <Fragment>
        <div className={classes.root}>
          <div className={classes.header}>
            <div className={classes.headerContainer}>
              <div className={classes.cardImgContainer}>
                <Card className={classes.coverImgCard}>
                  <CardMedia 
                    component="img" 
                    alt="coverImg" 
                    style={{ width: '100%', height: '42vh' }} 
                    src={`${apiUrl}/${content.imageUrl}`}
                  />
                </Card>
              </div>
              <div className={classes.informContainer}>
                <div className={classes.titleWrapper}>
                  <Typography style={{ wordBreak: 'keep-all', fontSize: 36, fontWeight: 600, }}>
                    {content.title}
                  </Typography>
                </div>
                <div className={classes.informWrapper}>
                  <div className={classes.iconWrapper}>
                    <Avatar className={classes.avatarIcon}>
                      <Update style={{ width: 18, }} />
                    </Avatar>
                    <Typography style={{ fontWeight: 600, fontSize: 14, marginLeft: 5, }}>{new Date(content.createdAt).toLocaleDateString('ko-KR', options)}</Typography>
                  </div>
                  <div className={classes.iconWrapper}>
                    <Avatar className={classes.avatarIcon}>
                      <Category style={{ width: 15, }}/>
                    </Avatar>
                    <Typography style={{ fontWeight: 600, fontSize: 14, marginLeft: 5, }}>{`${content.categories}`}</Typography>
                  </div>
                  <div className={classes.iconWrapper}>
                    <Avatar className={classes.avatarIcon}>
                      <Group style={{ width: 15, }}/>
                    </Avatar>
                    <Typography style={{ fontWeight: 600, fontSize: 14, marginLeft: 5, }}>현재 {participants.length + 1}명이 참여중</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.main}>
            <div className={classes.mainContainer}>
              <div className={classes.detailContainer}>
                <div className={classes.detailContent}>
                  <Typography variant="h5" style={{ marginBottom: 15 }}>
                    세부 사항
                  </Typography>
                  <Typography style={{ width: '88%', fontSize: 18, marginBottom: 25 }} component="p">
                    {`${content.description}`.split('\n').map((str, index) => {
                      return (
                        <span key={index}>
                          {str}
                          <br />
                        </span>
                      );
                    })}
                  </Typography>
                </div>
              </div>
              <div className={classes.mapContainer}>
                <div className={classes.iconWrapper}>
                  <Avatar className={classes.avatarIcon}>
                    <Place style={{ width: 18, }} />
                  </Avatar>
                  <Typography style={{ fontWeight: 600, fontSize: 14, marginLeft: 5, }}>{content.studyLocation}</Typography>
                </div>
                <Card style={{ width: '80%', height: '86%', maxWidth: 350, maxHeight: 327, }}>
                  <div id="naverMap" className={classes.naverMap} />
                </Card>
              </div>
            </div>
          </div>
          <div className={classes.bottom}>
            <div className={classes.bottomContainer}>
              <div className={classes.participantsWrapper}>
                <Typography variant="h5" style={{ marginBottom: 15 }}>참석자</Typography>
                <div className={classes.gridContainer}>
                  <div className={classNames(classes.layout, classes.cardGrid)}>
                    <Grid container spacing={16}>
                      <Grid item sm={6} md={4} lg={3}>
                        <Card className={classes.card}>
                          <Button
                            aria-owns={anchorEl ? 'leader-menus' : undefined}
                            aria-haspopup="true"
                            onClick={e => this.leaderMenuOpen(e, content.leader.email)}
                          >
                            <Avatar style={{ width: 73, height: 73, marginTop: 12 }} src={`${apiUrl}/${content.leader.profileImg}`} />
                          </Button>
                          <Menu id="leader-menus" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                            <MenuItem onClick={this.handleOpen}>쪽지 보내기</MenuItem>
                          </Menu>
                          <CardContent style={{ textAlign: 'center' }}>
                            <Typography gutterBottom fontWeight="fontWeightMedium">
                              {content.leader.name}
                            </Typography>
                            <Typography style={{ fontSize: 15 }}>스터디장</Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      {participants.map(user => (
                        <Grid item key={user.name} sm={6} md={4} lg={3}>
                          <Card className={classes.card}>
                            <Button
                              aria-owns={anchorParticipantsEle ? 'participants-menus' : undefined}
                              aria-haspopup="true"
                              onClick={e => this.participantMenusOpen(e, user.email)}
                            >
                              <Avatar style={{ width: 73, height: 73, marginTop: 12 }} src={`${apiUrl}/${user.profileImg}`} />
                            </Button>
                            <Menu
                              id="participants-menus"
                              anchorEl={anchorParticipantsEle}
                              open={Boolean(anchorParticipantsEle)}
                              onClose={this.handleClose}
                            >
                              <MenuItem onClick={this.handleOpen}>쪽지 보내기</MenuItem>
                            </Menu>
                            <CardContent style={{ textAlign: 'center' }}>
                              <Typography gutterBottom fontWeight="fontWeightMedium">
                                {user.name}
                              </Typography>
                              <Typography style={{ fontSize: 15 }}>스터디원</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </div>
              </div>
              <div className={classes.userRequestContainer}>{this.userRendering()}</div>
            </div>
          </div>
        </div>
        <SendMessageDialog
          innerRef={element => (this.sendMessageDialog = element)}
          handleClose={this.handleClose}
          initialRecipientEmail={sendMessageTo}
          open={messageSendDialogOpen}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          onClose={() => this.handleClose()}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">메시지 전송에 성공했습니다.</span>}
        />
      </Fragment>
    );
  }
}

DetailContentsViewPage.propTypes = {
  classes: propTypes.object.isRequired,
  content: propTypes.object.isRequired,
  participants: propTypes.array.isRequired,
  userInfo: propTypes.object.isRequired,
  joinStudy: propTypes.func.isRequired,
};

export default withStyles(style)(DetailContentsViewPage);
