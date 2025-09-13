import Header from "../layouts/Header";
import '../App.css';
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SideBox from "../components/ProjectPageDetail/SideBox";
import { techStacksInit } from "../styles/TechStack";
import "../pages/ProjectPage.css";


interface FilterState {
  selectedActivity: string[];
  selectedPositions: string[];
  selectedTechStacks: string[];
  selectedLocations: string[];
  selectedRegion: string;
  selectedProgress: string[];
  selectedMethod: string[];
  recruitEndDate: string;
  projectStartDate: string;
  projectEndDate: string;
}

// 더미 프로젝트 데이터
const dummyProjects = [
  {
    id: 1,
    title: "웹 개발 프로젝트 팀원 모집",
    author: "김한성",
    date: "2025.01.15",
    location: "서울 특별시",
    techStack: ["React","MongoDB"],
    positions: ["웹"],
    likes: 12,
    views: 45,
    description: "혁신적인 웹 서비스를 개발하는 프로젝트입니다. React와 Node.js를 사용하여 풀스택 개발을 진행합니다.",
    status: "모집중",
    teamSize: "3-5명",
    duration: "3-6개월",
    recruitCount: "2명",
    recruitPositions: ["프론트", "백"],
    recruitPeriod: "3개월",
    startDate: "2025.02.01",
    endDate: "2025.05.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.30"
  },
  {
    id: 2,
    title: "모바일 앱 개발자 구합니다",
    author: "이지은",
    date: "2025.01.14",
    location: "부산 광역시",
    techStack: ["Flutter", "Firebase"],
    positions: ["앱"],
    likes: 8,
    views: 32,
    description: "Flutter를 사용한 크로스 플랫폼 모바일 앱을 개발합니다. UI/UX에 관심 있는 개발자를 찾습니다.",
    status: "모집중",
    teamSize: "2-3명",
    duration: "2-4개월",
    recruitCount: "1명",
    recruitPositions: ["프론트"],
    recruitPeriod: "2개월",
    startDate: "2025.01.20",
    endDate: "2025.03.20",
    activityType: "앱",
    progress: "아이디어 기획 중",
    method: "온라인",
    recruitEndDate: "2025.01.25"
  },
  {
    id: 3,
    title: "AI 프로젝트 팀원 모집",
    author: "박민수",
    date: "2025.01.13",
    location: "대구 광역시",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    positions: ["앱"],
    likes: 15,
    views: 67,
    description: "머신러닝을 활용한 예측 모델을 개발하는 프로젝트입니다. 데이터 분석과 AI 모델링 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "6-12개월",
    recruitCount: "2명",
    recruitPositions: ["데이터", "백"],
    recruitPeriod: "6개월",
    startDate: "2025.02.15",
    endDate: "2025.08.15",
    activityType: "앱",
    progress: "개발 진행 중",
    method: "오프라인",
    recruitEndDate: "2025.02.10"
  },
  {
    id: 4,
    title: "게임 개발 프로젝트",
    author: "최영희",
    date: "2025.01.12",
    location: "인천 광역시",
    techStack: ["Unity", "C#"],
    positions: ["게임"],
    likes: 20,
    views: 89,
    description: "Unity를 사용한 3D 게임을 개발합니다. 게임 개발 경험이 있거나 열정이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-8명",
    duration: "8-12개월",
    recruitCount: "3명",
    recruitPositions: ["기획", "디자인"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    endDate: "2025.11.01",
    activityType: "게임",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.02.25"
  },
  {
    id: 5,
    title: "블록체인 프로젝트 팀원",
    author: "정현우",
    date: "2025.01.11",
    location: "광주 광역시",
    techStack: ["Solidity","React"],
    positions: ["앱"],
    likes: 6,
    views: 28,
    description: "이더리움 기반의 DApp을 개발하는 프로젝트입니다. 블록체인 기술에 관심 있는 개발자를 찾습니다.",
    status: "모집중",
    teamSize: "3-4명",
    duration: "4-8개월",
    contact: "jung@email.com",
    recruitCount: "2명",
    recruitPositions: ["프론트", "백"],
    recruitPeriod: "4개월",
    startDate: "2025.01.25",
    endDate: "2025.05.25",
    activityType: "앱",
    progress: "아이디어 기획 중",
    method: "온라인",
    recruitEndDate: "2025.01.20"
  },
  {
    id: 6,
    title: "데이터 분석 프로젝트",
    author: "한소영",
    date: "2025.01.10",
    location: "대전 광역시",
    techStack: ["Python"],
    positions: ["앱"],
    likes: 9,
    views: 41,
    description: "대용량 데이터를 분석하고 시각화하는 프로젝트입니다. 통계학적 지식과 데이터 분석 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "2-4명",
    duration: "3-6개월",
    contact: "han@email.com",
    recruitCount: "2명",
    recruitPositions: ["데이터", "기획"],
    recruitPeriod: "3개월",
    startDate: "2025.01.30",
    endDate: "2025.04.30",
    activityType: "앱",
    progress: "개발 진행 중",
    method: "오프라인",
    recruitEndDate: "2025.01.25"
  },
  {
    id: 7,
    title: "IoT 스마트홈 프로젝트",
    author: "김태현",
    date: "2025.01.09",
    location: "서울특별시",
    techStack: ["Arduino", "Raspberry Pi", "Python"],
    positions: ["웹"],
    likes: 14,
    views: 52,
    description: "IoT 센서를 활용한 스마트홈 시스템을 개발합니다. 하드웨어와 소프트웨어 모두 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "6-9개월",
    recruitCount: "3명",
    recruitPositions: ["프론트", "백", "기획"],
    recruitPeriod: "6개월",
    startDate: "2025.02.01",
    endDate: "2025.08.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.28"
  },
  {
    id: 8,
    title: "VR/AR 교육 콘텐츠",
    author: "박서연",
    date: "2025.01.08",
    location: "부산 광역시",
    techStack: ["Unity", "C#", "Blender"],
    positions: ["게임"],
    likes: 18,
    views: 73,
    description: "VR/AR을 활용한 교육 콘텐츠를 개발합니다. 3D 모델링과 게임 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-7명",
    duration: "8-12개월",
    recruitCount: "4명",
    recruitPositions: ["기획", "디자인", "프론트"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    endDate: "2025.11.01",
    activityType: "게임",
    progress: "아이디어 기획 중",
    method: "오프라인",
    recruitEndDate: "2025.02.28"
  },
  {
    id: 9,
    title: "클라우드 마이그레이션 프로젝트",
    author: "이준호",
    date: "2025.01.07",
    location: "대구 광역시",
    techStack: ["AWS", "Docker", "Kubernetes"],
    positions: ["웹"],
    likes: 11,
    views: 38,
    description: "기존 온프레미스 시스템을 클라우드로 마이그레이션하는 프로젝트입니다. 클라우드 인프라 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "3-5명",
    duration: "4-6개월",
    recruitCount: "2명",
    recruitPositions: ["백", "DevOps"],
    recruitPeriod: "4개월",
    startDate: "2025.02.15",
    endDate: "2025.06.15",
    activityType: "웹",
    progress: "개발 진행 중",
    method: "온라인",
    recruitEndDate: "2025.02.10"
  },
  {
    id: 10,
    title: "금융 앱 개발 프로젝트",
    author: "최민수",
    date: "2025.01.06",
    location: "서울특별시",
    techStack: ["React Native", "Node.js", "PostgreSQL"],
    positions: ["앱"],
    likes: 22,
    views: 91,
    description: "개인 금융 관리 앱을 개발합니다. 금융 도메인 지식과 모바일 앱 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "6-8개월",
    recruitCount: "3명",
    recruitPositions: ["프론트", "백", "기획"],
    recruitPeriod: "6개월",
    startDate: "2025.02.01",
    endDate: "2025.08.01",
    activityType: "앱",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.30"
  },
  {
    id: 11,
    title: "머신러닝 추천 시스템",
    author: "정수진",
    date: "2025.01.05",
    location: "인천 광역시",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    positions: ["앱"],
    likes: 16,
    views: 64,
    description: "사용자 행동 분석을 통한 개인화 추천 시스템을 개발합니다. ML/DL 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "3-4명",
    duration: "5-7개월",
    recruitCount: "2명",
    recruitPositions: ["데이터", "백"],
    recruitPeriod: "5개월",
    startDate: "2025.02.01",
    endDate: "2025.07.01",
    activityType: "앱",
    progress: "아이디어 기획 중",
    method: "온라인",
    recruitEndDate: "2025.01.28"
  },
  {
    id: 12,
    title: "실시간 채팅 앱",
    author: "김도현",
    date: "2025.01.04",
    location: "광주 광역시",
    techStack: ["React", "Socket.io", "MongoDB"],
    positions: ["웹"],
    likes: 13,
    views: 47,
    description: "실시간 채팅 기능이 있는 웹 애플리케이션을 개발합니다. 실시간 통신 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "3-4명",
    duration: "3-5개월",
    recruitCount: "2명",
    recruitPositions: ["프론트", "백"],
    recruitPeriod: "3개월",
    startDate: "2025.01.20",
    endDate: "2025.04.20",
    activityType: "웹",
    progress: "개발 진행 중",
    method: "온라인",
    recruitEndDate: "2025.01.18"
  },
  {
    id: 13,
    title: "E-커머스 플랫폼",
    author: "박지영",
    date: "2025.01.03",
    location: "대전 광역시",
    techStack: ["Vue.js", "Django", "MySQL"],
    positions: ["웹"],
    likes: 19,
    views: 76,
    description: "중소기업을 위한 온라인 쇼핑몰 플랫폼을 개발합니다. E-커머스 도메인 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-7명",
    duration: "8-10개월",
    recruitCount: "4명",
    recruitPositions: ["프론트", "백", "기획", "디자인"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    endDate: "2025.11.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.02.25"
  },
  {
    id: 14,
    title: "헬스케어 모니터링 앱",
    author: "이현우",
    date: "2025.01.02",
    location: "서울특별시",
    techStack: ["Flutter", "Firebase", "Python"],
    positions: ["앱"],
    likes: 17,
    views: 68,
    description: "건강 상태를 모니터링하는 모바일 앱을 개발합니다. 헬스케어 도메인과 모바일 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-5명",
    duration: "6-9개월",
    recruitCount: "3명",
    recruitPositions: ["프론트", "백", "기획"],
    recruitPeriod: "6개월",
    startDate: "2025.02.15",
    endDate: "2025.08.15",
    activityType: "앱",
    progress: "아이디어 기획 중",
    method: "온/오프라인",
    recruitEndDate: "2025.02.10"
  },
  {
    id: 15,
    title: "블록체인 NFT 마켓플레이스",
    author: "최성민",
    date: "2025.01.01",
    location: "부산 광역시",
    techStack: ["Solidity", "React", "Web3.js"],
    positions: ["웹"],
    likes: 25,
    views: 98,
    description: "NFT 거래를 위한 블록체인 기반 마켓플레이스를 개발합니다. 블록체인과 NFT 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "7-10개월",
    recruitCount: "3명",
    recruitPositions: ["프론트", "백", "기획"],
    recruitPeriod: "7개월",
    startDate: "2025.03.01",
    endDate: "2025.10.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온라인",
    recruitEndDate: "2025.02.25"
  },
  {
    id: 16,
    title: "소셜 미디어 분석 도구",
    author: "한지민",
    date: "2024.12.31",
    location: "대구 광역시",
    techStack: ["Python", "Django", "PostgreSQL"],
    positions: ["웹"],
    likes: 12,
    views: 43,
    description: "소셜 미디어 데이터를 분석하고 인사이트를 제공하는 웹 도구를 개발합니다. 데이터 분석 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "3-5명",
    duration: "5-7개월",
    recruitCount: "2명",
    recruitPositions: ["데이터", "백"],
    recruitPeriod: "5개월",
    startDate: "2025.01.15",
    endDate: "2025.06.15",
    activityType: "웹",
    progress: "개발 진행 중",
    method: "온라인",
    recruitEndDate: "2025.01.10"
  },
  {
    id: 17,
    title: "스마트 시티 IoT 플랫폼",
    author: "김준호",
    date: "2024.12.30",
    location: "서울특별시",
    techStack: ["Node.js", "MongoDB", "MQTT"],
    positions: ["웹"],
    likes: 20,
    views: 82,
    description: "스마트 시티를 위한 IoT 센서 데이터 수집 및 분석 플랫폼을 개발합니다. IoT와 빅데이터 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "6-8명",
    duration: "10-12개월",
    recruitCount: "4명",
    recruitPositions: ["백", "데이터", "기획", "DevOps"],
    recruitPeriod: "10개월",
    startDate: "2025.02.01",
    endDate: "2025.12.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.25"
  },
  {
    id: 18,
    title: "교육용 게임 개발",
    author: "박수진",
    date: "2024.12.29",
    location: "인천 광역시",
    techStack: ["Unity", "C#", "Photon"],
    positions: ["게임"],
    likes: 15,
    views: 59,
    description: "아이들을 위한 교육용 게임을 개발합니다. 게임 개발과 교육 콘텐츠 제작 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "6-8개월",
    recruitCount: "3명",
    recruitPositions: ["기획", "디자인", "프론트"],
    recruitPeriod: "6개월",
    startDate: "2025.01.20",
    endDate: "2025.07.20",
    activityType: "게임",
    progress: "아이디어 기획 중",
    method: "오프라인",
    recruitEndDate: "2025.01.15"
  },
  {
    id: 19,
    title: "자율주행 시뮬레이터",
    author: "이태민",
    date: "2024.12.28",
    location: "대전 광역시",
    techStack: ["Python", "OpenCV", "ROS"],
    positions: ["앱"],
    likes: 23,
    views: 95,
    description: "자율주행 차량을 위한 시뮬레이션 환경을 구축합니다. 컴퓨터 비전과 로보틱스 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-7명",
    duration: "8-12개월",
    recruitCount: "4명",
    recruitPositions: ["데이터", "백", "기획", "DevOps"],
    recruitPeriod: "8개월",
    startDate: "2025.02.01",
    endDate: "2025.10.01",
    activityType: "앱",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.25"
  },
  {
    id: 20,
    title: "음성 인식 AI 어시스턴트",
    author: "최유진",
    date: "2024.12.27",
    location: "서울특별시",
    techStack: ["Python", "TensorFlow", "FastAPI"],
    positions: ["앱"],
    likes: 21,
    views: 87,
    description: "한국어 음성 인식을 지원하는 AI 어시스턴트를 개발합니다. 음성 처리와 NLP 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-5명",
    duration: "7-9개월",
    recruitCount: "3명",
    recruitPositions: ["데이터", "백", "기획"],
    recruitPeriod: "7개월",
    startDate: "2025.02.15",
    endDate: "2025.09.15",
    activityType: "앱",
    progress: "아이디어 기획 중",
    method: "온라인",
    recruitEndDate: "2025.02.10"
  },
  {
    id: 21,
    title: "실시간 스트리밍 플랫폼",
    author: "김하늘",
    date: "2024.12.26",
    location: "부산 광역시",
    techStack: ["React", "Node.js", "WebRTC"],
    positions: ["웹"],
    likes: 18,
    views: 71,
    description: "실시간 비디오 스트리밍을 지원하는 웹 플랫폼을 개발합니다. 스트리밍 기술과 웹 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-6명",
    duration: "8-10개월",
    recruitCount: "3명",
    recruitPositions: ["프론트", "백", "DevOps"],
    recruitPeriod: "8개월",
    startDate: "2025.03.01",
    endDate: "2025.11.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.02.25"
  },
  {
    id: 22,
    title: "스마트 팜 IoT 시스템",
    author: "박민준",
    date: "2024.12.25",
    location: "대구 광역시",
    techStack: ["Arduino", "Python", "Django"],
    positions: ["웹"],
    likes: 14,
    views: 56,
    description: "농업 환경을 모니터링하고 자동화하는 IoT 시스템을 개발합니다. IoT와 농업 기술 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-5명",
    duration: "6-8개월",
    recruitCount: "2명",
    recruitPositions: ["백", "기획"],
    recruitPeriod: "6개월",
    startDate: "2025.02.01",
    endDate: "2025.08.01",
    activityType: "웹",
    progress: "개발 진행 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.25"
  },
  {
    id: 23,
    title: "의료진용 진료 관리 시스템",
    author: "이서연",
    date: "2024.12.24",
    location: "서울특별시",
    techStack: ["Vue.js", "Spring Boot", "MySQL"],
    positions: ["웹"],
    likes: 16,
    views: 63,
    description: "의료진이 환자 진료를 효율적으로 관리할 수 있는 시스템을 개발합니다. 의료 도메인과 웹 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "5-7명",
    duration: "9-12개월",
    recruitCount: "4명",
    recruitPositions: ["프론트", "백", "기획", "디자인"],
    recruitPeriod: "9개월",
    startDate: "2025.03.01",
    endDate: "2025.12.01",
    activityType: "웹",
    progress: "아이디어 구상 중",
    method: "온/오프라인",
    recruitEndDate: "2025.02.25"
  },
  {
    id: 24,
    title: "가상현실 부동산 투어",
    author: "정현수",
    date: "2024.12.23",
    location: "인천 광역시",
    techStack: ["Unity", "C#", "Oculus SDK"],
    positions: ["게임"],
    likes: 19,
    views: 78,
    description: "VR을 활용한 부동산 투어 애플리케이션을 개발합니다. VR/AR 개발과 3D 모델링 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-6명",
    duration: "7-9개월",
    recruitCount: "3명",
    recruitPositions: ["기획", "디자인", "프론트"],
    recruitPeriod: "7개월",
    startDate: "2025.02.15",
    endDate: "2025.09.15",
    activityType: "게임",
    progress: "아이디어 기획 중",
    method: "오프라인",
    recruitEndDate: "2025.02.10"
  },
  {
    id: 25,
    title: "스마트 웨어러블 헬스케어",
    author: "한지우",
    date: "2024.12.22",
    location: "대전 광역시",
    techStack: ["Flutter", "Firebase", "Python"],
    positions: ["앱"],
    likes: 17,
    views: 69,
    description: "스마트워치와 연동되는 헬스케어 모바일 앱을 개발합니다. 웨어러블 기술과 모바일 개발 경험이 있는 분을 찾습니다.",
    status: "모집중",
    teamSize: "4-5명",
    duration: "6-8개월",
    recruitCount: "2명",
    recruitPositions: ["프론트", "백"],
    recruitPeriod: "6개월",
    startDate: "2025.02.01",
    endDate: "2025.08.01",
    activityType: "앱",
    progress: "개발 진행 중",
    method: "온/오프라인",
    recruitEndDate: "2025.01.25"
  }
];

const ProjectPage = () => {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 페이지당 10개로 변경하여 페이지네이션을 더 쉽게 볼 수 있도록
  
  // 임시 필터 (사이드바에서 선택하는 필터)
  const [tempFilters, setTempFilters] = useState<FilterState>({
    selectedActivity: [],
    selectedPositions: [],
    selectedTechStacks: [],
    selectedLocations: [],
    selectedRegion: "서울특별시",
    selectedProgress: [],
    selectedMethod: [],
    recruitEndDate: "",
    projectStartDate: "",
    projectEndDate: ""
  });

  // 디버깅용: tempFilters 변경 감지 (useEffect로 이동)
  // console.log('ProjectPage tempFilters:', tempFilters); // 디버깅용
  
  // 적용된 필터 (실제로 프로젝트를 필터링하는 필터)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    selectedActivity: [],
    selectedPositions: [],
    selectedTechStacks: [],
    selectedLocations: [],
    selectedRegion: "서울특별시",
    selectedProgress: [],
    selectedMethod: [],
    recruitEndDate: "",
    projectStartDate: "",
    projectEndDate: ""
  });
  
  const navigate = useNavigate();

  // 필터링 로직
  const filteredProjects = useMemo(() => {
    return dummyProjects.filter(project => {
      // 검색어 필터링
      const matchesSearch = appliedSearchTerm === "" || 
        project.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        project.techStack.some(tech => tech.toLowerCase().includes(appliedSearchTerm.toLowerCase()));

      // 플랫폼 필터링
      const matchesActivity = appliedFilters.selectedActivity.length === 0 || 
        appliedFilters.selectedActivity.includes(project.activityType);

      // 모집 직군 필터링
      const matchesPositions = appliedFilters.selectedPositions.length === 0 || 
        appliedFilters.selectedPositions.some(pos => project.recruitPositions.includes(pos));

      // 기술 스택 필터링
      const matchesTechStack = appliedFilters.selectedTechStacks.length === 0 || 
        appliedFilters.selectedTechStacks.some(tech => project.techStack.includes(tech));

      // 위치 필터링
      const matchesLocation = appliedFilters.selectedLocations.length === 0 || 
        appliedFilters.selectedLocations.includes(project.location);

      // 진행 상황 필터링
      const matchesProgress = appliedFilters.selectedProgress.length === 0 || 
        appliedFilters.selectedProgress.includes(project.progress);

      // 진행 방식 필터링
      const matchesMethod = appliedFilters.selectedMethod.length === 0 || 
        appliedFilters.selectedMethod.includes(project.method);

      // 모집 종료 기한 필터링
      const matchesRecruitEndDate = appliedFilters.recruitEndDate === "" || 
        new Date(project.recruitEndDate) >= new Date(appliedFilters.recruitEndDate);

      // 프로젝트 기간 필터링
      const matchesProjectDate = (appliedFilters.projectStartDate === "" && appliedFilters.projectEndDate === "") ||
        (appliedFilters.projectStartDate === "" || new Date(project.startDate) >= new Date(appliedFilters.projectStartDate)) &&
        (appliedFilters.projectEndDate === "" || new Date(project.endDate) <= new Date(appliedFilters.projectEndDate));

      return matchesSearch && matchesActivity && matchesPositions && matchesTechStack && 
             matchesLocation && matchesProgress && matchesMethod && matchesRecruitEndDate && matchesProjectDate;
    });
  }, [appliedSearchTerm, appliedFilters]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 필터나 검색어가 변경될 때 첫 페이지로 이동
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // 검색 핸들러
  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    resetToFirstPage();
  };
  // 엔터키 검색 핸들러
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 카드 클릭 핸들러
  const handleCardClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  // 좋아요 토글
  const handleLikeClick = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    setLikedProjects(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(projectId)) {
        newLiked.delete(projectId);
      } else {
        newLiked.add(projectId);
      }
      return newLiked;
    });
  };

  // 필터 적용 함수
  const handleApplyFilters = useCallback(() => {
    setAppliedFilters(tempFilters);
    setIsOptionOpen(false); // 사이드바 닫기
    resetToFirstPage();
  }, [tempFilters]);

  // 필터 초기화 함수
  const handleResetFilters = useCallback(() => {
    const emptyFilters: FilterState = {
      selectedActivity: [],
      selectedPositions: [],
      selectedTechStacks: [],
      selectedLocations: [],
      selectedRegion: "서울특별시",
      selectedProgress: [],
      selectedMethod: [],
      recruitEndDate: "",
      projectStartDate: "",
      projectEndDate: ""
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    resetToFirstPage();
  }, []);

  // tempFilters 업데이트 함수를 메모이제이션
  const handleTempFiltersChange = useCallback((filters: FilterState | ((prev: FilterState) => FilterState)) => {
    setTempFilters(filters);
  }, []);

  return (
    <div style={{ padding: "4rem 0" }}>
      <Header />
      <div className="ProjectWrapper">
      <div className="horizontal-section">
        <section className="half-section">
          <h2><span className="emoji">✨</span>요즘 인기있는 프로젝트</h2>
          <div className="card-container">
            {dummyProjects.slice(0, 2).map(project => (
              <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
                <h3>{project.title}</h3>
                <div className="info">
                  {project.author}<br />
                  {project.date}<br />
                  <span className="tech-icons">
                    {project.techStack.slice(0, 3).map(tech => {
    const stack = techStacksInit.find(item => item.value === tech);
    return stack ? (
      <img 
        key={tech} 
        src={stack.icon} 
        alt={stack.label} 
        title={stack.label} 
        className="tech-icon-img"
      />
    ) : (
      <span key={tech}>🔧 {tech}</span> // 매칭 실패 시 fallback
    );
  })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="half-section">
          <h2><span className="emoji">🔥</span>최근 핫한 게시물</h2>
          <div className="card-container">
            {dummyProjects.slice(2, 4).map(project => (
              <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
                <h3>{project.title}</h3>
                <div className="info">
                  {project.author}<br />
                  좋아요 {project.likes}개<br />
                  조회수 {project.views}회
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <hr className="divider_1"/>

      <div className="section">
        <div className="Minisection">
        <div className="Option" onClick={() => setIsOptionOpen(true)}>
          <img src="/Option.png" alt="옵션" />
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="제목, 내용을 검색하세요..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-btn" onClick={handleSearch}>
            검색
          </button>
        </div>
        </div>

        <div className="card-container">
          {currentProjects.map(project => (
            <div key={project.id} className="card" onClick={() => handleCardClick(project.id)}>
              <h3>
                {project.title} 
                <span 
                  className={`heart ${likedProjects.has(project.id) ? 'liked' : ''}`}
                  onClick={(e) => handleLikeClick(e, project.id)}
                >
                  {likedProjects.has(project.id) ? '♥' : '♡'}
                </span>
              </h3>
              <div className="info">
                {project.author}<br />
                {project.date}<br />
                📍 {project.location}<br />
                <span className="tech-icons">
                  {project.techStack.map(tech => {
    const stack = techStacksInit.find(item => item.value === tech);
    return stack ? (
      <img 
        key={tech} 
        src={stack.icon} 
        alt={stack.label} 
        title={stack.label} 
        className="tech-icon-img"
      />
    ) : (
      <span key={tech}>🔧 {tech}</span> // 매칭 실패 시 fallback
    );
  })}
                </span><br />
                👥 {project.positions.join(', ')}
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* 페이지네이션 UI */}
        {filteredProjects.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              총 {filteredProjects.length}개의 프로젝트 중 {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)}개 표시
            </div>
            <div className="pagination">
              <button 
                className="pagination-nav-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-nav-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          </div>
        )}

        <SideBox 
          isOpen={isOptionOpen} 
          onClose={() => setIsOptionOpen(false)}
          filters={tempFilters}
          onFiltersChange={handleTempFiltersChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
