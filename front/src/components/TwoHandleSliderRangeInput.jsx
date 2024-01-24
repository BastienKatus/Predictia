import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function TwoHandleSliderRangeInput({ values, onChange }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  const handleInputChange = (event, index) => {
    const newValue = event.target.value === '' ? '' : Number(event.target.value);
    const newValues = [...values];
    newValues[index] = newValue;
    onChange(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Typography mb={2} id="range-slider" gutterBottom>
        Valeurs
      </Typography>
      <Slider
        id="range-slider"
        value={values}
        onChange={handleChange}
        min={0}
        max={100}
      />
      <FormInputs values={values} handleInputChange={handleInputChange} />
    </Box>
  );
}

function FormInputs({ values, handleInputChange }) {
  return (
    <Box display="flex" justifyContent="space-between" mt={2}>
      <TextField
        type="number"
        label="% Victoire de l'équipe à domicile"
        value={values[0]}
        onChange={(e) => handleInputChange(e, 0)}
        inputProps={{ min: 0, max: values[1] - 1, 'aria-label': 'Zone A' }}
        style={{ width: '45%' }}
      />
      <TextField
        type="number"
        label="% Victoire de l'équipe extérieur"
        value={100 - values[1]}
        onChange={(e) => handleInputChange(e, 1)}
        inputProps={{ min: values[0] + 1, max: 100, 'aria-label': 'Zone B' }}
        style={{ width: '45%' }}
      />
    </Box>
  );
}

export default TwoHandleSliderRangeInput;