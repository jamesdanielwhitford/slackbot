const express = require('express');
const superagent = require('superagent');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded());

app.post('/slack/command/stats', [function(req,res){
  const slackReqObj = req.body;
  const packageJson = require('./package.json');

  const current_time = new Date(); 
  const stats = {
    name: packageJson.name,
    version: packageJson.version,
    environment: process.env.NODE_ENV,
    platform: process.platform,
    architecture: process.arch,
    node_version: process.version,
    pid: process.pid,
    current_server_time: current_time.toString(),
    uptime: process.uptime(),
    memory_usage: process.memoryUsage()
  };

  const response = {
    response_type: 'in_channel',
    channel: slackReqObj.channel_id,
    text: JSON.stringify(stats, null, '\t')
  };

  return res.json(response); 
}]);


let port = process.env.PORT || 3000;
app.listen(port, ()=>{
  console.log(`App listening on port ${port}`);
  sendStartupMessageToSlack(); 
});

function sendStartupMessageToSlack(){
    superagent
      .post('https://slack.com/api/chat.postMessage')
      .send({
        channel:process.env.SLACK_CHANNEL_ID, 
        text:"I'm alive and running"
      })
      .set('accept', 'json')
      .set('Authorization', 'Bearer '+ process.env.SLACK_BOT_TOKEN)
      .end((err, result) => {
      });
}