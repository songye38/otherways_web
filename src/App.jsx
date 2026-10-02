import WhiteFlight from './components/WhiteFlight/WhiteFlight.jsx';
import WhyWeDo from './components/landingpage/WhyWeDo.jsx';
import WhatWeDo from './components/landingpage/WhatWeDo.jsx';

export default function App() {
  return (
    <main>
      <WhiteFlight
        showControls={false}
        style={{ height: '100dvh' }}
      />

      <WhyWeDo />
      <WhatWeDo />
    </main>
  );
}