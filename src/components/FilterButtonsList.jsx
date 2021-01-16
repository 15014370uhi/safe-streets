import React, {useContext,  useState} from 'react';
//import ButtonGroup from '@material-ui/core/ButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
//import FilterButton from './FilterButton';
import {FiltersContext} from '../context/FiltersContext';
import uuid from 'react-uuid';
import '../App.css';


// Implement material-ui styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));


// TODO - filters buttons need an Apply/submit button to apply filters
// TODO - iterate over map of filter types and assign to each FilterButton and use UUID import for keys


const FilterButtonsList = () => {
  
  // Set state
  //const [count, setCount] = useState(0);
  //Update the state 
  //<button onClick={() => setCount(count + 1)}></button>


	// Set the context as FiltersContext
  const [filters, setFilters] = useContext (FiltersContext);  

  //const changeFilterState = (name) => {
   // setFilters((state) => {
   //   state.
   //   this.setState(state => {
    //    state.nested.flag = false       
   //     return state
  //    })

      // Important: read `state` instead of `this.state` when updating.
   //   return {count: state.count + 1}
 //   });
    
    //setFilters(filters.);  // Maybe use map? https://stackoverflow.com/questions/62826900/modifying-object-inside-array-with-usecontext
 // }////

  

  // TODO - need to pass down setFilters?
  // TODO should check here for active? or setFilters from the button? ..<<<<<
  // TODO https://stackoverflow.com/questions/57888975/how-to-update-react-context-provider-state-on-button-click




// State for material-ui button styling
  const [formats, setFormats] = React.useState(() => ['']);

  const handleFormat = (event, activeFilters) => {

    //TEST
    //console.log("Active Filters:"  + activeFilters);

    for(const aFilter of activeFilters) {
      if(aFilter === "Show All"){
        console.log("Show All is Active!");
      }
    }
    // Apply button formatting
    setFormats(activeFilters);  
    
    // Update filter buttons context
    
  };



  const classes = useStyles();

  return (
    <div className={classes.root}>  
    <ToggleButtonGroup value={formats} onChange={handleFormat} aria-label="text formatting" > 
      
      {filters.map (filter => (
        <ToggleButton value={filter.name} aria-label={filter.name} key={uuid()}>   
        {filter.name}     
      </ToggleButton>
      ))}
      <ToggleButton value="Show All" aria-label="Show All" key={uuid()}>   
            Show All
      </ToggleButton>
      </ToggleButtonGroup>
        
    </div>
  );
}

export default FilterButtonsList;