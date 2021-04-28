import React, { useState, useEffect }  from 'react';
import { useDispatch, connect } from 'react-redux'
import {
    Button,
    CardMedia,
    Container,
    Grid,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';
import { updateFollowing } from '../Redux/actions';

const useStyles = makeStyles({
    root: {
    },
    profilePic: {
        height: 0,
        paddingTop: '100%',
        borderRadius: '50%',
      },
});

export const Search = (props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [searchInput, setSearchInput] = useState('');
    const [users, setUsers] = useState([]);

    
    const fetchSearch = async () => {
        let payload = JSON.stringify({ username: searchInput});

        let resposne = await fetch('http://mattkearns.ddns.net:3000/search', {
            method: 'post',
            dataType: 'json',
            body: payload,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          });

        let data = await resposne.json();

        setUsers(data.users);
    }



    const handleInput = (e) => {
        setSearchInput(e.target.value);
    }

    const handleFollowUpdate = (e, username) => {
        let newFollowList;
        switch(e){
            case 'Unfollow':
                newFollowList = props.user.following.filter(user => user !== username);
                break;
            case 'Follow':
                newFollowList = props.user.following.slice()
                newFollowList.push(username);
                break;
            default:
                break;
        }
        dispatch(updateFollowing(props.user.username, newFollowList));
    }

    useEffect(() => {
        // disable navbar switch when searching or find better work around
        if(searchInput.length >= 1){
            fetchSearch();
        }
    // eslint-disable-next-line
    }, [searchInput]);

    return (
        <Container maxWidth='sm' className={classes.root} >
            <Grid container spacing={3} alignItems='center'>
                <Grid item xs={12}>
                    <TextField fullWidth label='Search' onChange={handleInput} value={searchInput} variant='filled' />
                </Grid>
                {/* pull X random users then a random post from them */}
                {users.map((user, index) => {
                    return(
                    <Grid key={index} container item xs={12} alignItems='center' spacing={3} >
                        <Grid item xs={2}><CardMedia className={classes.profilePic} image={user.profilePic} /></Grid>
                        <Grid item xs={6}>
                            <Typography variant='body1' >{user.username}</Typography>
                            <Typography variant='body2' >{user.firstName} {user.lastName}</Typography>
                        </Grid>
                        <Grid  item xs={4}>
                            {
                            (props.user.username === user.username)
                            ?null
                            :
                            <>
                                {
                                (props.user.following.includes(user.username))
                                ?<Button onClick={()=>handleFollowUpdate('Unfollow', user.username)} variant='contained' color='primary' fullWidth>Unfollow</Button>
                                :<Button onClick={()=>handleFollowUpdate('Follow', user.username)} variant='outlined' color='primary' fullWidth>Follow</Button>
                                }
                            </>
                            }
                        </Grid>
                    </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
    posts: state.posts,
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
