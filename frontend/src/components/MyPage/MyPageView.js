import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles, Paper, Avatar, Typography, CardContent, Grid, Card, Button, CardMedia, CardActions } from '@material-ui/core';
import classNames from 'classnames';
import { apiUrl } from '../../helpers/apiClient';

const styles = theme => ({
  root: {
    height: 420,
    maxHeight: 420,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  userInformContainer: {
    width: '70%',
    height: '88%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  userInformPaper: {
    width: '92%',
    maxWidth: 980,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avartar: {
    height: 200,
    width: 200,
  },
  userInform: {
    height: '88%',
    width: '60%',
    marginLeft: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  button: {
    width: 100,
    height: 50,
  },
  myStudyContainer: {
    background: 'yellow',
  },
  joinedStudyContainer: {
    background: 'pink',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1016,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: 18,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
});

const MyPageTest = props => {
  const {
    classes,
    myStudy,
    joinedStudy,
    signInInfo: { email: loginedUserEmail, name: loginedUserName, image: loginedUserImg, date: loginedUserDate },
    leaveStudy,
    deleteStudy,
  } = props;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.userInformContainer}>
          <Paper className={classes.userInformPaper} elevation={1}>
            <Avatar className={classes.avartar} alt="User Profile" src={`${apiUrl}/${loginedUserImg}`} />
            <div className={classes.userInform}>
              <Typography variant="h5" className={classes.userData}>
                이메일: {loginedUserEmail}
              </Typography>
              <Typography variant="h5" className={classes.userData}>
                닉네임: {loginedUserName}
              </Typography>
              <Typography variant="h5" className={classes.userData}>
                회원가입일: {new Date(loginedUserDate).toLocaleDateString('ko-KR', options)}
              </Typography>
            </div>
          </Paper>
        </div>
      </div>
      <main>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Typography variant="h6">내가 만든 스터디</Typography>
          <Grid container spacing={40}>
            {myStudy.length === 0 ? (
              <Grid item sm={6} md={4} lg={3}>
                <Typography style={{ width: 240 }}>내가 만든 스터디가 없습니다.</Typography>
              </Grid>
            ) : (
              myStudy.map(study => (
                <Grid item key={study.id} sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <CardMedia className={classes.cardMedia} image={`${apiUrl}/${study.imageUrl}`} title="Image title" />
                    <CardContent className={classes.cardContent}>
                      <Typography style={{ fontSize: 20 }}>{study.title}</Typography>
                    </CardContent>
                    <CardActions>
                      <Link to={`/detail/${study.id}`} style={{ textDecoration: 'none' }}>
                        <Button size="small" color="primary">
                          자세히보기
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          return deleteStudy(study.id);
                        }}
                      >
                        삭제하기
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </div>
      </main>
      <main>
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Typography variant="h6">참여중인 스터디</Typography>
          <Grid container spacing={40}>
            {joinedStudy.length === 0 ? (
              <Grid item sm={6} md={4} lg={3}>
                <Typography style={{ width: 240 }}>참여중인 스터디가 없습니다.</Typography>
              </Grid>
            ) : (
              joinedStudy.map(study => (
                <Grid item key={study.id} sm={6} md={4} lg={3}>
                  <Card className={classes.card}>
                    <CardMedia className={classes.cardMedia} image={`${apiUrl}/${study.imageUrl}`} title="Image title" />
                    <CardContent className={classes.cardContent}>
                      <Typography style={{ fontSize: 20 }}>{study.title}</Typography>
                    </CardContent>
                    <CardActions>
                      <Link to={`/detail/${study.id}`} style={{ textDecoration: 'none' }}>
                        <Button size="small" color="primary">
                          자세히보기
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          return leaveStudy(study.id);
                        }}
                      >
                        탈퇴하기
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </div>
      </main>
    </>
  );
};

MyPageTest.propTypes = {
  classes: PropTypes.object.isRequired,
  myStudy: PropTypes.array.isRequired,
  joinedStudy: PropTypes.array.isRequired,
  leaveStudy: PropTypes.func.isRequired,
  deleteStudy: PropTypes.func.isRequired,
  signInInfo: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyPageTest);
