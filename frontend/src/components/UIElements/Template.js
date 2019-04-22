import React, { Component, Fragment } from 'react';
import movie from '../../images/main-video.mp4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { AppContext } from '../../contexts/appContext';
import { Link } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import ReactDOM from 'react-dom';
import { apiUrl } from '../../helpers/apiClient';
import './Template.css';
/* global naver */

const styles = theme => ({
  default: {
    color: '#90CAF9',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  textButtonContainer: {
    position: 'relative',
    width: '100%',
    height: 340,
    maxHeight: 340,
    marginTop: -730,
    zIndex: 10,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  mainContainer: {
    width: '100%',
    background: '#FFFFFF',
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    width: '90%',
    height: '100%',
    paddingTop: '56.25%',
  },
  cardContent: {
    flexGrow: 1,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
});
class Template extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      contents: [],
      contentsByDistance: [],
      contentsLatest: [],
      contentsByViews: [],
      searchTerm: '',
      values: 0,
      labelWidth: 0,
    };

    this.buttonClicked = this.buttonClicked.bind(this);
  }

  buttonClicked(e) {
    this.setState({ values: this.state.values + 1 });
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.values === nextState.values || this.state.searchTerm === nextState.searchTerm;
  }

  async componentDidMount() {
    const { lat, lng } = this.context.state;
    const currentLatLng = new naver.maps.LatLng(lat, lng);
    const addresses = await this.getAddressesByLatLng(currentLatLng);
    const currentAddress = addresses[0].split(' ').slice(0, 2).join(' ');
    
    const contents = await this.context.actions.getContentsList();
    const contentsByDistance = contents.filter(content => content.studyLocation.split(' ').slice(0, 2).join(' ') === currentAddress);
    
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      contentsLatest: await this.context.actions.getContentsLatest(), // 최신순
      contentsByDistance: contentsByDistance, //거리순
      contentsByViews: await this.context.actions.getContentsByViews(), // 조회순
    });
  };

  getAddressesByLatLng = latlng => {
    const tm128 = naver.maps.TransCoord.fromLatLngToTM128(latlng);

    return new Promise((resolve, reject) => {
      naver.maps.Service.reverseGeocode(
        {
          location: tm128,
          coordType: naver.maps.Service.CoordType.TM128,
        },
        (status, response) => {
          if (status === naver.maps.Service.Status.ERROR) {
            return reject(alert('지도 API 오류입니다.'));
          }

          const { items } = response.result;
          const addresses = [];

          for (let i = 0, ii = items.length, item; i < ii; i++) {
            item = items[i];
            addresses.push(item.address);
          }
          return resolve(addresses);
        },
      );
    });
  };

  handleChange = event => {
    this.setState(
      {
        [event.target.name]: event.target.value,
        searchTerm: event.target.value,
      },
      () => {
        console.log(this.state.searchTerm);
      },
    );
  };
  openSnackbar = () => {
    const {
      signInInfo: { status: loginStatus },
    } = this.context.state;
    if (!loginStatus) this.context.actions.snackbarOpenHandler('먼저 회원등록을 해주세요.', 'warning');
  };

  render() {
    const { contentsLatest, contentsByDistance, contentsByViews, } = this.state;
    const { lat, lng } = this.context.state;
    const { classes } = this.props;

    return (
      <Fragment>
        <div className={classes.heroUnit} style={{ textAlign: 'center' }}>
          <div className={classes.heroContent}>
            <video loop autoPlay={true} style={{ width: '100%', zIndex: 0 }}>
              <source type="video/mp4" data-reactid=".0.1.0.0.0" src={movie} />
            </video>
            <div className={classes.textButtonContainer}>
              <Typography variant="h4" style={{ color: 'white', fontWeight: 600 }}>
                함께 하는 스터디의 동기부여
              </Typography>
              <Typography variant="h6" style={{ color: 'white' }}>
                손 쉽게 스터디그룹을 모집하거나 참여할 수 있습니다.
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <div className="textDecoration">
                      <Link to={`/write?lat=${lat}&lng=${lng}`}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            fontSize: '2.5vh',
                            textDecoration: 'none',
                            width: '260px',
                          }}
                          onClick={this.openSnackbar}
                        >
                          스터디 시작하기
                        </Button>
                      </Link>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.mainContainer}>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <FormControl style={{ width: '25vh' }} variant="outlined" className={classes.formControl}>
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
                htmlFor="outlined-age-simple"
              >
                Category
              </InputLabel>
              <Select
                value={this.state.searchTerm}
                onChange={this.handleChange}
                input={<OutlinedInput labelWidth={this.state.labelWidth} name="category" id="outlined-age-simple" />}
              >
                <MenuItem value={'영어'}>영어</MenuItem>
                <MenuItem value={'일본어'}>일본어</MenuItem>
                <MenuItem value={'중국어'}>중국어</MenuItem>
                <MenuItem value={'회화'}>회화</MenuItem>
                <MenuItem value={'취업준비'}>취업준비</MenuItem>
                <MenuItem value={'면접'}>면접</MenuItem>
                <MenuItem value={'자기소개서'}>자기소개서</MenuItem>
                <MenuItem value={'프로젝트'}>프로젝트</MenuItem>
                <MenuItem value={'코딩 테스트'}>코딩 테스트</MenuItem>
                <MenuItem value={'전공'}>전공</MenuItem>
                <MenuItem value={'인적성&NCS'}>인적성&NCS</MenuItem>
              </Select>
            </FormControl>

            <Link style={{ textDecoration: 'none' }} to={`/category/` + this.state.searchTerm}>
              <Button style={{ height: '4.7vh' }} variant="contained" color="primary" className={classes.button}>
                검색
              </Button>
            </Link>
            <div>
              <div style={{ textAlign: 'right', marginBottom: '3vh' }}>모집중!!</div>
              <Grid container spacing={40}>
                {contentsLatest.map((board, index) => (
                  <Grid item key={index} sm={6} md={3} lg={3}>
                    <div className="mediaQuery">
                      <Card className={classes.card} style={{ minHeight: '38vh' }}>
                        <div key={index} />
                        <Button
                          style={{ width: '100%', height: '20vh' }}
                          className=""
                          onClick={() => {
                            let path = `detail/` + board.id;
                            this.props.history.push(path);
                          }}
                        >
                          <CardMedia className={classes.cardMedia} image={`${apiUrl}/${board.imageUrl}`} alt="cover img" />
                        </Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            <div style={{ marginBottom: '3vh' }}>{board.title}</div>
                          </Typography>
                          <Typography>{board.categories + ''}</Typography>
                        </CardContent>
                        <CardActions />
                      </Card>
                    </div>
                  </Grid>
                ))}
              </Grid>

              <div style={{ textAlign: 'right', margin: '3vh 0 3vh 0 ' }}>거리순</div>
              {contentsByDistance.length === 0 && <div style={{ textAlign: 'right', margin: '2vh 0 6vh 0 ' }}>가까운 거리의 스터디가 없습니다.</div>}
              <Grid container spacing={40}>
                {contentsByDistance.map((board, index) => (
                  <Grid item key={index} sm={6} md={3} lg={3}>
                    <div className="mediaQuery">
                      <Card className={classes.card} style={{ minHeight: '38vh' }}>
                        <div key={index} />
                        <Button
                          style={{ width: '100%', height: '20vh' }}
                          className=""
                          onClick={() => {
                            let path = `detail/` + board.id;
                            this.props.history.push(path);
                          }}
                        >
                          <CardMedia className={classes.cardMedia} image={`${apiUrl}/${board.imageUrl}`} alt="cover img" />
                        </Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            <div style={{ marginBottom: '3vh' }}>{board.title}</div>
                          </Typography>
                          <Typography>{board.categories + ''}</Typography>
                        </CardContent>
                        <CardActions />
                      </Card>
                    </div>
                  </Grid>
                ))}
              </Grid>

              <div style={{ textAlign: 'right', margin: '3vh 0 3vh 0 ' }}>조회순</div>
              <Grid container spacing={40}>
                {contentsByViews.map((board, index) => (
                  <Grid item key={index} sm={6} md={3} lg={3}>
                    <div className="mediaQuery">
                      <Card className={classes.card} style={{ minHeight: '38vh' }}>
                        <div key={index} />
                        <Button
                          style={{ width: '100%', height: '20vh' }}
                          className=""
                          onClick={() => {
                            let path = `detail/` + board.id;
                            this.props.history.push(path);
                          }}
                        >
                          <CardMedia className={classes.cardMedia} image={`${apiUrl}/${board.imageUrl}`} alt="cover img" />
                        </Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                            <div style={{ marginBottom: '3vh' }}>{board.title}</div>
                          </Typography>
                          <Typography>{board.categories + ''}</Typography>
                        </CardContent>
                        <CardActions />
                      </Card>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
Template.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Template);
