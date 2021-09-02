const createCsvWriter = require ('csv-writer').createObjectCsvWriter;
const csv = require ('csv-parser');
const fs = require ('fs');

/**
 * Function which creates a CSV of crime data suitable for machine learning algorithms
 * 
 */
//TODO TEST CSV WRITE
const generateCSV = () => {
  const csvWriter = createCsvWriter ({
    path: '../server/crime-data/output.csv',
    header: [
      {id: 'name', title: 'Name'},
      {id: 'surname', title: 'Surname'},
      {id: 'age', title: 'Age'},
      {id: 'gender', title: 'Gender'},
    ],
  });

  const data = [
    {
      name: 'John',
      surname: 'Snow',
      age: 26,
      gender: 'M',
    },
    {
      name: 'Clair',
      surname: 'White',
      age: 33,
      gender: 'F',
    },
    {
      name: 'Fancy',
      surname: 'Brown',
      age: 78,
      gender: 'F',
    },
  ];

  csvWriter
    .writeRecords (data)
    .then (() => console.log ('The CSV file was written successfully'));
};





//TODO change function to format data for machine learning?  or something
const editCSV = aFilePath => {
  //TEST
  const csvWriter = createCsvWriter ({
    path: aFilePath,
    header: [
      {id: 'name', title: 'Name'},
      {id: 'surname', title: 'Surname'},
      {id: 'age', title: 'Age'},
      {id: 'gender', title: 'Gender'},
    ],
  });

  const data = [
    {
      name: 'John',
      surname: 'Snow',
      age: 26,
      gender: 'M',
    },
    {
      name: 'Clair',
      surname: 'White',
      age: 33,
      gender: 'F',
    },
    {
      name: 'Fancy',
      surname: 'Brown',
      age: 78,
      gender: 'F',
    },
  ];

  csvWriter
    .writeRecords (data)
    .then (() => console.log ('The CSV file was written successfully'));
};

const testEditCSV = () => {
  fs
    .createReadStream ('data.csv')
    .pipe (csv ())
    .on ('data', row => {
      console.log (row);
    })
    .on ('end', () => {
      console.log ('CSV file successfully processed');
    });
};

module.exports = {generateCSV, editCSV};
