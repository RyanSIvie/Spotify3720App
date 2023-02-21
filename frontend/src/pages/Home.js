import { Link } from "react-router-dom";
import { Button, Row, Col } from 'antd';

const Home = () => {
    return (
    <Row>
        <Col span={4} offset={10}>
            <Link to="/mode"><Button type="primary" size='large' block>PLAY</Button></Link>
        </Col>
    </Row>)
  };
  
  export default Home;