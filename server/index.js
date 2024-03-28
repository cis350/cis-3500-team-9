const express = require('express');
const userRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // for parsing application/json

app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
