import React, { useState } from "react";

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
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (stackValue: string) => {
    setImageErrors(prev => new Set(prev).add(stackValue));
  };

  return (
    <div className="techStackBox">
      <div className="techStackListWrapper">
        <div className="stackCategory">
          {techStacksInit.map((stack) => {
            const isSelected = selectedTechStacks.some(
              (item) => item.value === stack.value
            );
            const hasImageError = imageErrors.has(stack.value);
            
            return (
              <div
                key={stack.value}
                className={`techStackItem ${isSelected ? "selected" : ""}`}
                onClick={() => toggleTechStack(stack)}
              >
                {!hasImageError ? (
                  <img 
                    src={stack.icon} 
                    alt={stack.label}
                    onError={() => handleImageError(stack.value)}
                    onLoad={() => {
                      console.log(`Successfully loaded icon for ${stack.label}:`, stack.icon);
                    }}
                  />
                ) : (
                  <div className="fallback-icon">🔧</div>
                )}
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
