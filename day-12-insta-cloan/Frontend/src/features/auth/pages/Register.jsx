import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import AppLoader from '../../shared/AppLoader.jsx'
const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const { user, loading, handelRegister } = useAuth()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await handelRegister(username, email, password)
      navigate("/")
    } catch (requestError) {
      setError(requestError.response?.data?.message ?? "Could not create your account. Please try again.")
    }
  }

  if (user && !loading) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return <AppLoader />
  }

  return (
    <main className="auth-page">
      <div className="form-container">
        <h1>Register</h1>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <form onSubmit={submitHandler}>

          <input
            value={username}
            onInput={(e) => { setUsername(e.target.value) }}
            type="text"
            placeholder='Enter username'
            name="username"
            autoComplete='none'
            required
          />

          <input
            value={email}
            onInput={(e) => { setEmail(e.target.value) }}
            type="email"
            placeholder='Enter email'
            name="email"
            autoComplete='none'
            required
          />
          <input
            value={password}
            onInput={(e) => { setPassword(e.target.value) }}
            type="password"
            placeholder='Enter password'
            name="password"
            autoComplete='none'
            required
          />

          <button className="button btn-primary" type='submit'>Register</button>
          <p>Already have an account ? <Link to={"/"}>Login </Link></p>

        </form>
      </div>
    </main>
  )
}

export default Register
