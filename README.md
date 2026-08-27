# 💌 Date Ticket Generator

> Claude와 함께 만든 **바이브코딩(Vibe Coding) 연습용 프로젝트**입니다.

친구나 연인에게 보낼 수 있는 **데이트 신청 링크**를 만들고, 신청이 성사되면
영화 티켓처럼 생긴 **데이트 티켓 이미지**를 다운로드/공유할 수 있는 웹앱입니다.

🔗 **바로 써보기**: https://date-ticket-generator.netlify.app/

## ✨ 주요 기능

- **이름 입력 → 공유 링크 생성**: 보내는 사람/받는 사람 이름을 입력하면 전용 링크가 만들어집니다.
- **도망가는 No 버튼**: No를 누를수록 버튼이 도망다니고, Yes 버튼은 점점 커집니다.
- **단계별 데이트 설계**: 데이트 종류, 날짜/시간, 장소, 좌석 등급, 특별 요청사항, 한마디 메시지를 순서대로 입력합니다.
- **데이트 티켓 생성**: 입력한 내용이 영화 티켓 스타일의 카드로 완성되고, 이미지로 다운로드하거나 공유할 수 있습니다.

## 🛠 기술 스택
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![html2canvas](https://img.shields.io/badge/html2canvas-1.4.1-8A2BE2?style=for-the-badge)
![Google Fonts](https://img.shields.io/badge/Google%20Fonts-4285F4?style=for-the-badge&logo=googlefonts&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
- Google Fonts (Jua, Gowun Dodum)

## 🚀 실행 방법

별도 빌드 과정 없이 정적 파일이라, 아래처럼 로컬에서 바로 열어보면 됩니다.

```bash
# 저장소 클론 후
cd date-ticket-generator

# 아무 정적 서버로 실행 (예: Python)
python -m http.server 8000
```

## 📁 파일 구조

```
├── index.html   # 전체 화면/단계 마크업
├── style.css    # 디자인
└── script.js    # 단계 전환, 티켓 생성 등 동작 로직
```

## 📄 라이선스

개인/학습용 프로젝트입니다.
