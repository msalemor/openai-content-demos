import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

import Nav from './components/nav';
import Settings from './components/settings';
import { Route, Routes } from 'react-router-dom';
import Playground from './components/playground';
import { ISettings } from './interfaces';
import ComputeWizard from './components/Wizard';
import Finance from './components/Finance';
import Projects from './components/Projects';
import Energy from './components/Energy';
import MsDoc from './components/MsDoc';

function App() {
  //const [count, setCount] = useState(0)
  let defaultSettings: ISettings = {
    model: 'GPT',
    max_tokens: 300,
    temperature: 0.3,
    n: 1,
    stop: ''
  }
  const [settings, setSettings] = useState(defaultSettings)

  return (
    <>
      <Nav />
      <Settings settings={settings} setSettings={setSettings} />
      <div className='hidden flex flex-row px-2 pt-2 place-content-end '>
        <label className="mr-2">Token Count:</label>
        <label className="mr-2 inline-block rounded-full bg-blue-950 text-white px-2">100</label>
        <label className="mr-2">Total Token Count:</label>
        <label className="mr-2 inline-block rounded-full bg-blue-950 text-white px-2">0</label>
      </div>
      <main>
        <Routes>
          <Route path="/" element={<Playground settings={settings} role='' context='' />} />
          <Route path="/wizard" element={<ComputeWizard settings={settings} />} />
          <Route path="/finance" element={<Finance settings={settings} />} />
          <Route path="/energy" element={<Energy settings={settings} />} />
          <Route path="/projects" element={<Projects settings={settings} />} />
          <Route path="/docs" element={<MsDoc settings={settings} />} />
        </Routes>
      </main>
      {/* <Fot /> */}
    </>
  )
}

export default App
