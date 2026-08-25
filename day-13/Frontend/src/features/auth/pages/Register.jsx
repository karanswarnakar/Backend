import { useEffect, useState } from "react"
import InputField from "../components/InputField"
import "../style/form.scss"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import PageLoader from "../../components/PageLoader"

const Register = () => {

    const { lodding, handelRegister } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitHandler = async (e) => {
        e.preventDefault()
        await handelRegister({ username, email, password })

        navigate("/")
    }

    if (lodding) {
        return (
            <main>
                <PageLoader/>
            </main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={submitHandler}>
                    <InputField
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                    />
                    <InputField
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <InputField
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <button className="btn btn-primary">Register</button>
                </form>
                <p>Already have an account <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
