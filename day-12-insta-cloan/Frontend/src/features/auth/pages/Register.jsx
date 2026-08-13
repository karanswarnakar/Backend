import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const { user, loading, handelRegister } = useAuth()


  const submitHandler = async (e) => {
    e.preventDefault()
    await handelRegister(username, email, password)
    navigation("/login")
  }


  if (loading) {
    return (<main>
      <h1 className='loading'>Loading.....</h1>
    </main>)
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
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
          <p>Already have an account ? <Link to={"/login"}>Login </Link></p>

        </form>
      </div>
    </main>
  )
}

export default Register
