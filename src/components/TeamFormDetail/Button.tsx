
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  formData: any;
  currentStep: number;
}


const Button = ({formData}: ButtonProps) => {
    const navigate = useNavigate();

    return (
        <div className="formContainer">
            <div className="formGroup">
                <button onClick={() => navigate('/Storge')}>임시등록</button>
                <button onClick={() => navigate('/Regist')}>등록하기</button>
            </div>
        </div>
    );
};

export default Button;