import React from 'react';
import Chat from './components/Chat';
import { EmoteManager } from './components/EmoteManager';

function App() {
  return (
    <div className="App">
      <EmoteManager>
        <Chat />
      </EmoteManager>
    </div>
  );
}

export default App; 