import { Link } from "react-router-dom";
import { Row, Col, Space, Button } from 'antd';
const LevelSelection = () => {
    return (
        <Row>
            <Col span={4} offset={10}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <h1>Choose you difficulty!</h1>
                    <Link to="/level"><Button type="primary" size='large' block>Easy</Button></Link>
                    <Link to="/level"><Button type="primary" size='large' block>Medium</Button></Link>
                    <Link to="/level"><Button type="primary" size='large' block>Hard</Button></Link>
                </Space>
            </Col>
        </Row>
    )
  };
  
  export default LevelSelection;