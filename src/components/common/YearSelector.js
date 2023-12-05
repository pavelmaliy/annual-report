import React, { useState } from 'react';
import { TextField, MenuItem } from '@mui/material';

function YearSelector() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Generate an array of years, e.g., from 2020 to the current year
  const years = Array.from({ length: currentYear - (currentYear - 5) }, (_, index) => currentYear - index);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    // You can perform additional actions when the year changes
  };

  return (
    <TextField
      select
      value={selectedYear}
      onChange={handleYearChange}
      variant="outlined"
    >
      {years.map((year) => (
        <MenuItem key={year} value={year}>
          {year}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default YearSelector;
