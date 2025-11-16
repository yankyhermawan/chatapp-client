import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Login } from './login/Login'
import Layout from './Layout'
import { Register } from './register/Register'
import { Room } from './room/Room'

const App = () => {
  return (
    <Layout>
      <Router>
        <Routes>
          <Route Component={Room} path="/" />
          <Route Component={Login} path="/login" />
          <Route Component={Register} path="/register" />
        </Routes>
      </Router>
    </Layout>
  )
}

export default App
