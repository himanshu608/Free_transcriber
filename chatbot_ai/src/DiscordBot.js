import React from 'react'
import Avatar from '@mui/material/Avatar';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import logo from "./demo.gif"

function DiscordBot() {
  return (
   <div className="container  w-100 justify-content-center d-flex flex-column">
    <div className="container discord_image w-50 d-flex p-2 mt-4  justify-content-center text-white flex-row align-items-center">
    <Avatar alt="SymblDiscordBot" sx={{ width: 56, height: 56 }} src={"https://cdn.dealspotr.com/io-images/logo/symbl.jpg?aspect=center&snap=false&width=500&height=500"} />
    <h2 className="ms-3">SymblDiscordBot</h2>
    </div>
    <div className="container text-white mt-4">
     <button className="btn btn-primary p-2 "><a href="https://discord.com/api/oauth2/authorize?client_id=1004678497047937034&permissions=8&scope=bot" className='text-white text-decoration-none' target={"_blank"}>Invite bot to your server <OpenInNewIcon sx={{'marginLeft':"5px"}}/></a></button>
    </div>

    <div className="container  text-white-50 p-3 text-decoration-none  mt-4">
      <li>Auto-detect audio upload and prompt a button to generate transcribed text </li>
      <li>Uses <a href="https://symbl.ai" className='text-decoration-none text-info' target={"_blank"}>Symbl.ai</a> to convert speech to text and generate transcripts. </li>
    </div>

    <div className="container previewdiv w-100 mb-2">
    <img src={logo} className="img-fluid" alt="Responsive image" />
    </div>
   </div>
  )
}

export default DiscordBot