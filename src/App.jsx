import WhiteFlight from './components/WhiteFlight/WhiteFlight.jsx';
import WhyWeDo from './components/landingpage/WhyWeDo.jsx';
import WhatWeDo from './components/landingpage/WhatWeDo.jsx';
import WhatWeSell from './components/landingpage/WhatWeSell.jsx';
import WhatWeMake from './components/landingpage/WhatWeMake.jsx';
import WhatWeSay from './components/landingpage/WhatWeSay.jsx';
import Footer from './components/landingpage/Footer.jsx';
import Header from './components/common/Header.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <div id="hero">
          <WhiteFlight
            showCaption={false}
            showControls={false}
            style={{ height: '100dvh' }}
          />
        </div>

        <WhyWeDo />
        <WhatWeDo />
        <WhatWeSell />
        <WhatWeMake />
        <WhatWeSay />

        <Footer />
      </main>
    </>
  );
}