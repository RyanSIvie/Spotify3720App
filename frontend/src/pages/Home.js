import { Button, Row, Col } from 'antd';


const Home = () => {

    const loginUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=user-top-read%20user-read-private%20user-read-email`;
    
    const handleLogin = () => {
        window.location = loginUrl;
      }
    
    return (
    <Row>
        <Col span={4} offset={10}>
            <Button type="primary" size='large' block onClick={handleLogin}>Login</Button>
        </Col>
    </Row>)
  };
  
  export default Home;