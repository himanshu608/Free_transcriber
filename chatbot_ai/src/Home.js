import React, { useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import pexels1 from "./pexels-photo-1366957.jpeg";
import pexels2 from "./pexels-photo-1714208.jpeg";
import pexels3 from "./pexels-photo-1841841.jpeg";
function Home() {
  useEffect(() => {
    const appId =
      "786557586152316e47354752657058767253596433414b69677169376b615932";
    const appSecret =
      "53756348326169655675753775586442787556484c37444f34724f73526d596b655166536767504f5f415f544e6e374d764d4c4a473853753837423478474276";

    const authOptions = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "application",
        appId: appId,
        appSecret: appSecret,
      }),
    };

    // using fetch to generate auth-tokens
    fetch("https://api.symbl.ai/oauth2/token:generate", authOptions)
      .then((response) => response.json())
      .then((actualData) =>
        window.localStorage.setItem("auth", actualData.accessToken)
      ) // set authtokens  state to use globally
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>

    <div className="container mainhome bg-dark d-flex flex-column my-3">
      <div className="container homediv text-white text-start p-2 mt-3">
        <h5>
          Using an AI powered conversation intelligence platform{" "}
          <a
            href="https://symbl.ai"
            className="text-decoration-none text-info"
            target={"_blank"}
          >
            Symbl.ai
          </a>{" "}
          , we have developed a platform where user can :
        </h5>
        {/* <li>Interact and Converse with AI powered Chatbot</li>
          <li>Generate transcribbed messages from video easily and can copy and download the messages in text and JSON formats.</li>
          <li>Invite discord bot to their server to get transcripts of audio files every time someone uploads an audio file.</li> */}
      </div>
      <div className="container carasoul my-4">
        <Carousel fade>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={
                pexels1
              }
              alt="First slide"
            />
            <Carousel.Caption
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              className="mask  d-flex flex-column justify-content-center  h-100"
            >
              <Link
                to="/chatbot"
                style={{ textDecoration: "none", color: "white" }}
              >
                <h3>SymblAiBot</h3>
                <p className="mt-1">
                  Interact and Converse with AI powered Chatbot
                </p>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={pexels2}
              alt="Second slide"
            />
            <Carousel.Caption
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              className="mask  d-flex flex-column justify-content-center  h-100"
            >
              <Link
                to="/videotranscript"
                style={{ textDecoration: "none", color: "white" }}
              >
                <h3>Video Transcription</h3>
                <p className="mt-1">
                  Get transcribed messages from your video.
                </p>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={pexels3}
              alt="Third slide"
            />
            <Carousel.Caption
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              className="mask  d-flex flex-column justify-content-center h-100"
            >
              <Link
                to="/discordbot"
                style={{ textDecoration: "none", color: "white" }}
              >
                <h3>SymblDiscordBot</h3>
                <p>
                  Invite bot to your server to get transcribed messages from
                  audio files.
                </p>
              </Link>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Home;
