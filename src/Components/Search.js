import React from 'react'
import { connect } from 'react-redux'
import { TextField } from '@material-ui/core';

export const Search = (props) => {
    return (
        <div>
            <TextField label='Search' />
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
