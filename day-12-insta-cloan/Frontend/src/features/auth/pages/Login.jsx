import React, { useState } from 'react'
import { Link, useNavigate } from "react-router"
import "../style/form.scss"
import { useAuth } from '../hooks/useAuth'
const Login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const { user, loading, handelLogin } = useAuth()

 

  const submitHandler = async (e) => {
    e.preventDefault()
    await handelLogin(username, password)

    navigate("/")
  }
 if (loading) {
    return (
      <main>
        <h1 className='loading'>loading...</h1>
      </main>
    )
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={submitHandler}>

          <input
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            type="text"
            placeholder='Enter username'
            name="username"
            autoComplete='none'
            required
          />
          <input
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            type="password"
            placeholder='Enter password'
            name="password"
            autoComplete='none'
            required
          />

          <button className="button btn-primary" type='submit'>Login</button>
          <p>Don'n have account ? <Link to={"/register"}>Create Account</Link></p>
        </form>
      </div>
    </main>
  )
}

export default Login
