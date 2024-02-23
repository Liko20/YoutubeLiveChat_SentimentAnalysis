const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()


app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
const port = 5000;

app.post("/getdata", async (req, res) => {
    console.log(req.body)
    
    let line=req.body.link;
    let StreamId="";
    let i=0;
    
    while(line[i] != '=')
    {
        i++
    }
    i++;
    while(i < line.length)
    {
        StreamId+=line[i];
        i++;
    }
    
    try{
        const res1 = await fetch( `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,snippet&id=${StreamId}&key=AIzaSyA2j0Hn92MHJ-hVWau5yyhS1H03OkaF7Kk`);
        const data = await res1.json()
       
        liveChatID = data.items[0].liveStreamingDetails.activeLiveChatId;
        let nextPageToken=req.body.nextPageToken;
        
        const res2 = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatID}&part=snippet,authorDetails&maxResults=10&pageToken=${nextPageToken}&key=AIzaSyA2j0Hn92MHJ-hVWau5yyhS1H03OkaF7Kk`);
        const data1 = await res2.json();
        
        const chatlist  = data1.items;
       
        nextPageToken = data1.nextPageToken
       
        const messageList = [];

        let countEmotion= {};

        for (let j = 0; j < chatlist.length; j++) {
            try{    
                const emotion = await getEmotion({"inputs":chatlist[j].snippet.textMessageDetails.messageText})
                console.log(emotion[0][0].label)
                if(countEmotion[emotion[0][0].label] === undefined)
                {
                    countEmotion[emotion[0][0].label]=1;
                }
                else{
                    countEmotion[emotion[0][0].label]++;
                }

            }catch(err)
            {
                throw(err)
            }
          
        
        }

        
        res.send({"emotionlist": countEmotion, "token":nextPageToken ,});
        
    }catch(err)
    {
     
        res.send(err.message)
    }
    
    
})

async function getEmotion(data) {
    try{
        const response = await fetch(
            "https://api-inference.huggingface.co/models/arpanghoshal/EmoRoBERTa",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    }
    catch(err)
    {
        return err;
    }
	
}

app.listen(port, (err) => {
    if (err) console.log(err.message)
    console.log(`listening on ${port}`);
})