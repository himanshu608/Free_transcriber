import React, { useState } from 'react'
import { FileUploader } from "react-drag-drop-files";

import { ImpulseSpinner } from "react-spinners-kit";


function VideoTrancript() {
    const fileTypes = ["MP4"];

    const [file, setFile] = useState(null);
    const [jsondata,setjsondata] = useState();
    const [textdata,settextdata] = useState("");
    const [load,setload]=useState(false);
    const [innermsg,setinnermsg] = useState("Get trancribed messages!")

    function get_message(res){
        var x = setInterval(() => {
            fetch(`https://api.symbl.ai/v1/job/${res.jobId}`, {
          method: 'get',
          headers: {
            'Authorization': `Bearer ${window.localStorage.getItem('auth')}`,
            'Content-Type': 'application/json'
          }
          }).then(res => res.json()).then(res1 => {
            console.log(res1.status);
            if(res1.status === 'completed'){
              fetch(`https://api.symbl.ai/v1/conversations/${res.conversationId}/messages`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${window.localStorage.getItem('auth')}`,
                  'Content-Type': 'application/json'
              }
              })
              .then((r) => {
                return r.json();
              }).then((rsr) =>{
                console.log(rsr);
                    setload(false);
                    rsr.messages.map(msg=>{
                        settextdata(pre => pre+msg.text+"\n");
                    })
                    setjsondata(rsr.messages.map(m =>{
                        return {
                            text : m.text,
                            conversationId: m.conversationId
                        };
                    }))
                    setinnermsg("Get trancribed messages!");
              }).catch(err =>{
                console.log(err);
              })
              clearInterval(x);
            }
            })
            .catch(err => {
            console.log(err);
            })
        },1000);
      }


    function getdata(e){
        
        if(file.size <= 15000000){
          setload(true);
        setinnermsg("Getting messages please wait...");
        fetch("https://api.symbl.ai/v1/process/video",{
          body: file,
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem('auth')}`, 
            "Content-Type": "video/mp4",
          },
          method: "POST",
        }).then(res => res.json())
        .then(data => {
            get_message(data);
        })
        .catch(err => console.log(err));
        }else{
          setFile(null);
         alert("file size much be less than 15Mb ");
        }
    }

function downloadtext(){
    if(textdata){
            var blob = new Blob([textdata],
        { type: "text/plain;charset=utf-8" });
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob);
        a.download =  "transcripts.txt";
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
}
function downloadJson(){
   if(jsondata){
    var blob = new Blob([JSON.stringify(jsondata)],
        { type: "application/json;charset=utf-8" });

        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob);
        a.download =  "transcripts.json";
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
   }
}
function copyText(){
    if(textdata){
        navigator.clipboard.writeText(textdata);
    }
}
  return (
    <div className="container bg-dark d-flex flex-column align-center justify-content-center mx-3">
        <div className="container d-flex flex-column  align-items-center text-white mt-4">
        {file?.name}
   <FileUploader  handleChange={(file)=>{console.log(file[0]);setFile(file)}} name="file" types={fileTypes} classes="text-white-50 mt-3" />
       <button disabled={load} type="button" className="btn btn-primary  m-3" onClick={(e)=>file?getdata(e):alert("please select video file")}>{innermsg}</button>
        </div>
        <div className="container messagediv bg-gradient w-75 text-white-50 my-1 p-4 overflow-auto break-word text-start">
        {
            load ? (
                <div className="text-center  d-flex flex-row justify-content-center align-content-center ">
                    <ImpulseSpinner/>
                </div>
            ) : (
               <>
               
               
                    {jsondata && <h5 className="text-center text-info">Here is your transcribed messages!</h5>}
                    {
                        jsondata?.map(m=>{
                            return (<li className='list' key={m.conversationId*Math.random()*2}>{m.text}</li>)
                        })
                    }

    
               </>
            )
        }
        </div>

        <div className="container d-flex flex-row justify-content-around align-center p-3 mt-4 flex-wrap">
            <button disabled={load} className="btn btn-success m-2" onClick={copyText}>Copy</button>
            <button disabled={load} className="btn btn-secondary m-2" onClick={downloadJson}>Download JSON</button>
             <button disabled={load} className="btn btn-primary  m-2"  onClick={downloadtext}>Download Text</button>
        </div>
        <div className="container text-white-50 text-start mt-1 ">
          <li>Upload a video to get transcribbed messages.</li>
         <li> <a href="https://symbl.ai" className='text-decoration-none text-info' target={"_blank"}>Symbl.ai</a> is used to generate transcribbed messages</li>
        <li>The larger thse size , more will be the time to process and generate transcribbed messages, So be patient!</li>
        </div>
    </div>
  )
}

export default VideoTrancript;