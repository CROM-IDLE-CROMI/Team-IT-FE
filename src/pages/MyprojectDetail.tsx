import { useParams } from 'react-router-dom';

export default function ProjectDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>프로젝트 상세 페이지</h1>
      <p>프로젝트 ID: {id}</p>
      {/* 여기에 프로젝트 정보 API를 통해 상세 내용 불러오기 */}
    </div>
  );
}
