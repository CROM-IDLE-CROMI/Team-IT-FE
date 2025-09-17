import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Member {
  id: number;
  nickname: string;
  email: string;
  position: string;
  techStack: string;
}

const MemberChangeLeader: React.FC = () => {
  const navigate = useNavigate();

  const [members] = useState<Member[]>([
    { id: 1, nickname: "크롱", email: "...", position: "...", techStack: "..." },
    { id: 2, nickname: "어한명", email: "...", position: "...", techStack: "..." },
    { id: 3, nickname: "줌니", email: "...", position: "...", techStack: "..." },
    { id: 4, nickname: "김1성수령", email: "...", position: "...", techStack: "..." },
  ]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [newLeader, setNewLeader] = useState<Member | null>(null);
  const { id } = useParams<{ id: string }>();

  const handleSave = () => {
    if (selectedId === null) {
      alert("팀장을 위임할 멤버를 선택해주세요.");
      return;
    }

    const selectedMember = members.find((m) => m.id === selectedId);

    if (window.confirm(`정말로 ${selectedMember?.nickname}님에게 팀장을 위임하시겠습니까?`)) {
      setNewLeader(selectedMember || null);
    }
  };

  return (
    <div className="change-leader-container">
      {/* 팀장 위임 전 */}
      {!newLeader && (
        <>
          <table className="change-leader-table">
            <thead>
              <tr>
                <th></th>
                <th>닉네임</th>
                <th>이메일</th>
                <th>직군</th>
                <th>기술 스택</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <input
                      type="radio"
                      name="leader"
                      checked={selectedId === member.id}
                      onChange={() => setSelectedId(member.id)}
                    />
                  </td>
                  <td>{member.nickname}</td>
                  <td>{member.email}</td>
                  <td>{member.position}</td>
                  <td>{member.techStack}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="change-leader-btns">
            <button onClick={handleSave} className="change-leader-save-btn">
              저장
            </button>
            <button
              onClick={() => navigate(-1)}
              className="change-leader-cancel-btn"
            >
              취소
            </button>
          </div>
        </>
      )}

      {/* 팀장 위임 후 결과 */}
      {newLeader && (
        <div className="change-leader-result-container">
          <h2 className="change-leader-title">팀장 위임 완료</h2>
          <p className="change-leader-message">
            새로운 팀장은 <strong>{newLeader.nickname}</strong>님입니다.
          </p>
          <button
            onClick={() => navigate(`/myproject/${id}`)}
            className="change-leader-back-btn"
          >
            마이 프로젝트로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberChangeLeader;
