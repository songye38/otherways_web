import WhiteFlight from './components/WhiteFlight/WhiteFlight.jsx';
import WhyWeDo from './components/landingpage/WhyWeDo.jsx';
import WhatWeDo from './components/landingpage/WhatWeDo.jsx';
import WhatWeSell from './components/landingpage/WhatWeSell.jsx';
import WhatWeMake from './components/landingpage/WhatWeMake.jsx';
import WhatWeSay from './components/landingpage/WhatWeSay.jsx';
import Footer from './components/landingpage/Footer.jsx';
import Header from './components/common/Header.jsx';
import ToolkitIndex from './pages/IndexPages/Toolkit/ToolkitIndex.jsx';
import ProjectIndex from './pages/IndexPages/Project/ProjectIndex.jsx';
import NewsletterIndex from './pages/IndexPages/Newsletter/NewsletterIndex.jsx';
import KombuchaProject from './pages/ProjectPages/KombuchaProject.jsx';

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

    // 콤부차 상세 페이지
  if (path === '/project/kombucha') {
    return (
      <>
        <Header />
        <main>
          <KombuchaProject
            backHref="/project"
            toolkitHref="/toolkit"
          />
        </main>
        <Footer />
      </>
    );
  }

    if (path === '/toolkit') {
    return (
      <>
        <Header />
        <main>
          <ToolkitIndex />
        </main>
        <Footer />
      </>
    );
  }

  // 프로젝트 목록
  if (path === '/project') {
    return (
      <>
        <Header />
        <main>
          <ProjectIndex />
        </main>
        <Footer />
      </>
    );
  }

  if (path === '/newsletter') {
    return (
      <>
        <Header />
        <main>
          <NewsletterIndex />
        </main>
        <Footer />
      </>
    );
  }

  // 랜딩페이지
  return (
    <>
      <Header />

      <main id="top">
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
      </main>

      <Footer />
    </>
  );
}