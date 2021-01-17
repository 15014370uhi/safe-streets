// TODO https://material-ui.com/components/text-fields/

import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const SearchForm = () => {     
    
  
    return (     
      <section className="login">
        I am a search form     
       <form className="searchForm" noValidate autoComplete="off">       
        <TextField id="filled-basic" label="Filled" variant="filled" />   
      </form>
      </section>
    );
  
    };

    export default SearchForm;