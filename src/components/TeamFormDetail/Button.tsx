import { useNavigate } from "react-router-dom";

interface ButtonProps {
  formData: any;
  currentStep: number;
  disabled: boolean;
}

const Button = ({ formData, currentStep, disabled }: ButtonProps) => {
  const navigate = useNavigate();

  return (
    <div className="formContainer_B">
      <div className="formGroup_B">
        <button onClick={() => navigate("/Storge")}>임시등록</button>
        <button
          onClick={() => navigate("/Regist")}
          className={`submitBtn ${disabled ? "disabled" : ""}`}
          disabled={disabled}
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default Button;
