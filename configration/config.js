const mongoose = require('mongoose');

const connection = ()=> {
  return mongoose.connect(process.env.CONNECTION_STRING)
  .then((result)=> console.log('db is fine'))
  .catch((err)=>console.log(err))
};

  module.exports = connection;