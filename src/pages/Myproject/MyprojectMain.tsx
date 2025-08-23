import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Platform } from '../../components/PlatformEnum';
import ProjectTable from '../../components/myproject/ProjectTable';
import "../../App.css";


interface Project_table {
  id: bigint;
  project_name: string;
  owner_id: string;
  platform: Platform; // ENUM type, components/PlatformEnum에서 정의함
  role: string;
  start_date: string;
  end_date: string;
  status: 'ongoing' | 'completed';
  type?: string;
  stack?: string;
  isComplete?: boolean;
}

export default function MyProjectMain() {
  const [projects, setProjects] = useState<Project_table[]>([]);
  const navigate = useNavigate();

  // 나중에 api 호출로 대체
  useEffect(() => {
    const mockData: Project_table[] = [
      {
        id: 1n,
        project_name: 'React 팀 프로젝트',
        owner_id: '홍길동',
        platform: Platform.WEB,
        role: 'Frontend',
        start_date: '2025-06-01',
        end_date: '',
        status: 'ongoing',
      },
      {
        id: 2n,
        project_name: 'Vue 팀 프로젝트',
        owner_id: '김철수',
        platform: Platform.WEB,
        role: 'Backend',
        start_date: '2025-03-15',
        end_date: '2025-06-25',
        status: 'completed',
        type: '앱 개발',
        stack: 'Node.js, MongoDB',
        isComplete: true,
      },
    ];
    setProjects(mockData);
  }, []);

  const handleProjectClick = (id: bigint) => {
    navigate(`/project/${id.toString()}`);
  };

    // useMemo를 사용해 불필요한 필터링 연산을 방지합니다.
  const ongoing = useMemo(
    () => projects.filter((p) => p.status === 'ongoing'),
    [projects]
  );
  const completed = useMemo(
    () => projects.filter((p) => p.status === 'completed'),
    [projects]
  );

  return (
    <div className="myproject-container">
      <ProjectTable
        title="내가 진행중인 프로젝트"
        headers={['프로젝트 이름', '팀장', '플랫폼', '직군', '프로젝트 시작일', '진행 상태']}
      >
        {ongoing.map((project) => (
          <tr key={project.id.toString()}>
            <td>
              <button onClick={() => handleProjectClick(project.id)} className="project-link">
                {project.project_name}
              </button>
            </td>
            <td>{project.owner_id}</td>
            <td>{project.platform}</td>
            <td>{project.role}</td>
            <td>{project.start_date}</td>
            <td>진행중</td>
          </tr>
        ))}
      </ProjectTable>

      <ProjectTable
        title="내가 완료한 프로젝트"
        headers={['프로젝트 이름', '팀장', '플랫폼', '직군', '프로젝트 시작일', '프로젝트 마감일', '진행 상태']}
      >
        {completed.map((project) => (
          <tr key={project.id.toString()}>
            <td>
              <button onClick={() => handleProjectClick(project.id)} className="project-link">
                {project.project_name}
              </button>
            </td>
            <td>{project.owner_id}</td>
            <td>{project.platform}</td>
            <td>{project.role}</td>
            <td>{project.start_date}</td>
            <td>{project.end_date}</td>
            <td>{project.isComplete ? '완료' : '미완료'}</td>
          </tr>
        ))}
      </ProjectTable>
    </div>
  );
}