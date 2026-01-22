# PEECE MAKER (피스메이커)

**PEECE MAKER**는 제주도 내 공중화장실의 위치 및 상세 정보(편의시설, 안전시설 등)를 제공하고, 사용자 리뷰 및 커뮤니티 기능을 통해 쾌적한 화장실 이용을 돕는 웹 서비스입니다.

> **Project Goal**: To provide accessible, detailed information about public restrooms in Jeju Island and foster a community for sharing restroom conditions.

---

## 🚀 주요 기능 (Key Features)

### 1. 랜딩 페이지 (Landing Page)
- **몰입감 있는 인트로**: 제주도의 아름다운 풍경 영상(`jeju.mp4`)과 Framer Motion을 활용한 텍스트 애니메이션으로 사용자에게 깊은 인상을 남깁니다.
- **서비스 소개**: Map, Chart, Board 등 주요 기능과 데이터 출처(제주시 공공데이터)를 안내합니다.

### 2. 화장실 지도 (Toilet Map)
- **위치 기반 서비스**: Kakao Map API를 연동하여 현재 위치 기반으로 주변 화장실 정보를 제공합니다.
- **클러스터링**: 다수의 화장실 마커가 밀집된 지역에서도 보기 쉽도록 클러스터링 기능을 적용했습니다.
- **상세 필터링**:
  - **안심 시설**: 비상벨, CCTV 설치 여부
  - **편의 시설**: 장애인용, 유아 동반 가능 여부
  - **성별**: 남성용/여성용 화장실 구분
- **상세 팝업**: 화장실 선택 시 세부 정보와 사용자 리뷰를 팝업으로 확인할 수 있습니다.

### 3. 통계 대시보드 (Statistics Dashboard)
- **데이터 시각화**: Recharts를 사용하여 직관적인 차트를 제공합니다.
  - **지역별 분포 (BarChart)**: 읍/면/동 단위 화장실 개수 시각화.
  - **수용력 분석 (PieChart)**: 성별 및 시설 유형별 수용력 비율 분석.
- **실시간 필터링**: 필터 버튼(전체, 안심, 장애인, 유아) 클릭 시 즉시 통계가 업데이트됩니다.
- **다크 모드 지원**: 시스템 테마에 맞춰 차트 색상이 자동으로 최적화됩니다.
- **랭킹 시스템**: 사용자 리뷰 평점을 기반으로 Best/Worst 화장실 Top 5를 제공합니다.

### 4. 커뮤니티 게시판 (Community Board)
- **정보 공유**: 화장실 이용 경험이나 관련 정보를 공유할 수 있는 게시판입니다.
- **CRUD 기능**: 게시글 작성, 조회, 수정, 삭제 기능을 완벽하게 지원합니다.
- **검색 및 정렬**: 제목, 내용, 작성자로 게시글을 검색하고 페이지네이션을 통해 편리하게 탐색할 수 있습니다.

---

## 🛠 기술 스택 (Tech Stack)

| Category | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript, React 19 |
| **Styling** | Tailwind CSS 4, Framer Motion |
| **State Management** | React Context API |
| **Visualization** | Recharts, React-Kakao-Maps-SDK |
| **Database/Auth** | Supabase (Client Integration) |
| **Environment** | Windows (win32) |

---

## 🏁 시작하기 (Getting Started)

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계(Step)를 따라주세요.

### 1. 저장소 클론 (Clone Repository)
```bash
git clone <repository_url>
cd webfront
```

### 2. 패키지 설치 (Install Dependencies)
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. 환경 변수 설정 (Environment Variables)
프로젝트 루트에 `.env.local` 파일을 생성하고 Kakao Map API 키를 설정해야 지도가 정상적으로 표시됩니다.

```env
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_api_key_here
```

### 4. 개발 서버 실행 (Run Development Server)
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 결과를 확인하세요.

---

## 📂 폴더 구조 (Project Structure)

```text
src/
├── app/
│   ├── main/             # 핵심 기능 페이지
│   │   ├── chartView.tsx # 통계 및 차트
│   │   ├── mapView.tsx   # 지도 및 마커 로직
│   │   ├── boardView.tsx # 게시판 기능
│   │   └── page.tsx      # 메인 레이아웃
│   ├── page.tsx          # 랜딩 페이지 (Intro)
│   └── globals.css       # 전역 스타일 (Tailwind CSS)
├── components/           # 공통 UI 컴포넌트
├── assets/               # 정적 리소스 및 더미 데이터
└── public/               # 이미지, 비디오, 폰트 등 정적 파일
```

---

## 📝 License

This project is for educational and portfolio purposes.