import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Register.css";

const Register = () => {
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !repeatPassword) {
            toast.info("Todos os campos são obrigatórios!");
            return;
        }

        if (!emailRegex.test(email)) {
            toast.warning("Endereço de email inválido!");
            setTimeout(() => {
                toast.info("Exemplo de email válido: exemplo@gmail.com");
            }, 1500);
            return;
        }

        if (password !== repeatPassword) {
            toast.warning("As senhas não coincidem!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/users", {
                name,
                email,
                password,
            });

            if (response.status === 201) {
                console.log('Resposta do registro:', response.data); // Log da resposta
                toast.success("Cadastro realizado com sucesso!");
                navigate('/login');
            } else {
                toast.error("Erro ao realizar o cadastro. Tente novamente.");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.warning(error.response.data.error || "Erro no cadastro. Tente novamente.");
            } else {
                toast.error("Erro ao realizar o cadastro. Tente novamente.");
            }
        }
    };

    return (
        <div className="register">
            <form onSubmit={handleRegister} noValidate>
                <div className="register-form-container">
                    <h2 className="register-title">Cadastro</h2>
                    <div className="register-form-content">
                        <div className="register-form-group">
                            <label>Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="register-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="register-form-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="register-form-group">
                            <label>Repetir Senha</label>
                            <input
                                type="password"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="register-form-footer">
                            <button className="register-form-button" type="submit">Cadastrar</button>
                            <Link to='/login' className="register-login-button">Já possui cadastro? <span>Login</span></Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Register;