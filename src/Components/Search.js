import React, { useState, useEffect }  from 'react';
import {
    Avatar,
    Container,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { serverURL } from '../Redux/actions';

export const Search = (props) => {
    const [searchInput, setSearchInput] = useState('');
    const [users, setUsers] = useState([]);

    
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

    useEffect(() => {
        // disable navbar switch when searching or find better work around
        if(searchInput.length >= 1){
            fetchSearch();
        }
    // eslint-disable-next-line
    }, [searchInput]);

    return (
        <Container maxWidth='sm' >
            <Grid container spacing={3} alignItems='center'>
                <Grid item xs={12}>
                    <TextField fullWidth label='Search' onChange={handleInput} value={searchInput} variant='filled' />
                </Grid>
                {/* pull X random users then a random post from them */}
                {users.map((user, index) => {
                    return(
                    <Grid key={index} container item xs={12} alignItems='center' spacing={3} >
                        <Grid item xs={1}><Avatar src={user.profilePicture ? `${serverURL}/user/profilePicture/${user.profilePicture}` : null} /></Grid>
                        <Grid item xs={6}>
                            <Typography variant='body1' >{user.username}</Typography>
                            <Typography variant='body2' >{user.firstName} {user.lastName}</Typography>
                        </Grid>
                        <Grid  item xs={5}>
                        </Grid>
                    </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}

export default Search
