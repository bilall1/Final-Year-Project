import React from 'react';
import ErrorForm from './ErrorForm';
import Stack from '@mui/material/Stack';

function App() {
  return (
    <div style={{ display:'flex', justifyContent:'center' }}>
      <Stack>
      <h1>Bug Reporting Form</h1>
      <ErrorForm />
      </Stack>
      
    </div>
  );
}
export default App;