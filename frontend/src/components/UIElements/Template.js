import React, {Component, Fragment} from 'react';
import movie from '../../images/movie.mp4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import Icon from '@material-ui/core/Icon';
import { AppContext } from '../../contexts/appContext';
import { Link } from 'react-router-dom';


const styles = theme => (
    
  {
      default : {
        color : '#90CAF9',
      },
      appBar: {
        position: 'relative',
      },
      icon: {
        marginRight: theme.spacing.unit * 2,
      },
      heroUnit: {
        backgroundColor: theme.palette.background.paper,
      },
      heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
      },
      heroButtons: {
        marginTop: theme.spacing.unit * 4,
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
        paddingTop: '56.25%',
      },
      cardContent: {
        flexGrow: 1,
      },
      footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing.unit * 6,
      },
    
    });
class Template extends Component {
    static contextType = AppContext;
    
    constructor(props) {
      super(props);
      
      this.state = {
        users: [],
        contentsRepresentation1: [],
        contentsRepresentation2: [],
        contentsNew: [],
        contentsAttention1: [],
        contentsAttention2: [],
        searchTerm: '',
        value: 0
      }
      
      this.searchUpdated = this.searchUpdated.bind(this);
      this.buttonClicked = this.buttonClicked.bind(this);
    }
  
    buttonClicked(e) {
      this.setState({value: this.state.value+1});
    }
    shouldComponentUpdate(nextProps, nextState) {
      return this.state.value === nextState.value || this.state.searchTerm === nextState.searchTerm;
    }
    
    async componentDidMount() {  
      this.context.actions.checkAuth();
  
      this.context.actions.getCurrentPosition();
    
      this.setState({
        contentsRepresentation1: await this.context.actions.getContentsRepresentation1(), // 대표 1
        contentsRepresentation2: await this.context.actions.getContentsRepresentation2(), // 대표 2
        
        // Login
        contentsNew: await this.context.actions.getContentsNew(), // 최신순
        contentsAttention1: await this.context.actions.getContentsAttention1(), // 관심 1
        contentsAttention2: await this.context.actions.getContentsAttention2(), // 관심 2
      });

    };
  
    searchUpdated (term) {
      // if(term === ''){
      //   this.setState({searchTerm : 'ForExample'})
      // }
      // else {
      //   this.setState({searchTerm : term})
      // }
      this.setState({
        searchTerm: term
      });
    };
    
    
    render() {
      const { lat, lng } = this.context.state;
      const { classes } = this.props;
      return (
        <Fragment>
          <div className={classes.heroUnit} style={{textAlign:"center"}}>
            <div className={classes.heroContent} >
                  <video loop autoPlay={true} style={{width:"100%"}}>
                      <source type="video/mp4" data-reactid=".0.1.0.0.0" src={movie} />
                  </video>
              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <Link to={`/write?lat=${lat}&lng=${lng}`}><Button variant="contained" color="primary" style={{ fontSize: "1.5vh", backgroundColor : "#cc66ff", color : "white"}}>스터디 시작하기</Button></Link>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>


          <div className={classNames(classes.layout, classes.cardGrid)}>
              <TextField
                onChange={this.searchUpdated}
                style={{marginBottom:"3vh", width:"20vh"}}
                id="outlined-search"
                placeholder="Search Category"
                type="search"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
              <Link to={`/category/`+this.state.searchTerm+`/`}>
                 <span 
                    style={{position:"relative", right:"2vh", top:"2.7vh", color : "black"}}
                    className="glyphicon glyphicon-search" aria-hidden="true" ></span>
              </Link>


          {this.context.state.signInInfo.status === null ? <Button style={{width:'100px'}}> </Button> : this.context.state.signInInfo.status === false ?
                (
                
                  <div>
                  <div style={{textAlign: "right", marginBottom : "3vh"}}>대표 카테고리 Ⅰ</div>
                  <Grid container spacing={40}>
                    {this.state.contentsRepresentation1.map((board, index) => (
                      <Grid item key={index} sm={6} md={3} lg={3}>
                        <Card className={classes.card}>
                        <div key={index}></div>
                          <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                        let path = `detail/`+board.id;
                                        this.props.history.push(path);
      
                                      }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>''
                          <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                            <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                            </Typography>
                            <Typography>
                            {board.category}
                            </Typography> 
                          </CardContent>
                          <CardActions>
                          
                          </CardActions>
                        </Card>
                      </Grid>
                    
                    ))}
                    </Grid>
                    
                    <div style={{textAlign: "right", margin : "3vh 0 3vh 0 "}}>대표 카테고리 Ⅱ</div>
                    <Grid container spacing={40}>
                    {this.state.contentsRepresentation2.map((board, index) => (
                      <Grid item key={index} sm={6} md={3} lg={3}>
                        <Card className={classes.card}>
                        <div key={index}></div>
                          <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                        let path = `detail/`+board.id;
                                        this.props.history.push(path);
      
                                      }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                          <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                            <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                            </Typography>
                            <Typography>
                            {board.category}
                            </Typography> 
                          </CardContent>
                          <CardActions>
                          
                          </CardActions>
                        </Card>
                      </Grid>
                    
                    ))}
                    </Grid>
                </div>
                )
                

// login -------------------------------------------------------------------------------------------------------------------------------------------------

                : (
                
                <div>
                <div style={{textAlign: "right", marginBottom : "3vh"}}>모집중!!</div>
                <Grid container spacing={40}>
                  {this.state.contentsNew.map((board, index) => (
                    <Grid item key={index} sm={6} md={3} lg={3}>
                      <Card className={classes.card}>
                      <div key={index}></div>
                        <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                      let path = `detail/`+board.id;
                                      this.props.history.push(path);
    
                                    }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                          <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                          </Typography>
                          <Typography>
                          {board.category}
                          </Typography> 
                        </CardContent>
                        <CardActions>
                        
                        </CardActions>
                      </Card>
                    </Grid>
                  
                  ))}
                  </Grid>
                  
                  <div style={{textAlign: "right", margin : "3vh 0 3vh 0 "}}>관심 카테고리 Ⅰ</div>
                  <Grid container spacing={40}>
                  {this.state.contentsAttention1.map((board, index) => (
                    <Grid item key={index} sm={6} md={3} lg={3}>
                      <Card className={classes.card}>
                      <div key={index}></div>
                        <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                      let path = `detail/`+board.id;
                                      this.props.history.push(path);
    
                                    }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                          <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                          </Typography>
                          <Typography>
                          {board.category}
                          </Typography> 
                        </CardContent>
                        <CardActions>
                        
                        </CardActions>
                      </Card>
                    </Grid>
                  
                  ))}
                  </Grid>

                  <div style={{textAlign: "right", margin : "3vh 0 3vh 0 "}}>관심 카테고리 Ⅱ</div>
                  <Grid container spacing={40}>
                  {this.state.contentsAttention2.map((board, index) => (
                    <Grid item key={index} sm={6} md={3} lg={3}>
                      <Card className={classes.card}>
                      <div key={index}></div>
                        <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                      let path = `detail/`+board.id;
                                      this.props.history.push(path);
    
                                    }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                          <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                          </Typography>
                          <Typography>
                          {board.category}
                          </Typography> 
                        </CardContent>
                        <CardActions>
                        
                        </CardActions>
                      </Card>
                    </Grid>
                  
                  ))}
                  </Grid>
              </div>
                )}
          </div>
      </Fragment>
      );
  }
};
Template.propTypes = {
      classes: PropTypes.object.isRequired,
    };
export default withStyles(styles)(Template);
  