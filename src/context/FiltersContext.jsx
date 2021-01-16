import React, {useState, createContext} from 'react';

// Components to import the FiltersContext to access the FiltersProvider data below
export const FiltersContext = createContext ();

//TODO https://reactjs.org/docs/context.html#updating-context-from-a-nested-component

// HAVE button filters have name - and then just say theft :  true
// Provider - providing the data
export const FiltersProvider = props => {
  const [filters, setFilters] = useState ([
    {
      name: 'Theft',
      displayCrimes: true
    },
    {
      name: 'Burglary',
      displayCrimes: true
    },
    {
      name: 'Drugs',
      displayCrimes: true
    },
    {
      name: 'Weapons',
      displayCrimes: true
    },
    {
      name: 'Anti-Social',
      displayCrimes: true
    },
    {
      name: 'Robbery',
      displayCrimes: true
    },
    {
      name: 'Vehicle Crime',
      displayCrimes: true
    },
    {
      name: 'Violent Offences',
      displayCrimes: true
    },
    {
      name: 'Public Order',
      displayCrimes: true
    }
  ]);

  return (
    <FiltersContext.Provider value={[filters, setFilters]}>
      {props.children}
    </FiltersContext.Provider>
  );
};
