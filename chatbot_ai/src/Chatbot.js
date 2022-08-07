import React, { useState } from "react";
import "./chatbot.css";
import MicIcon from "@material-ui/icons/Mic";
import { IconButton } from "@material-ui/core";
import { useEffect } from "react";
import MicRecorder from "mic-recorder-to-mp3";
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

function Chatbot() {
  const [userQuery, setUserQuery] = useState(""); // state for user messages in text form
  const [isRecording, setisRecording] = useState(false);  // state to check if mic is recording or stopped 
  const [isBlocked, setisBlocked] = useState(false);     // check for user permission for audio


  
  
  useEffect(() => {
    
    // on first load ask for user permission for audio
    if(navigator.mediaDevices){
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      }).then(() => {
        setisBlocked(false);
        console.log("premission granted");
      })
      .catch(() => {
        setisBlocked(true);
        console.log("premission denied");
      })  
    }else{
      alert("mic not supported");
      setisBlocked(true);
    }

  }, []);

  // function to start recording for user queryies via microphone
  function start_record() {
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setisRecording(true);
          // after 6 seconds auto stop recording
          setTimeout(() => {
              if(isRecording) {
                stop_record();
              }
          }, 6000);
        })
        .catch((e) => console.error(e));
    }
  }


  // function to get transcripts of voice recording using conversation id
    function get_message(res){
      fetch(`https://api.symbl.ai/v1/conversations/${res.conversationId}/transcript`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.localStorage.getItem('auth')}`,
             'Content-Type': 'application/json'
         },
            body: JSON.stringify({
                'contentType': 'text/markdown',
                // 'createParagraphs': true,
                'phrases': {
                    'highlightOnlyInsightKeyPhrases': true,
                    'highlightAllKeyPhrases': true
                },
              'showSpeakerSeparation': false
        })
        })
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((res) =>{
          // after getting response from server and getting speech to text result 
          // get bot reply from backend and also print user query in frontend
          push_message(res.transcript.payload,"user_query msg");
          getData(res.transcript.payload);
        });
    }

    // stop microphone recording
  function stop_record() {
    setisRecording(false);
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, "myvoice.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });
        // const player = new Audio(URL.createObjectURL(file));
        // player.play();
        // convert recording to Blob and send to symbl server to process
        fetch("https://api.symbl.ai/v1/process/audio", {
          body: file,
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('auth')}`, 
            "Content-Type": "audio/mpeg",
          },
          method: "POST",
        })
          .then((res) => res.json())
          .then((res) => {
            // after data is processed get bot answer
              setTimeout(() => get_message(res), 3200);
          });

      })
      .catch((e) => console.log(e));
  }

  // call backend to process user query and get bot reply
  function getData(message) {
    fetch(`https://symbl-chat-bot.herokuapp.com/?query=${message}`)
      .then((response) => response.json())
      .then((data) => push_message(data.cnt, "bot_message msg"));
  }

  // print bot reply and user query to frontend according to their class
  function push_message(message, classname) {
    var div = document.createElement("div");
    div.innerHTML = message;
    div.className = classname;
    var x = document.getElementsByClassName("messages")[0];
    x.appendChild(div);
    x.scrollTo({
      top: x.scrollHeight,
      behavior: "smooth",
    });
  }

  // handle text query from user 
  function handelenter(e) {
    if (e.keyCode === 13) {
      push_message(e.target.value, "user_query msg");
      setUserQuery("");
      getData(e.target.value);
    }
  }

  return (
    <div className="w-75 container border-dark border  h-75 p-3 rounded-3 mt-5">
      <div className="message_div">
        <h3>SymblAiBot</h3>
        <hr></hr>
        <div className="messages">
          <div className="bot_message msg">
            Welcome! How can i help you today?
          </div>
        </div>
      </div>
      <hr />
      <div className="search_div">
        <input
          onKeyDown={handelenter}
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        ></input>
        <div className="mic">
          <IconButton onClick={isRecording ? stop_record : start_record}>
            <MicIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
