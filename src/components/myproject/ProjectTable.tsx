import React from 'react';
import "../../App.css";


interface ProjectTableProps {
  title: string;
  headers: string[];
  children: React.ReactNode; // 테이블의 <tr>...</tr> 부분들이 이쪽으로 들어옵니다.
}

export default function ProjectTable({ title, headers, children }: ProjectTableProps) {
  return (
    <div>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}