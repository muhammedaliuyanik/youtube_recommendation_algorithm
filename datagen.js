
const fs = require('fs');
const uuid = require('uuid').v4

const users = [];
function generateUsers(){
    for (let i=0; i<20; i++){
        users.push({
        id: uuid(),
        name: `User ${i}`,
    });
    if (i == 19){
        fs.writeFileSync('data/users.json', JSON.stringify(users));
        
    }
    }
}
generateUsers();

const category = [];
function generateCategory(){
    for (let i=0; i<20; i++){
        category.push({
        id: uuid(), 
        name: `Category ${i}`,
    });
    if (i == 19){
        fs.writeFileSync('data/category.json', JSON.stringify(category));
        
    }
    }
}
generateCategory();

const channel = [];
function generateChannel(){
    for (let i=0; i<20; i++){
        channel.push({
        id: uuid(), 
        name: `Channel ${i}`,
        category: category[Math.random()*category.length | 0].id,
    });
    if (i == 19){
        fs.writeFileSync('data/channel.json', JSON.stringify(channel));
        
    }
    }
}
generateChannel();

const video = [];
function generateVideo(){
    for (let i=0; i<2000; i++){
        video.push({
        id: uuid(), 
        title: `Video ${i}`,
        category: category[Math.random()*category.length | 0].id,
        duration: `${Math.random()*1000 | 0}`,
        channel: channel[Math.random()*channel.length | 0].id,
    });
    if (i == 1999){
        fs.writeFileSync('data/video.json', JSON.stringify(video));
        
    }
    }
}
generateVideo();

const viewerPersonalization = [];
function generateViewerPersonalization(){
    for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < 500; j++) {
        let current_video = video[Math.random() * video.length | 0];
        let watchLength = Math.random() * Number(current_video.duration) | 0;
          viewerPersonalization.push({
            id: uuid(),
            userId: users[i].id,
            videoId: current_video.id,
            category: current_video.category,
            timestamp: Date.now(),
            watchPercentage: (watchLength / Number(current_video.duration)) * 100,
            ignored: Math.random() > 0.5,
            liked: Math.random() > 0.5,
            disliked: Math.random() > 0.5,
            shared: Math.random() > 0.5,
            subscribed: Math.random() > 0.5,
            skipped: Math.random() > 0.5
          });
          if(j === 19){
            fs.writeFileSync('data/viewerPersonalization.json', JSON.stringify(viewerPersonalization));
          }
        }
      }
}
generateViewerPersonalization();