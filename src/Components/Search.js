import React, { useState, useEffect }  from 'react';
import { connect } from 'react-redux'
import { Button, Typography, Container, Grid, TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
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
        <Container disableGutters maxWidth='sm' className={classes.root} style={{opacity}}>
            <Grid container>
                <Grid item xs={10}>
                    <TextField fullWidth label='Search' onChange={handleInput} value={searchInput} />
                </Grid>
                <Grid item xs={2}>
                    <Button variant='contained' color='primary' fullWidth onClick={fetchSearch} >Search</Button>
                </Grid>
                {/* pull X random users then a random post from them */}
                {users.map((user, index) => {
                    return(
                    <Grid item xs={12}>
                        <Typography>{user.username}</Typography>
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
