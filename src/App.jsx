import { lazy, Suspense } from 'react';


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
import ToolkitLab from './pages/IndexPages/10MinToolkit/ToolkitLab.jsx'
import ArchiveIndex from './pages/IndexPages/Archive/ArchiveIndex.jsx';
import NewsletterIndex from './pages/IndexPages/Newsletter/NewsletterIndex.jsx';
import KombuchaProject from './pages/ProjectPages/KombuchaProject.jsx';
import ToolkitWorkspace from './pages/ExperimentPages/ToolkitWorkspace.jsx';
import ToolkitEditor from './pages/AdminPages/ToolkitEditor.jsx';

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

  if (path === '/archive') {
    return (
      <>
        <Header />
        <main>
          <ArchiveIndex />
        </main>
        <Footer />
      </>
    );
  }
  if (path === '/10-min-toolkit') {
    return (
      <>
        <Header />
        <main>
          <ToolkitLab />
        </main>
        <Footer />
      </>
    );
  }

  if (path.startsWith('/10-min-toolkit/')) {
    const toolkitId = path.split('/')[2];

    return (
      <>
        <Header />
        <main>
          <ToolkitWorkspace
            key={toolkitId}
            toolkitId={toolkitId}
            backHref="/10-min-toolkit"
          />
        </main>
        <Footer />
      </>
    );
  }

  if (path === '/admin/toolkits') {
    if (!import.meta.env.DEV || !ToolkitEditor) {
      return <p>페이지를 찾을 수 없습니다.</p>;
    }

    return (
      <Suspense fallback={<p>편집기를 여는 중…</p>}>
        <ToolkitEditor />
      </Suspense>
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