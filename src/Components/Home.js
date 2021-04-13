import React from 'react';
import { connect } from 'react-redux';
import { GridList, GridListTile, GridListTileBar, Typography, makeStyles } from '@material-ui/core';
import { posts } from '../Redux/states';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    postList: {
        maxWidth: '700px',
    },
    postListImgContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    postImg: {
        width:'414px',
        height: '518px',
    },
})
export const Home = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root} >
            <Typography variant={'h3'}>Social Photo App</Typography>
            <GridList cols={1} cellHeight='auto'>
                {posts.map((post, index) => {
                    return (
                        <GridListTile className={classes.postListImgContainer}>
                            <img className={classes.postImg} src={post.imgSrc} alt={index}/>
                            <GridListTileBar title={post.user} />
                        </GridListTile>
                    )
                })}
            </GridList>
        </div>
    )
}

const mapStateToProps = (state) => ({
    posts: state.posts,
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
