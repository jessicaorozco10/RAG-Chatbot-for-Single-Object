import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <div className="App-header-panels">
              <img src="/assets/panel1.png" alt="panel 1" width="350" height="350"/>
              <img src="/assets/panel2.png" alt="panel 1" width="350" height="350"/>
          </div>
          <div className="App-header-panels">
              <img src="/assets/panel3.png" alt="panel 1" width="350" height="350"/>
              <img src="/assets/panel4.png" alt="panel 1" width="350" height="350"/>
          </div>
          <img src="/assets/the-wolfsonian.png" className="App-images" alt="fiu wolfsonian logo"/>
        <h1 className="App-title">Harry Clarke Art Assistant</h1>
          <div className="App-header-panels">
              <img src="/assets/panel5.png" alt="panel 1" width="350" height="350"/>
              <img src="/assets/panel6.png" alt="panel 1" width="350" height="350"/>
          </div>
          <div className="App-header-panels">
              <img src="/assets/panel7.png" alt="panel 1" width="350" height="350"/>
              <img src="/assets/panel8.png" alt="panel 1" width="350" height="350"/>
          </div>
      </header>
    </div>
  );
}

export default App;
