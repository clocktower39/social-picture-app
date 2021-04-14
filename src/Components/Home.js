import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux';
import { GridList, GridListTile, GridListTileBar, Typography, makeStyles } from '@material-ui/core';
import { posts } from '../Redux/states';
import { FavoriteBorder, ModeComment, Send } from '@material-ui/icons';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    postList: {
        paddingBottom: '65px',
    },
    postListImgContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    postImg: {
        width:'414px',
        height: '518px',
        padding: '48px 0px 44px 0px',
    },
    titleBar: {
        backgroundColor: 'white',
    },
    title:{
        color: 'black',
    },
})
export const Home = (props) => {
    const classes = useStyles();
    const [opacity, setOpacity] = useState(0);

    useEffect(()=>{
        setOpacity(opacity+0.01)
        // eslint-disable-next-line
    },[opacity]);
    return (
      <div className={classes.root} style={{opacity}}>
        <Typography variant={"h4"}>Social Photo App</Typography>
        <GridList cols={1} cellHeight="auto" className={classes.postList}>
          {posts.map((post, index) => {
            return (
              <GridListTile className={classes.postListImgContainer}>
                <img
                  className={classes.postImg}
                  src={post.imgSrc}
                  alt={index}
                />
                <GridListTileBar
                  classes={{
                    root: classes.titleBar,
                    title: classes.title,
                    subtitle: classes.title,
                  }}
                  title={
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <img style={{borderRadius: '50%', height: '50px', padding: '5px 5px 5px 0',}} src={post.user.profilePicSrc} alt="profile pic"/>
                        <div>
                            <Typography variant="h6">{post.user.username}</Typography>
                            <Typography variant="caption">{post.location}</Typography>
                        </div>
                    </div>
                    }
                  titlePosition="top"
                />
                <GridListTileBar
                  classes={{
                    root: classes.titleBar,
                    title: classes.title,
                  }}
                  title={
                    <>
                      <FavoriteBorder /> <ModeComment /> <Send />
                    </>
                  }
                  titlePosition="bottom"
                />
              </GridListTile>
            );
          })}
        </GridList>
      </div>
    );
}

const mapStateToProps = (state) => ({
    posts: state.posts,
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
