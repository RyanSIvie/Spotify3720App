import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Layout } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Row, Col, Button, Tooltip } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import Home from "./pages/Home";
import ModeSelection from "./pages/ModeSelection";
import LevelSelection from "./pages/LevelSelection";
import Play from "./pages/Play";
import { useState, useEffect } from "react";
import SpotifyWebApi from 'spotify-web-api-js';


const { Header, Footer, Content } = Layout;

const spotifyApi = new SpotifyWebApi();


function App() {

  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  //const [top50Tracks, setTop50Tracks] = useState({items: [{}]});
  //const [id, setId] = useState(0);

  //const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token");
    const tokenTime = window.localStorage.getItem("tokenTime");

    if (Date.now() - tokenTime >= 60 * 60 * 1000) token = null;

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      window.location.hash = "";
      window.localStorage.setItem("tokenTime", Date.now());
      window.localStorage.setItem("token", token);
    }

    setToken(token);
    if (token) {
      spotifyApi.setAccessToken(token);

      spotifyApi.getMe().then(function (data) {
        setUser(data);
      });

      //navigate('/mode');

      /*spotifyApi.getMyTopTracks({ time_range: "long_term", limit: 50 }).then(function (data) {
        
        setTop50Tracks(data);
      });*/
    }


  }, []);

  return (
    <Layout className="App">
      <Header className="header">
        <Row justify="space-between">
          <Col span={4}>
            <Tooltip title="Help">
              <Button shape="circle" icon={<InfoCircleOutlined />} />
            </Tooltip>
          </Col>
          <Col span={4}>
            <div><a href="/">Guessify</a></div>
          </Col>
          <Col style={{color: "white"}} span={4}>{user.id}</Col>
        </Row>
      </Header>
      <Content className="content">
        <BrowserRouter>
          <Routes>
            <Route index element={!token ? <Home /> : <Navigate to="/mode" />} />
            <Route path="mode" element={token ? <ModeSelection /> : <Navigate to="/" />} />
            <Route path="level" element={token ? <LevelSelection /> : <Navigate to="/" />} />
            <Route path="play" element={token ? <Play /> : <Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        <Outlet />
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default App;
