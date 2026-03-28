import { useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-[1280px] mx-auto p-8 text-center">
      <div>
        <a href="https://wxt.dev" target="_blank" className="font-medium text-[#646cff] no-underline hover:text-[#535bf2]">
          <img src={wxtLogo} className="h-[6em] p-[1.5em] will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#54bc4ae0]" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="font-medium text-[#646cff] no-underline hover:text-[#535bf2]">
          <img src={reactLogo} className="h-[6em] p-[1.5em] will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]" alt="React logo" />
        </a>
      </div>
      <h1 className="text-[3.2em] leading-tight">WXT + React</h1>
      <div className="p-[2em]">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-transparent px-[1.2em] py-[0.6em] text-base font-medium bg-[#1a1a1a] cursor-pointer transition-[border-color] duration-250 hover:border-[#646cff]"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-[#888]">
        Click on the WXT and React logos to learn more
      </p>
    </div>
  );
}

export default App;
