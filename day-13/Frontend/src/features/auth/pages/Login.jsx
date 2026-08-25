import { Link, useNavigate } from "react-router"
import InputField from "../components/InputField"
import "../style/form.scss"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import PageLoader from "../../components/PageLoader"
const Login = () => {
    const { lodding, handelLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")



    const submitHandler = async (e) => {
        e.preventDefault()
        await handelLogin({ email, password })

        navigate("/")
    }

    if (lodding) {
        return (
            <main>
                <PageLoader />
            </main>
        )
    }


    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={submitHandler}>
                    <InputField
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <InputField
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />

                    <button className="btn btn-primary">Login</button>
                </form>
                <p>Dont have an account <Link to={"/register"}>Register</Link></p>


            </div>
        </main>
    )
}

export default Login
