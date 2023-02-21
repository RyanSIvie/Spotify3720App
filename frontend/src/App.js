import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { Layout } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Row, Col, Button, Tooltip } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import Home from "./pages/Home";
import ModeSelection from "./pages/ModeSelection";
import LevelSelection from "./pages/LevelSelection";

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header>
          <Row justify="space-between">
            <Col span={4}>
              <Tooltip title="Help">
                <Button shape="circle" icon={<InfoCircleOutlined />} />
              </Tooltip>
            </Col>
            <Col span={4}>
              <div className="header-text"><a href="/">Guessify</a></div>
            </Col>
            <Col span={4}>User</Col>
          </Row>
        </Header>
        <Content style={{ height: '500px' }}>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path="mode" element={<ModeSelection />} />
              <Route path="level" element={<LevelSelection />} />
            </Routes>
          </BrowserRouter>
          <Outlet />
        </Content>
        <Footer>Footer</Footer>
      </Layout>

    </div>
  );
}

export default App;
