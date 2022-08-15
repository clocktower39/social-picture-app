import React, { useState, useEffect }  from 'react';
import { useDispatch, useSelector, } from 'react-redux';
import {
    Avatar,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { requestFollow, requestUnfollow, getMyRelationships, serverURL } from '../Redux/actions';

export const Search = (props) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const relationships = useSelector(state => state.relationships);
    const [searchInput, setSearchInput] = useState('');
    const [users, setUsers] = useState([]);
    const followingIds = relationships.following.map(u => u._id);

    
    const fetchSearch = async () => {
        let payload = JSON.stringify({ username: searchInput});

        let response = await fetch(`${serverURL}/search`, {
            method: 'post',
            dataType: 'json',
            body: payload,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          });

        let data = await response.json();

        setUsers(data.users);
    }

    const handleInput = (e) => {
        setSearchInput(e.target.value);
    }

    const handleRequestFollow = (user) => {
        dispatch(requestFollow(user._id));
    }

    const handleRequestUnfollow = (user) => {
        dispatch(requestUnfollow(user._id));
    }

    useEffect(() => {
        if(searchInput.length >= 1){
            fetchSearch();
        }
    // eslint-disable-next-line
    }, [searchInput]);

    useEffect(() => {
        dispatch(getMyRelationships())
    // eslint-disable-next-line
    }, []);

    return (
        <Container maxWidth='sm' >
            <Grid container spacing={3} alignItems='center'>
                <Grid item xs={12}>
                    <TextField fullWidth label='Search' onChange={handleInput} value={searchInput} variant='filled' />
                </Grid>
                {/* pull X random users then a random post from them */}
                {users.map((account, index) => {
                    return(
                    <Grid key={index} container item xs={12} alignItems='center' spacing={3} >
                        <Grid item xs={1}><Avatar src={account.profilePicture ? `${serverURL}/user/profilePicture/${account.profilePicture}` : null} /></Grid>
                        <Grid item xs={6}>
                            <Typography variant='body1' >{account.username}</Typography>
                            <Typography variant='body2' >{account.firstName} {account.lastName}</Typography>
                        </Grid>
                        <Grid container item xs={5} sx={{justifyContent: 'flex-end'}}>
                            {user._id === account._id ? null : followingIds.includes(account._id) ? 
                            <Button variant="contained" onClick={() => handleRequestFollow(account)}>Follow</Button>
                            : 
                            <Button variant="contained" onClick={() => handleRequestUnfollow(account)}>Unfollow</Button>
                            }
                            
                        </Grid>
                    </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}

export default Search
