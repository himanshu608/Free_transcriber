import React, {  useEffect, useState } from "react";
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import { ImpulseSpinner } from "react-spinners-kit";
import SwipeIcon from '@mui/icons-material/Swipe';
const uniqueMeetingId = btoa("user@example.com");
const symblEndpoint = `wss://api.symbl.ai/v1/streaming/${uniqueMeetingId}?access_token=${window.localStorage.getItem('auth')}`;
var ws;


function Realtimevoice() {
  const [isRecording, setisRecording] = useState(false); // state to check if mic is recording or stopped
  const [stillstartingorclosing,setstillstartingorclosing] = useState(false); 
  const [togglestate,settogglestate] = useState(false);
  const [isblocked,setisblocked] = useState(false);


  useEffect(() => {
    return ()=>{
      ws && ws.close();
    }
  },[]);

  
  function start_record() {
    setisRecording(true);

      if(navigator.mediaDevices){
        navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        }).then((stream) => {
          setisblocked(false);
          console.log("premission granted");
          ws = new WebSocket(symblEndpoint);
          setstillstartingorclosing(true);

          // Fired when a message is received from the WebSocket server
          ws.onmessage = (event) => {
            // You can find the conversationId in event.message.data.conversationId;
            const data = JSON.parse(event.data);
            
            
            if (data.type === "message_response") {
              var x = "";
              for(var i=0;i<data.messages.length;i++) {
                x += data.messages[i].payload.content + " ";
              }
              push_message(x, "user_query msg");
              getData(x);
            }
            //   console.log(`Response type: ${data.type}. Object: `, data);
          };

          // Fired when the WebSocket closes unexpectedly due to an error or lost connetion
          ws.onerror = (err) => {
            console.error(err);
          };

          // Fired when the WebSocket connection has been closed
          ws.onclose = (event) => {
            setstillstartingorclosing(false);
            settogglestate(false);
            console.info("Connection to websocket closed");
          };

          // Fired when the connection succeeds.
          ws.onopen = (event) => {

            setstillstartingorclosing(false);

            console.log("websocket opened");
    
            ws.send(
              JSON.stringify({
                type: "start_request",
                meetingTitle: "Websockets How-to", // Conversation name
                insightTypes: ["question", "action_item"], // Will enable insight generation
                config: {
                  confidenceThreshold: 0.5,
                  languageCode: "en-US",
                  speechRecognition: {
                    encoding: "LINEAR16",
                    sampleRateHertz: 44100,
                  },
                },
                speaker: {
                  userId: "user@example.com",
                  name: "Example Sample",
                },
              })
            );
          };

          /**
           * The callback function which fires after a user gives the browser permission to use
           * the computer's microphone. Starts a recording session which sends the audio stream to
           * the WebSocket endpoint for processing.
           */
          const handleSuccess = (stream) => {
            const AudioContext = window.AudioContext;
            const context = new AudioContext();
            const source = context.createMediaStreamSource(stream);
            const processor = context.createScriptProcessor(1024, 1, 1);
            const gainNode = context.createGain();
            source.connect(gainNode);
            gainNode.connect(processor);
            processor.connect(context.destination);
            processor.onaudioprocess = (e) => {
              // convert to 16-bit payload
              const inputData =
                e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
              const targetBuffer = new Int16Array(inputData.length);
              for (let index = inputData.length; index > 0; index--) {
                targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
              }
              // Send audio stream to websocket.
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(targetBuffer.buffer);
              }
            };
          };
          handleSuccess(stream);
        })
        .catch(() => {
          setisRecording(false);
          setisblocked(true);
          alert("permission denied");
          console.log("premission denied");
        })  
      }else{
        alert("mic not supported");
        setisblocked(true);
        setisRecording(false);
      }
       
  }

  function stop_record() {
    if(ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "stop_request",
        })
      );
      setstillstartingorclosing(true);
      setisRecording(false);
    }
  }

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

  function handelenter(e) {
    if (e.keyCode === 13) {
      push_message(e.target.value, "user_query msg");
      //   setUserQuery("");

      getData(e.target.value);
      e.target.value = "";
    }
  }

  return (
    <div className="w-75 container border-dark border  h-75 p-3 rounded-3 mt-5">
      <div className="container d-flex flex-column h-75 message_div text-primary">
        <h3>SymblAiBot</h3>
        <hr></hr>
        <div className="messages">
          <div className="bot_message msg">
            Welcome! How can i help you today?
            
          </div>
        </div>
      </div>
      <div className="listening">  {
              togglestate && !isblocked && !stillstartingorclosing && <ImpulseSpinner size={45}/>
            }</div>
      <hr />
      <div className="search_div d-flex justify-content-center align-items-center ">
        <input onKeyDown={handelenter} type="text" placeholder="Write something"></input>
        <div className="mic">
        <Toggle
        id='cheese-status'
        defaultChecked={togglestate}
        onChange={()=>{
          if(togglestate){
            settogglestate(false);
            stop_record();
          }else{
            settogglestate(true);
            start_record();
          }
        }}
        disabled={isblocked || stillstartingorclosing}
        title="grant permission to microphone"
        />
        </div>
      </div>
      <div className="container text-white-50 text-end mt-3">
        <p>* toggle button to interact with bot using microphone <SwipeIcon/> </p>
      </div>

      <div className="container text-white-50 text-start mt-4">
        <li>Ai powered fully functional Bot.</li>
        <li><a href="https://symbl.ai" className='text-decoration-none text-info' target={"_blank"}>Symbl.ai</a> is used to convert speech to text in real time.</li>

      </div>
    </div>
  );
}

export default Realtimevoice;
