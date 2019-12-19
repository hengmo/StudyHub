import React, { Component } from 'react';
import { AppContext } from '../../contexts/appContext';
import queryString from 'query-string';
import {
  withStyles,
  Paper,
  TextField,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormGroup,
  FormControlLabel,
  InputLabel,
} from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import RequestButton from '../UIElements/RequestButton';
import studyBackgroundImg from '../../images/study-background.jpg';
/* global naver */

const styles = theme => ({
  root: {
    backgroundColor: '#F7F7F7',
  },
  topImg: {
    width: '100%',
    maxHeight: 360,
    position: 'relative',
  },
  topTitleContainer: {
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    marginTop: -160,
  },
  topTitle: {
    color: 'white',
    fontWeight: 600,
    marginBottom: 12,
  },
  mainContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  paperContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '63%',
    maxWidth: 960,
    height: '100%',
    marginTop: 70,
    marginBottom: 70,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    marginTop: 50,
  },
  inputText: {
    color: 'black',
    margin: theme.spacing.unit,
    fontSize: 23,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%',
  },
  categoryGroup: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  naverMap: {
    width: '100%',
    height: 550,
    maxHeight: 550,
    marginBottom: 10,
  },
  addressSelection: {
    margin: theme.spacing.unit,
    width: '95%',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    fontSize: 20,
    margin: 40,
  },
});

class ContentsWritePage extends Component {
  static contextType = AppContext;

  state = {
    title: '',
    categories: ['영어', '일본어', '중국어', '회화', '취업준비', '면접', '자기소개서', '프로젝트', '코딩 테스트', '전공', '인적성&NCS'],
    selectedCategories: [],
    description: '',
    addresses: [],
    selectedLocation: '',
    buttonLoading: false,
  };

  categoryHandler = e => {
    const selectedCategories = this.state.selectedCategories;
    const inputValue = e.target.value;
    this.setState(() => {
      for (const [index, element] of selectedCategories.entries()) {
        if (element === inputValue) {
          selectedCategories.splice(index, 1);
          return {
            selectedCategories: [...selectedCategories],
          };
        }
      }
      return {
        selectedCategories: [...selectedCategories, inputValue],
      };
    });
  };

  //확인 버튼 클릭시 formData 초기화 후 context addContents에 formData 전달하여 호출
  addContents = async () => {
    const { title, selectedCategories: categories, description, selectedLocation: studyLocation } = this.state;
    const coverImg = document.getElementById('coverImg').files[0];

    if (title === '' || categories === '' || description === '' || studyLocation === '') {
      return this.context.actions.snackbarOpenHandler('스터디 정보를 모두 작성 해주세요.', 'warning');
    } else if (categories.length === 0) {
      return this.context.actions.snackbarOpenHandler('스터디 목적을 1개 이상 선택해주세요.', 'warning');
    } else if (coverImg && coverImg.type !== 'image/png' && coverImg.type !== 'image/jpeg' && coverImg.type !== 'image/bmp') {
      return this.context.actions.snackbarOpenHandler('이미지 파일 형식이 아닙니다.', 'warning');
    }

    this.setState({
      buttonLoading: true,
    });

    const dataInObject = {
      title,
      categories,
      description,
      studyLocation,
      coverImg,
    };

    const formData = new FormData();
    Object.keys(dataInObject).map(key => {
      return formData.append(key, dataInObject[key]);
    });

    await this.context.actions.addContents(formData);
    this.props.history.push('/');
  };

  async componentDidMount() {
    const currentPosition = queryString.parse(this.props.location.search);
    const currentLatLng = new naver.maps.LatLng(currentPosition.lat, currentPosition.lng);

    this.setState({
      addresses: await this.context.actions.getAddressesByLatLng(currentLatLng),
    });

    const map = new naver.maps.Map('naverMap', {
      center: currentLatLng,
      zoom: 10,
    });
    const marker = new naver.maps.Marker({
      position: currentLatLng,
      map: map,
    });
    naver.maps.Event.addListener(map, 'click', async e => {
      marker.setPosition(e.latlng);
      this.setState({
        addresses: await this.context.actions.getAddressesByLatLng(e.latlng),
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { categories, selectedLocation, addresses, buttonLoading } = this.state;
    return (
      <div className={classes.root}>
        <img className={classes.topImg} src={studyBackgroundImg} alt="" />
        <div className={classes.topTitleContainer}>
          <Typography className={classes.topTitle} variant="h4">
            새로운 스터디 시작하기
          </Typography>
          <Typography className={classes.topTitle} variant="h6">
            원하는 주제의 스터디를 만들어 보세요.
          </Typography>
        </div>
        <div className={classes.mainContainer}>
          <Paper className={classes.paperContainer} elevation={12}>
            <div className={classes.inputContainer}>
              <Typography className={classes.inputText}>스터디 이름</Typography>
              <TextField
                className={classes.textField}
                onChange={e => {
                  this.setState({ title: e.target.value });
                }}
                placeholder="스터디의 이름을 입력해 주세요."
                margin="normal"
                variant="outlined"
              />
            </div>
            <div className={classes.inputContainer}>
              <Typography className={classes.inputText} component={'span'}>
                스터디 목적<Typography style={{ fontSize: 16 }}>(복수 선택 가능)</Typography>
              </Typography>

              <FormGroup row className={classes.categoryGroup}>
                {categories.map(category => {
                  return (
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<FavoriteBorder />}
                          checkedIcon={<Favorite />}
                          color="primary"
                          value={category}
                          key={category}
                          onChange={this.categoryHandler}
                        />
                      }
                      label={category}
                      key={category}
                    />
                  );
                })}
              </FormGroup>
            </div>
            <div className={classes.inputContainer}>
              <Typography className={classes.inputText}>스터디 장소</Typography>
              <div id="naverMap" className={classes.naverMap} />
              <FormControl variant="outlined" className={classes.addressSelection}>
                <InputLabel htmlFor="address-select">주소선택</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={e => {
                    this.setState({ selectedLocation: e.target.value });
                  }}
                  input={<OutlinedInput name="address" id="address-select" labelWidth={0} />}
                >
                  {addresses.map((address, index) => {
                    return (
                      <MenuItem value={address} key={address}>
                        {address}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className={classes.inputContainer}>
              <Typography className={classes.inputText}>상세 내용 입력</Typography>
              <TextField
                className={classes.textField}
                multiline
                rows="12"
                margin="normal"
                variant="outlined"
                placeholder="스터디의 설명/모임 시간 등을 자유롭게 입력 해주세요."
                onChange={e => {
                  this.setState({ description: e.target.value });
                }}
              />
            </div>
            <div className={classes.inputContainer}>
              <Typography className={classes.inputText}>스터디 커버 이미지</Typography>
              <input type="file" id="coverImg" multiple />
              <Typography style={{ fontSize: 14 }}>(미 선택시 기본 이미지 적용)</Typography>
            </div>
            <div className={classes.buttonContainer}>
              <RequestButton value="스터디 작성" buttonLoading={buttonLoading} clickHandler={this.addContents} />
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(ContentsWritePage);
