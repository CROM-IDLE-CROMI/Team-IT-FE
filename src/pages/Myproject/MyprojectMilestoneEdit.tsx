import React, { useState } from "react";
import "../../App.css";

interface Milestone {
  id: number;
  task: string;
  owner: string;
  deadline: string;
  progress: string;
}

const MyprojectMilestoneEdit: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: 1, task: "밥먹기", owner: "...", deadline: "...", progress: "100%" },
    { id: 2, task: "잠자기", owner: "...", deadline: "...", progress: "80%" },
    { id: 3, task: "여행가기", owner: "...", deadline: "...", progress: "..." },
    { id: 4, task: "본가가기", owner: "...", deadline: "...", progress: "..." },
  ]);

  // 행 삭제
  const handleDelete = (id: number) => {
    if (window.confirm("정말로 이 마일스톤을 삭제하시겠습니까?")) {
      setMilestones(milestones.filter((m) => m.id !== id));
    }
  };

  // 행 추가
  const handleAddRow = () => {
    const newMilestone: Milestone = {
      id: Date.now(),
      task: "",
      owner: "",
      deadline: "",
      progress: "",
    };
    setMilestones([...milestones, newMilestone]);
  };

  return (
    <div className="milestone-edit-container">
      <table className="milestone-edit-table">
        <thead>
          <tr>
            <th></th>
            <th>항목</th>
            <th>담당자</th>
            <th>데드라인</th>
            <th>진척도</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((milestone) => (
            <tr key={milestone.id}>
              <td>
                <button
                  className="milestone-delete-btn"
                  onClick={() => handleDelete(milestone.id)}
                >X</button>
              </td>
              <td>
                <input
                  type="text"
                  value={milestone.task}
                  onChange={(e) =>
                    setMilestones(
                      milestones.map((m) =>
                        m.id === milestone.id ? { ...m, task: e.target.value } : m
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={milestone.owner}
                  onChange={(e) =>
                    setMilestones(
                      milestones.map((m) =>
                        m.id === milestone.id ? { ...m, owner: e.target.value } : m
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={milestone.deadline}
                  onChange={(e) =>
                    setMilestones(
                      milestones.map((m) =>
                        m.id === milestone.id ? { ...m, deadline: e.target.value } : m
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={milestone.progress}
                  onChange={(e) =>
                    setMilestones(
                      milestones.map((m) =>
                        m.id === milestone.id ? { ...m, progress: e.target.value } : m
                      )
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="milestone-add-btn" onClick={handleAddRow}>
        줄 추가하기
      </button>
    </div>
  );
};

export default MyprojectMilestoneEdit;
