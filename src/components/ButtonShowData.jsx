import React from 'react';
import Button from 'react-bootstrap/Button';

const ButtonShowData = ({setShowDataModal}) => {  
  return (
    <Button
      className="btn-display-data"
      variant="danger"
      title="Show data"
      onClick={() => setShowDataModal (true)}
    >
      <i 
      className="fa fa-chart-line fa-lg mx-4" 
      title="View Crime Data" />
      <span 
      className="tooltip-text">
        Crime Data
      </span>
    </Button>
  );
};


export default ButtonShowData;
