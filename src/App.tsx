import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'

function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome!</h1>
      <button onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>
        로그인
      </button>
      <button onClick={() => navigate('/signup')}>
        회원가입
      </button>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}