import { Link } from "react-router-dom";
import { Button, Row, Col, Space } from 'antd';
const SelectGame = () => {
    return (
        <Row>
            <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
                <Space direction="vertical" size="middle" style={{ display: 'flex', flexDirection: "column", maxWidth: "400px", alignItems: "center", }}>
                    <h1 style={{ marginTop: "20px", }}>Choose your game!</h1>
                    <Link to="/song-guessing-game"><Button type="primary" size='large' block>Top 50 Songs</Button></Link>
                    <Link to="/lyrics-guessing-game"><Button type="primary" size='large' block>Where's That Lyric From?</Button></Link>
                </Space>
            </Col>
        </Row>
    )
};

export default SelectGame;