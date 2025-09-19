import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Member } from "../../types/project";

const MyprojectMemberEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/mocks/project-${id}.json`)
      .then((res) => res.json())
      .then((data: { members?: Member[] }) => {
        setMembers(data.members || []);
      })
      .catch((err) => {
        console.error("멤버 데이터를 불러오는 데 실패했습니다:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);


  const handleRemove = (id: number) => {
    if (window.confirm("정말로 이 멤버를 삭제하시겠습니까?")) {
      setMembers((prev) => prev.filter((member) => member.id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="member-edit-container">
      {/* 팀장 위임하기 버튼 */}
      <div className="member-edit-leader-btn-wrapper">
        <button
          onClick={() => navigate(`/myproject/${id}/member/edit/change-leader`)}
          className="member-edit-leader-btn"
        >
          팀장 위임하기
        </button>
      </div>

      {/* 멤버 테이블 */}
      <table className="member-edit-table">
        <thead>
          <tr>
            <th>닉네임</th>
            <th>이메일</th>
            <th>직군</th>
            <th>기술 스택</th>
            <th>개발자 평점</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => (
              <tr key={member.id}>
                <td>{member.nickname}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>{member.techStack}</td>
                <td>{member.rating}</td>
                <td>
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="member-edit-remove-btn"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>등록된 멤버가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 하단 수정/취소 버튼 */}
      <div className="member-edit-bottom-btns">
        <button className="member-edit-save-btn">수정 완료</button>
        <button onClick={() => navigate(-1)} className="member-edit-cancel-btn">
          취소
        </button>
      </div>
    </div>
  );
};

export default MyprojectMemberEdit;
