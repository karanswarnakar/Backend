import "../style/form.scss"
import { Link } from "react-router"
import axios from 'axios'
import { useState } from "react"


const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function submitHandler(e) {
    e.preventDefault()

    axios.post("http://localhost:3000/api/auth/register", {
      username, email, password
    },{
      withCredentials: true
    })
    .then(res => {
      console.log(res.data)
    })
  }


  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            required
            autoComplete="none"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
            }}
          />
          <input
            type="text"
            name="email"
            placeholder="Enter your email" required
            autoComplete="none"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            required
            autoComplete="none"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />

          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register
