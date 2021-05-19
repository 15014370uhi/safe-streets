import React from 'react';
import Button from 'react-bootstrap/Button';

const ButtonFilterCrime = props => {
  return (
    <Button     
      className={props.isActive ? 'btn-filter-active' : 'btn-filter-inactive'}
      id={props.id}     
      onClick={() => props.changeFilterState (props.id, props.categories, props.isActive)}              			 
    >
      <i className={props.isActive ? 'fa fas fa-check fa-lg' : 'fa fas fa-times fa-lg'} />
      {props.label}
    </Button>
  );
};

export default ButtonFilterCrime;
