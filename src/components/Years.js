import React from 'react';
import Select from 'react-select';

const Years = ({ onChange }) => {
  const years = Array.from(new Array(20), (val, index) => ({
    value: 2000 + index,
    label: 2000 + index,
  }));

  return <Select options={years} onChange={onChange} />;
};

export default Years;