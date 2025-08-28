import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Platform } from '../../components/PlatformEnum';
import ProjectTable from '../../components/myproject/ProjectTable';
import "../../App.css";

interface Project_table {
  id: bigint;
  project_name: string;
  owner_id: string;
  platform: Platform;
  role: string;
  start_date: string;
  end_date: string;
  status: 'ongoing' | 'completed';
  type?: string;
  stack?: string;
  isComplete?: boolean;
}

// JSON 원본 타입 (id, platform이 아직 변환 전 상태)
type RawProject = Omit<Project_table, 'id' | 'platform'> & {
  id: string | number;
  platform: string;
};

function toPlatform(v: string): Platform {
  switch (v) {
    case 'WEB': return Platform.WEB;
    case 'APP': return Platform.APP;
    case 'GAME': return Platform.GAME;
    case 'ETC': return Platform.ETC;
    default: throw new Error(`Unknown platform: ${v}`);
  }
}

export default function MyProjectMain() {
  const [projects, setProjects] = useState<Project_table[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchProjects = async () => {
      try {
        const response = await fetch('/mocks/my-projects.json');
        const data = (await response.json()) as RawProject[];

        const formatted: Project_table[] = data.map(p => ({
          ...p,
          id: BigInt(p.id),
          platform: toPlatform(p.platform),
        }));

        if (!cancelled) setProjects(formatted);
      } catch (err) {
        console.error("Error fetching my projects:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProjects();
    return () => { cancelled = true; };
  }, []);

  const handleProjectClick = (id: bigint) => {
    navigate(`/project/${id.toString()}`);
  };

  const ongoing = useMemo(
    () => projects.filter((p) => p.status === 'ongoing'),
    [projects]
  );

  const completed = useMemo(
    () => projects.filter((p) => p.status === 'completed'),
    [projects]
  );

  if (loading) {
    return <div>프로젝트 목록을 불러오는 중...</div>;
  }

  // 공통 행 렌더링 함수
  const renderRow = (project: Project_table, isCompleted: boolean) => (
    <tr key={project.id.toString()}>
      <td>
        <button
          onClick={() => handleProjectClick(project.id)}
          className="project-link"
        >
          {project.project_name}
        </button>
      </td>
      <td>{project.owner_id}</td>
      <td>{project.platform}</td>
      <td>{project.role}</td>
      <td>{project.start_date}</td>
      {isCompleted && <td>{project.end_date}</td>}
      <td>{isCompleted ? (project.isComplete ? '완료' : '미완료') : '진행중'}</td>
    </tr>
  );

  return (
    <div className="myproject-container">
      <ProjectTable
        title="내가 진행중인 프로젝트"
        headers={['프로젝트 이름', '팀장', '플랫폼', '직군', '프로젝트 시작일', '진행 상태']}
      >
        {ongoing.map((p) => renderRow(p, false))}
      </ProjectTable>

      <ProjectTable
        title="내가 완료한 프로젝트"
        headers={['프로젝트 이름', '팀장', '플랫폼', '직군', '프로젝트 시작일', '프로젝트 마감일', '진행 상태']}
      >
        {completed.map((p) => renderRow(p, true))}
      </ProjectTable>
    </div>
  );
}
