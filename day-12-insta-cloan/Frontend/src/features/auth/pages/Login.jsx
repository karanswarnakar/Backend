import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from "react-router"
import "../style/form.scss"
import { useAuth } from '../hooks/useAuth'
const Login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const { user, loading, handelLogin } = useAuth()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await handelLogin(username, password)
      navigate("/")
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Could not log in. Please try again.")
    }
  }

  if (user && !loading) {
    return <Navigate to="/" replace />
  }

 if (loading) {
    return (
      <main className="auth-page">
        <h1 className='loading'>loading...</h1>
      </main>
    )
  }
  return (
    <main className="auth-page">
      <div className="form-container">
        <h1>Login</h1>
        {error && <p className="auth-error" role="alert">{error}</p>}
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
