
const WorkEnviron = () =>{
    return (
    <div className="formContainer">
<div className="formGroup">
<label>회의 방식:</label>
<select>
    <option>선택</option>
    <option>온라인</option>
    <option>오프라인</option>
    <option>온.오프라인</option>
</select>
</div>

<div className="formGroup">
<label>위치:</label>
<select>
    <option> 선택</option>
</select>
</div>


    </div>
    );
};

export default WorkEnviron;