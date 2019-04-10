import React from 'react';
import propTypes from 'prop-types';
import { withStyles, Button, Typography, Card, CardContent, CardMedia, Divider, List, ListItem, ListItemText, Avatar, Grid } from '@material-ui/core';
import classNames from 'classnames';
import { Group, Place, Update, Category } from '@material-ui/icons';
import { apiUrl } from '../../helpers/apiClient';

const style = theme => ({
  root: {
    background: '#F7F7F7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mainHeader: {
    width: '100%',
    height: 220,
    marginTop: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'white',
  },
  topContainer: {
    width: '68%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  simpleInformContainer: {
    height: '88%',
    width: '58%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  informTextContainer: {
    marginBottom: 22,
  },
  groupIcon: {
    width: 100,
    height: 50,
    marginBottom: 25,
    color: '#90CAF9',
  },
  leaderBtnContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  joinContainer: {
    height: '88%',
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    width: 150,
    margin: 2,
  },
  mainContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    width: '74%',
    marginTop: 50,
    marginBottom: 50,
  },
  detailContainer: {
    width: '60%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  detailContent: {
    width: '82%',
    marginBottom: 25,
  },
  avatarIcon: {
    backgroundColor: '#90CAF9',
  },
  naverMap: {
    width: '100%',
    height: 350,
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const DetailContentsView = props => {
  const {
    classes,
    content,
    joinStudy,
    signInInfo: { status: loginStatus, email: loginedUserEmail },
    participants,
    leaveStudy,
    deleteStudy,
  } = props;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <div className={classes.root}>
      <div className={classes.mainHeader}>
        <div className={classes.topContainer}>
          <Group className={classes.groupIcon} />
          <div className={classes.simpleInformContainer}>
            <div className={classes.informTextContainer}>
              <Typography style={{ marginBottom: 13 }}>{new Date(content.createdAt).toLocaleDateString('ko-KR', options)}</Typography>
              <Typography variant="h4">{content.title}</Typography>
            </div>
            <div className={classes.leaderBtnContainer}>
              <Typography style={{ marginRight: 15 }}>주최: {content.leader.name}</Typography>
            </div>
          </div>
          <div className={classes.joinContainer}>
            {loginStatus ? (
              content.leader.email === loginedUserEmail || participants.map(user => user.email).includes(loginedUserEmail) ? (
                <div style={{ textAlign: 'center' }}>
                  <Typography variant="h6">참여중인 스터디 입니다.</Typography>
                  <Button className={classes.button} variant="contained" color="primary" onClick={leaveStudy}>
                    탈퇴하기
                  </Button>
                </div>
              ) : (
                <div>
                  <Typography variant="h6">참여 하시겠습니까?</Typography>
                  <div className={classes.buttonContainer}>
                    <Button className={classes.button} variant="contained" color="primary" onClick={joinStudy}>
                      참여하기
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <div style={{ textAlign: 'center' }}>
                <Typography variant="h6">스터디에 참여 하려면<br />로그인 해주세요.</Typography>
              </div>
            )}
            {content.leader.email === loginedUserEmail && (
              <Button className={classes.button} variant="contained" color="primary" onClick={deleteStudy}>
                스터디 삭제
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className={classes.mainContainer}>
        <div className={classes.detailContainer}>
          <Card className={classes.detailContent}>
            <CardMedia component="img" alt="coverImg" style={{ width: '100%', height: '45vh' }} src={`${apiUrl}/${content.imageUrl}`} />
          </Card>
          <div className={classes.detailContent}>
            <Typography variant="h5" style={{ marginBottom: 15 }}>
              세부 사항
            </Typography>
            <Typography style={{ width: '88%', fontSize: 18, marginBottom: 25 }} component="p">
              {`${content.description}`.split('\n').map(str => {
                return (
                  <span key={str}>
                    {str}
                    <br />
                  </span>
                );
              })}
            </Typography>
            <Typography variant="h5" style={{ marginBottom: 15 }}>
              참석자
            </Typography>
            <div className={classNames(classes.layout, classes.cardGrid)}>
              <Grid container spacing={16}>
                <Grid item sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <Avatar style={{ width: '58%', height: '38%', marginTop: 12 }} src={`${apiUrl}/${content.leader.profileImg}`} />
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
                      <Avatar style={{ width: '58%', height: '38%', marginTop: 12 }} src={`${apiUrl}/${user.profileImg}`} />
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
        <Card style={{ width: '33%', height: '80%' }}>
          <CardContent style={{ padding: 0 }}>
            <List style={{ minWidth: 180 }}>
              <ListItem>
                <Avatar className={classes.avatarIcon}>
                  <Update />
                </Avatar>
                <ListItemText primary="날짜" secondary={new Date(content.createdAt).toLocaleDateString('ko-KR', options)} />
              </ListItem>
              <Divider />
              <ListItem>
                <Avatar className={classes.avatarIcon}>
                  <Place />
                </Avatar>
                <ListItemText primary="장소" secondary={content.studyLocation} />
              </ListItem>
              <Divider />
              <ListItem>
                <Avatar className={classes.avatarIcon}>
                  <Category />
                </Avatar>
                <ListItemText primary="분류" secondary={`${content.categories}`} />
              </ListItem>
            </List>
          </CardContent>
          <div id="naverMap" className={classes.naverMap} />
        </Card>
      </div>
    </div>
  );
};

DetailContentsView.propTypes = {
  classes: propTypes.object.isRequired,
  content: propTypes.object.isRequired,
  participants: propTypes.array.isRequired,
  signInInfo: propTypes.object.isRequired,
  joinStudy: propTypes.func.isRequired,
};

export default withStyles(style)(DetailContentsView);
