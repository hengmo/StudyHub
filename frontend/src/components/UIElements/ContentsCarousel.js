import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ItemsCarousel from 'react-items-carousel';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  withStyles,
  Avatar,
} from '@material-ui/core';
import { ArrowForward, ArrowBack, } from '@material-ui/icons'
import { apiUrl } from '../../helpers/apiClient';
import { AppContext } from '../../contexts/appContext';

const style = theme => ({
  actionArea: {
    width: '97%',
    padding: 1,
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
    minHeight: 112,
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: 24, 
    wordBreak: 'keep-all',
    color: 'black',
  },
});

class ContentsCarousel extends Component {
  static contextType = AppContext;

  componentWillMount() {
    this.setState({
      activeItemIndex: 0,
    });
  }

  changeActiveItem = (activeItemIndex) => this.setState({ activeItemIndex });

  renderStrWithEllipsis = (str) => {
    let str_temp = str.substring(0, 18)
    if(str.length >= 17)
      str_temp = str_temp + "...";
    return str_temp;
  };
    
  render() {
    const { activeItemIndex, } = this.state;
    const { classes, contents, } = this.props;

    return (
      <ItemsCarousel
        // Carousel configurations
        numberOfCards={4}
        gutter={30}
        showSlither={false}
        firstAndLastGutter={false}
        freeScrolling={false}
        slidesToScroll={4}

        // Active item configurations
        requestToChangeActive={this.changeActiveItem}
        activeItemIndex={activeItemIndex}
        activePosition={'center'}

        chevronWidth={10}
        rightChevron={<Avatar style={{ background: '#90CAF9' }}><ArrowForward /></Avatar>}
        leftChevron={<Avatar style={{ background: '#90CAF9' }}><ArrowBack /></Avatar>}
        outsideChevron={false}
      >
        {contents.filter((content, index) => index < 12).map((content, index) => (
          <CardActionArea className={classes.actionArea} key={content.id}>
            <Card className={classes.card}>
              <Link to={`/detail/${content.id}`} style={{ textDecoration: 'none' }}>
                <CardMedia className={classes.cardMedia} image={`${apiUrl}/${content.imageUrl}`} title={content.title} />
                <CardContent className={classes.cardContent}>
                  <div className={classes.cardTitle}>
                    {this.renderStrWithEllipsis(content.title)}
                  </div>
                </CardContent>
              </Link>
              <Typography style={{ paddingLeft: 16, paddingBottom: 8, }}>
                {content.categories[0]}
              </Typography>
            </Card>
          </CardActionArea>
        ))}
      </ItemsCarousel>
    );  
  }
}

export default withStyles(style)(ContentsCarousel);