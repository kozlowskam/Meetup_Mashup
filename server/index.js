var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Meetup = require("meetup")
var mup = new Meetup()

server.listen(3002);

let sockets = []
let topicCounters = {}
let top10 = []

mup.stream("/2/rsvps", (stream) => {
  stream
    .on("data", (item) => {
      console.log("got item " + item.rsvp_id)
      
      const topics = item.group.group_topics.map(t => t.topic_name)
      if (topics.includes('Software Development')) {
        io.emit('action', {
          type:'ADD_RSVP', 
          payload:item
        })
        topics.map(topic => {
          if (topicCounters[topic]) topicCounters[topic]++
          else topicCounters[topic] = 1
        })
        const list = Object.keys(topicCounters).sort((a,b) => 
          topicCounters[a] > topicCounters[b] ? -1 : topicCounters[a] < topicCounters[b] ? 1 : 0
        ).map(t => ({
          topic: t,
          count: topicCounters[t]
        })).slice(0,10)
        
        const oldCount = top10.map(t => t.count).reduce((a,b) => a+b, 0)
        const newCount = list.map(t => t.count).reduce((a,b) => a+b, 0)
        if (oldCount !== newCount) {
          console.log('new topics!')
          io.emit('action', {
            type: 'UPDATE_TOPICS',
            payload: list
          })
          top10 = list
        }
        else console.log(oldCount)
        console.log(list)
      }
    }).on("error", function(e) {
       console.log("error! " + e)
    });
});

io.on('connection', (socket) => {
  console.log('got connection')
    
  if (top10) socket.emit('action', {
    type: 'UPDATE_TOPICS',
    payload: top10
  })
});