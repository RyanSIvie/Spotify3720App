import { Row, Col} from 'antd';
import { useState, useEffect } from "react";
import SpotifyWebApi from 'spotify-web-api-js';
import Track from '../components/Track';

const spotifyApi = new SpotifyWebApi();

const Play = () => {
    const [top50Tracks, setTop50Tracks] = useState({items: [{name: "", preview_url: ""}]});
    const [id, setId] = useState(0);

    useEffect(()=>{
        const token = window.localStorage.getItem("token");
        if (token) {
            spotifyApi.setAccessToken(token);
            
            spotifyApi.getMyTopTracks({ time_range: "long_term", limit: 50 }).then(function (data) {
        
                setTop50Tracks(data);
              });
        }
    }, []);
    return (
        <Row>
            <Col span={4} offset={10}>
                
            
        <Track track={top50Tracks.items[id]} />
        <button onClick={() => setId(id-1)}>back</button>
        <button onClick={() => setId(id+1)}>next</button>
        
            </Col>
        </Row>
    )
  };
  
  export default Play;