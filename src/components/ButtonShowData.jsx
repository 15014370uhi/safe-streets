import React from 'react';
import Button from 'react-bootstrap/Button';

const ButtonShowData = ({setShowDataModal}) => {  
  return (
    <Button
      className="btn-display-data"
      variant="success"
      title="Show data"
      onClick={() => setShowDataModal (true)}
    >
      <i className="fa fa-minus fa-lg mx-4" />
    </Button>
  );
};


export default ButtonShowData;
