
const Situation = () =>{
    return (
<div className="formContainer">
      <div className="formGroup">
        <label>제목:</label>
        <input type="text" />
      </div>
      
      <div className="formGroup">
        <label>프로젝트 진행 상황:</label>
        <select>
            <option>선택</option>
            <option>아이디어 구상 단계</option>
            <option>아이디어 기획 단계</option>
            <option>계발 진행 중</option>
        </select>
      </div>

      <div className="formGroup">
        <label>모집글 본문:</label>
        <input type='text'/>
      </div>

</div>
    );

};

export default Situation;