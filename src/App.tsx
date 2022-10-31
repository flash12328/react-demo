import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import './App.css';
import { Menu11 } from './pages/menu1/Menu11';
import { Menu12 } from './pages/menu1/Menu12';
import { Menu21 } from './pages/menu2/Menu21';
import { Menu22 } from './pages/menu2/Menu22';
import { menuState } from './recoil/atoms/menu';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const menus: any[] = useRecoilValue(menuState);

  const Collapsed = (props: any) => collapsed ? <MenuUnfoldOutlined onClick={() => setCollapsed(!collapsed)} /> : <MenuFoldOutlined onClick={() => setCollapsed(!collapsed)} />

  let location = useLocation();
  return (
    <Layout className="app_layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <div style={{ textAlign: !collapsed ? 'left' : 'center' }}>
            <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="antd" />
            {!collapsed ? 'react' : ''}
          </div>
        </div>
        <div className="collapsed">
          <Collapsed />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
        >
          {
            menus.map((item: any) => {
              return (
                <Menu.SubMenu key={item?.key} title={item.label}>
                  {
                    item.children?.map((child: any) => {
                      return (
                        <Menu.Item key={child?.key} title={child.label}>
                          <Link title={child.label} to={child.path} state={child}>{child.label}</Link>
                        </Menu.Item>
                      )
                    })
                  }
                </Menu.SubMenu>
              )
            })
          }
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="header" style={{ padding: 0 }}>

        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            color: 'black'
          }}
        >
          <Routes>
            <Route path='/menu1/1-1' element={<Menu11 state={location.state} />} />
            <Route path='/menu1/1-2' element={<Menu12 state={location.state} />} />
            <Route path='/menu2/2-1' element={<Menu21 state={location.state} />} />
            <Route path='/menu2/2-2' element={<Menu22 state={location.state} />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;