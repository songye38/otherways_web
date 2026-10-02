# 흰 점의 비행 · React

원본 이미지에서 추출한 1,400개의 흰 점을 Canvas로 그리는 React 컴포넌트야.
마우스가 없어도 잔잔하게 움직이고, 마우스나 손가락 주변 점들은 더 크게 날아올라.
현재 웹 버전의 움직임을 옮겼고, 웹사이트의 한 섹션에 넣을 수 있게 영역 크기에 맞춰 조정했어.

## 1. 예제 실행하기

Node.js 22.12 이상(또는 20.19 이상)을 설치하고, 압축을 풀어 이 폴더에서 실행해.

```bash
npm install
npm run dev
```

터미널에 나온 주소를 브라우저에서 열면 돼.

```bash
npm run build
npm run preview
```

위 명령은 배포용 파일을 만들고 그 결과를 확인할 때 사용해.
이 예제는 Vite를 사용하지만, 컴포넌트 자체는 기존 React 프로젝트로 복사할 수 있어.

## 2. 기존 React 웹사이트에 넣기

`src/components/WhiteFlight` 폴더 전체를 네 프로젝트의 `src/components`에 복사해.
다음 4개 파일은 함께 있어야 해.

| 파일 | 역할 |
| --- | --- |
| WhiteFlight.jsx | React 컴포넌트와 조절 버튼 |
| WhiteFlight.module.css | 이 컴포넌트에만 적용되는 스타일 |
| flight-engine.js | 자동 비행, 마우스 반응, 화면 크기 대응 |
| points.json | 네 이미지에서 추출한 흰 점 좌표 |

네 페이지에서 이렇게 사용하면 돼.

```jsx
import WhiteFlight from './components/WhiteFlight/WhiteFlight.jsx';

export default function App() {
  return <WhiteFlight style={{ height: '100dvh' }} />;
}
```

홈페이지의 일부 영역에 넣으려면 높이를 지정하면 돼.

```jsx
<WhiteFlight style={{ height: 600 }} />
```

CSS Modules와 JSON import를 지원하는 React 환경에서 사용해. Vite와 Next.js에서 이 구조를 사용할 수 있어.
Next.js App Router에서도 사용할 수 있도록 컴포넌트 첫 줄에 `'use client'`가 들어 있어.
기존 프로젝트에는 예제의 package.json을 덮어쓰지 말고 컴포넌트 폴더만 복사해.
별도의 애니메이션 라이브러리나 서버, 이미지 다운로드는 필요 없어.

## 3. 색상과 움직임 조절하기

```jsx
<WhiteFlight
  radius={140}
  distance={90}
  ambientStrength={0.7}
  speed={0.8}
  background="#ce479c"
  dotColor="#fffff4"
  showGrid={true}
  showControls={false}
  showCaption={false}
  style={{ height: '100dvh' }}
/>
```

| 속성 | 기본값 | 의미 |
| --- | --- | --- |
| radius | 140 | 커서 반응 범위, 화면의 CSS 픽셀 기준 |
| distance | 90 | 커서에 반응하는 비행 거리, CSS 픽셀 기준 |
| ambientStrength | 1 | 자동 움직임 강도. 0은 자동 움직임 없음, 0.5는 절반 |
| speed | 1 | 움직임 속도. 0.8은 더 느리게, 1.3은 더 빠르게 |
| background | #ce479c | 배경 색상 |
| dotColor | #fffff4 | 점 색상 |
| showGrid | true | 격자 표시 |
| showControls | true | 슬라이더와 멈춤·리셋 버튼 표시 |
| showCaption | true | 상단 안내 문구 표시 |
| style / className | — | 영역 높이와 추가 스타일 |

강도는 0~5, 속도는 0.05~2 범위로 제한돼. 처음에는 기본값 또는 위 예제로 시작해.
운영체제에서 ‘동작 줄이기’를 설정한 방문자는 처음에 정지 상태로 보여.
`showControls={true}`인 경우 ‘움직임 재생’으로 시작할 수 있어.
조절 버튼을 숨기면 멈춤 버튼도 함께 숨겨지므로, 디자인에 맞는 재생·정지 기능이 필요하면 버튼을 유지하거나 컴포넌트에 추가해.
‘원래 자리로’는 점을 즉시 복원하고 자동 움직임은 계속돼. 고정하려면 ‘움직임 멈춤’을 먼저 눌러.

## 4. 안에 들어 있는 코드

- `src/`: 재사용 가능한 React 코드와 전체 화면 실행 예제
- `original-static/`: 현재 만든 웹 버전의 HTML, JavaScript, 흰 점 데이터
- `package-lock.json`: 예제를 검증할 때 설치한 의존성 버전

React 렌더링과 별도로 Canvas가 애니메이션을 계산해. 매 프레임마다 React state를 변경하지 않아.
컴포넌트를 제거하면 requestAnimationFrame, 이벤트 리스너, ResizeObserver를 정리하도록 구성했어.
컴포넌트를 여러 개 넣어도 각각 자기 영역 안에서 움직여.

원본 JPG는 실행에 필요 없어. 새 이미지로 교체하려면 이미지에서 좌표를 다시 추출해 points.json을 교체해야 해.
단순히 JPG 경로만 바꾸는 이미지 뷰어 구조는 아니야.

## 참고 문서

- React Effect 정리: https://react.dev/reference/react/useEffect
- Vite 실행·빌드: https://vite.dev/guide/
