# Taskify 🗂️

협업을 더 쉽게 만드는 칸반 스타일의 할 일 관리 웹앱

---

## 🚀 데모
👉 [Taskify 배포 링크] https://taskify-theta-plum.vercel.app/

---

## 🛠️ 기술 스택

- **Frontend**: React, TypeScript, Next.js (Page Router)
- **Styling**: Tailwind CSS, styled-components
- **State Management**: Zustand
- **API**: REST API (Swagger 문서 [바로가기](https://sp-taskify-api.vercel.app/docs/))
- **Deployment**: Vercel

---

## 📌 주요 기능

- ✅ 칸반보드 기반 카드 관리
- 📄 텍스트 / 이미지 카드 생성
- 🏷️ 태그 및 컬러 지정
- 📝 카드 무한 스크롤
- 🔍 세부 카드 조회 및 수정
- 📤 이미지 업로드
- 🧾 프로젝트 별 컬럼 정렬 및 렌더링

---

## 📂 폴더 구조

```bash
src/
│
├── components/
│   ├── Card/
│   ├── Column/
│   └── ...
├── pages/
├── hooks/
├── store/        # Zustand 상태관리
├── utils/
└── types/
