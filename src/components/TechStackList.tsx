import React from "react";

interface TechStack {
  value: string;
  label: string;
  icon: string;
}

interface TechStackListProps {
  techStacksInit: TechStack[];
  selectedTechStacks: TechStack[];
  toggleTechStack: (stack: TechStack) => void;
}

const TechStackList: React.FC<TechStackListProps> = ({
  techStacksInit,
  selectedTechStacks,
  toggleTechStack,
}) => {
  return (
    <div className="techStackBox">
      <div className="techStackListWrapper">
        <div className="stackCategory">
          {techStacksInit.map((stack) => {
            const isSelected = selectedTechStacks.some(
              (item) => item.value === stack.value
            );
            return (
              <div
                key={stack.value}
                className={`techStackItem ${isSelected ? "selected" : ""}`}
                onClick={() => toggleTechStack(stack)}
              >
                <img src={stack.icon} alt={stack.label} />
                <span>{stack.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechStackList;
