import React, { useState } from 'react';
import axios from 'axios';
import { Box, dividerClasses } from '@mui/material';
import {TextField} from '@mui/material';
import {Button} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function ErrorForm() {
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');


//   const handleSubmit = (event) => {};

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://192.168.100.195:8484/error', { error, description })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  return (
    <Card sx={{ maxWidth: 345}}>
      <CardMedia
        sx={{ height: 140 }}
        image="/error.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField id="outlined-basic" label="Error Type" variant="outlined" value={error} onChange={(e) => setError(e.target.value)}/>
          <Typography>. </Typography>
          <TextField id="filled-basic" label="Description" variant="filled" value={description} onChange={(e) => setDescription(e.target.value)} />
          <br></br>
          <br></br>
          <Button  size="small" type="submit" variant="contained">Report</Button>        
          
        </form>
      </CardContent>
      <CardActions>

      </CardActions>
    </Card>


    
    // <form onSubmit={handleSubmit}>
    // <TextField id="outlined-basic" label="Error" variant="outlined" value={error} onChange={(e) => setError(e.target.value)}/>
    // <br></br>
    // <TextField id="filled-basic" label="Description" variant="filled" value={description} onChange={(e) => setDescription(e.target.value)} />
    // <br></br>
    // <Button type="submit" variant="contained">Report</Button>
    //  </form>

    // <form onSubmit={handleSubmit}>
    //   <label>
    //     Error:
    //     <input type="text" value={error} onChange={(e) => setError(e.target.value)} />
    //   </label>
    //   <label>
    //     Error Description:
    //     <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
    //   </label>
    //   <button type="submit">Report</button>
    // </form>
  );
}

export default ErrorForm;
