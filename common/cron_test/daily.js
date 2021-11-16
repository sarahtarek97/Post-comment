var cron = require('node-cron');

const dailyFunc = ()=> {
cron.schedule('* */23 * * *', () => {
  console.log('running a task once every day');
})
};

module.exports = dailyFunc;