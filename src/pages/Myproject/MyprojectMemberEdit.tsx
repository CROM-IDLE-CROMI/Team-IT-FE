import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Member {
  id: number;
  nickname: string;
  email: string;
  position: string;
  techStack: string;
  rating: string;
}

const MyprojectMemberEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [members, setMembers] = useState<Member[]>([
    { id: 1, nickname: "크롱", email: "...", position: "...", techStack: "...", rating: "..." },
    { id: 2, nickname: "어한명", email: "...", position: "...", techStack: "...", rating: "..." },
    { id: 3, nickname: "줌니", email: "...", position: "...", techStack: "...", rating: "..." },
    { id: 4, nickname: "김1성수령", email: "...", position: "...", techStack: "...", rating: "..." },
  ]);

  const handleRemove = (id: number) => {
    if (window.confirm("정말로 이 멤버를 삭제하시겠습니까?")) {
      setMembers(members.filter((member) => member.id !== id));
    }
  };

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
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.nickname}</td>
              <td>{member.email}</td>
              <td>{member.position}</td>
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
          ))}
        </tbody>
      </table>

      {/* 하단 수정/취소 버튼 */}
      <div className="member-edit-bottom-btns">
        <button className="member-edit-save-btn">수정 완료</button>
        <button
          onClick={() => navigate(-1)}
          className="member-edit-cancel-btn"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default MyprojectMemberEdit;
