import './App.css';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

//Components 
import Memory from './components/Memory.jsx'; 

function App() {
  const [activeTab, setActiveTab] = useState('page1');

  return (
    <div className="app-background">
      
      {/* Header */}
      <Navbar className="navbar-custom" variant="dark">
        <Container>
          <Navbar.Brand className="navbar-title">
            ⚡ Microcontroller Simulator
          </Navbar.Brand>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="main-container">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="tabs-custom mb-4"
        >
          <Tab
            eventKey="page1"
            title={
              <span
                style={{ color: activeTab === 'page1' ? '#d0b204ff' : '#aaa' }}
              >
                Assembly Code
              </span>
            }
          >
            <div className="content-box">
              <h2 className="content-title">Assembly Code</h2>
            </div>
          </Tab>

          <Tab eventKey="page2" title={<span style={{ color: activeTab === 'page2' ? '#ffd700' : '#aaa' }}>Page 2</span>}>
            <div className="content-box scrollable">
              <Memory />
            </div>
          </Tab>

        </Tabs>
      </Container>

      {/* Footer */}
      <footer className="footer">
        <Container>
          <p className="footer-text">
            Made by Jack Harty —{" "}
            <a href="mailto:sportingjdh@icloud.com" className="footer-link">
              sportingjdh@icloud.com
            </a>
          </p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
