const ChartLabel = ({x, y, color, value}) => {    
    console.log('ChartLabel args: ' 
    + JSON.stringify(x) + ', ' 
    + JSON.stringify(y) 
    + ', ' + JSON.stringify(color) 
    + ', ' + JSON.stringify(value));
  
         return ( 
         <text 
                 x={x} 
                 y={y + 39} 
  
                 fontSize='24' 
                 fontFamily='sans-serif'
                 fill={color}                               
                 textAnchor="start">{value}%
        </text>
         )
    
  };

  export default ChartLabel;
  