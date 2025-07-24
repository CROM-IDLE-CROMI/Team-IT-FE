import Header from "../layouts/Header";
import "../App.css";
import { Link } from "react-router-dom";

const MyProject = () => {
  return (
    <div className="my-project-container">
      <Header />

      <div className="project-section">
        <h2>내가 참여 중인 프로젝트</h2>
        <table className="project-table">
          <thead>
            <tr>
              <th>프로젝트명</th>
              <th>팀장</th>
              <th>플랫폼</th>
              <th>직군</th>
              <th>시작일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link to="/projects/1" className="project-link">
                  Team-IT
                </Link>
              </td>
              <td>Pororo</td>
              <td>Web</td>
              <td>FE</td>
              <td>2025-07-01</td>
              <td><span className="status ongoing">진행중</span></td>
            </tr>
            <tr>
              <td>
                <Link to="/projects/2" className="project-link">
                  Crom-Idle
                </Link>
              </td>
              <td>Crong</td>
              <td>App</td>
              <td>BE</td>
              <td>2025-08-01</td>
              <td><span className="status recruiting">모집중</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="project-section">
        <h2>내가 완료한 프로젝트</h2>
        <table className="project-table">
          <thead>
            <tr>
              <th>프로젝트명</th>
              <th>팀장</th>
              <th>직군</th>
              <th>기술 스택</th>
              <th>프로젝트 완료일</th>
              <th>완성여부</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Link to="/projects/1" className="project-link">
                  집 보내줘요요
                </Link>
              </td>
              <td>rlagtjd</td>
              <td>백엔드</td>
              <td>파이썬</td>
              <td>2025-07-12</td>
              <td><span className="status ongoing">완료</span></td>
            </tr>
            <tr>
              <td>
                <Link to="/projects/2" className="project-link">
                  살려주세요
                </Link>
              </td>
              <td>whqls</td>
              <td>프론트엔드</td>
              <td>TypeScript</td>
              <td>2025-02-11</td>
              <td><span className="status recruiting">완료</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyProject;
