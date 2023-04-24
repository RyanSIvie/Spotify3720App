import { Link } from "react-router-dom";
import { Button, Row, Col, Space } from 'antd';
const SelectGame = () => {
    return (
        <Row>
            <Col span={4} offset={10}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <h1>Choose your game!</h1>
                    <Link to="/song-guessing-game"><Button type="primary" size='large' block>Top 50 Songs</Button></Link>
                    <Link to="/lyrics-guessing-game"><Button type="primary" size='large' block>Where's That Lyric From?</Button></Link>
                </Space>
            </Col>
        </Row>
    )
};

export default SelectGame;