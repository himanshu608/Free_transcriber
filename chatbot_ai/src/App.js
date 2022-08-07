import "./App.css";
import "./chatbot.css"
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Nav_bar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./Home";
import Realtimevoice from "./Realtimevoice";
import VideoTrancript from "./VideoTrancript";
import DiscordBot from "./DiscordBot";

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route  path="/chatbot" element={<Realtimevoice />} />
        <Route  path="/videotranscript" element={<VideoTrancript />} />
        <Route  path="/discordbot" element={<DiscordBot />} />

      </Routes>
     </div>
    </Router>
  );
}

export default App;
