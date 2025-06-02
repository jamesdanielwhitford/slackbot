const express = require('express');
const superagent = require('superagent');

const app = express();

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