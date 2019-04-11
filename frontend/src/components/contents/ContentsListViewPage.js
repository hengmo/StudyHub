import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, Button, Card, CardActions, CardContent, CardMedia, Grid, Typography, } from '@material-ui/core';
import { apiUrl } from '../../helpers/apiClient';

const styles = theme => ({
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
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
});

const ContentsListViewPage = props => {
  const { classes, contents } = props;
  return (
    <main>
      <div className={classNames(classes.layout, classes.cardGrid)}>
        <Grid container spacing={40}>
          {contents.map(content => (
            <Grid item key={content.title} sm={6} md={4} lg={3}>
              <Card className={classes.card}>
                <CardMedia className={classes.cardMedia} image={`${apiUrl}/${content.imageUrl}`} title="Image title" />
                <CardContent className={classes.cardContent}>
                  <Typography variant="h5" component="h2">
                    {content.title}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link to={`/detail/${content.id}`} style={{ textDecoration: 'none', }}>
                    <Button
                      size="small"
                      color="primary"
                    >
                      자세히보기
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  );
}

ContentsListViewPage.propTypes = {
  classes: PropTypes.object.isRequired,
  contents: PropTypes.array.isRequired,
};

export default withStyles(styles)(ContentsListViewPage);
