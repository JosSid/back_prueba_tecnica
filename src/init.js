const express = require("express");
const app = express();
const router = require("./routers");
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const db = require('./db')

db.GetClient()
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
