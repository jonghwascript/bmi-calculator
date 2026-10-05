// src/stories/Gallery.stories.js
// import '../../dist/css/style.css'; // 내가 만든 CSS 파일 불러오기

import '../scss/style.scss';
import htmlTemplate from '../pages/components/calculator.html?raw';


// 1. 스토리북 좌측 메뉴 폴더 구조와 이름 설정
export default {
  title: 'UI Components/Calculator', 
};

// 2. 화면에 그려질 실제 HTML 마크업 리턴
export const Default = () => {
  return htmlTemplate;
};
