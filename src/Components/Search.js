import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux'
import {
    Button,
    CardMedia,
    Container,
    Grid,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';

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
    const classes = useStyles();
    const [opacity, setOpacity] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(()=>{
        if(opacity<1){
            setOpacity(opacity+0.05);
        }
        // eslint-disable-next-line
    },[opacity]);

    const fetchSearch = () => {
        let payload = JSON.stringify({ username: searchInput});

        fetch('http://mattkearns.ddns.net:3000/search', {
            method: 'post',
            dataType: 'json',
            body: payload,
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
          })
          .then(res => res.json())
          .then(data => {
              setUsers(data.users);
          });
    }

    const handleInput = (e) => {
        setSearchInput(e.target.value);
    }
    
    return (
        <Container maxWidth='sm' className={classes.root} style={{opacity}}>
            <Grid container spacing='3' alignItems='center'>
                <Grid item xs={10}>
                    <TextField fullWidth label='Search' onChange={handleInput} value={searchInput} />
                </Grid>
                <Grid item xs={2}>
                    <Button variant='contained' color='primary' fullWidth onClick={fetchSearch} >Search</Button>
                </Grid>
                {/* pull X random users then a random post from them */}
                {users.map((user, index) => {
                    return(
                    <Grid container item xs={12} alignItems='center' spacing='3' >
                        <Grid item xs={2}><CardMedia className={classes.profilePic} image={user.profilePic} /></Grid>
                        <Grid item xs={7}>
                            <Typography variant='body1' >{user.username}</Typography>
                            <Typography variant='body2' >{user.firstName} {user.lastName}</Typography>
                        </Grid>
                        <Grid  item xs={3}>
                            <Button variant='outlined'>Follow</Button>
                        </Grid>
                    </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
