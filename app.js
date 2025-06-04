const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

app.listen(3000, () => {
    console.log('listening to port 3000!!');
});