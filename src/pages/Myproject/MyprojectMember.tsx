import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectSidebar from '../../components/myproject/ProjectSidebar';
import '../../App.css';

import type { ProjectData } from '../../types/project';
import type { MemberData } from '../../types/member';


// --- 더미 데이터 ---
const dummyProject: ProjectData = {
  id: 1,
  title: 'TEAM-IT 프로젝트',
  status: 'ONGOING',
  description: '이 프로젝트는 TEAM-IT의 협업 프로젝트입니다.',
  progress: 50,
  recruit_positions: [],
  required_stacks: [],
  members: [],
  milestones: [],
  logoUrl: 'https://placehold.co/180x180/EFEFEF/333?text=Logo',
};

const dummyMembers: MemberData[] = [
  { id: 1, nickname: '크롱', email: '...', role: '...', techStack: '...', rating: 4.56 },
  { id: 2, nickname: '어난가', email: '...', role: '...', techStack: '...', rating: 3.45 },
  { id: 3, nickname: '졈니', email: '...', role: '...', techStack: '...', rating: 2.34 },
  { id: 4, nickname: '김1성', email: '...', role: '...', techStack: '...', rating: 1.23 },
];

export default function MyprojectMember() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProject(dummyProject);
      setMembers(dummyMembers);
      setLoading(false);
    }, 50);
  }, [id]);

  const handleGoBack = () => nav(`/myproject/${id}`);
  const handleEdit = () => nav(`/myproject/${id}/member/edit`);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found.</div>;

  return (
    <div className="myproject-layout">
      <ProjectSidebar
        project={{
          id: project.id,
          title: project.title,
          status: project.status,
          logoUrl: project.logoUrl,
        }}
      />        
      <main className="project-main-content">
        <div className="content-header">
          <button className="back-button" onClick={handleGoBack}>← 돌아가기</button>
          <button className="edit-button" onClick={handleEdit}>수정하기</button>
        </div>
        <div className="card_1">
        <table className="member-table">
            <thead>
            <tr>
                <th>닉네임</th>
                <th>이메일</th>
                <th>직군</th>
                <th>기술 스택</th>
                <th>개발자 평점</th>
            </tr>
            </thead>
            <tbody>
            {members.map((member) => (
                <tr key={member.id}>
                <td>{member.nickname}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>{member.techStack}</td>
                <td>{member.rating.toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </main>
    </div>
  );
}
