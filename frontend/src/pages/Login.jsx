import { useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
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

        try {
            const response = await axios.post('http://localhost:3000/api/users/login', {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, user } = response.data;

                console.log('Resposta da API:', response.data);

                localStorage.setItem('token', token);
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userEmail', user.email);

                console.log('Nome do usuário armazenado:', localStorage.getItem('userName'));
                console.log('Token armazenado:', localStorage.getItem('token'));

                toast.success("Login realizado com sucesso!");
                navigate('/home');
            } else {
                toast.error("Erro ao realizar o login. Tente novamente.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.warning("Credenciais inválidas!");
            } else {
                toast.error("Erro ao realizar o login. Tente novamente.");
            }
        }
    };

    return (
        <div className="login">
            <form onSubmit={handleSubmit} noValidate>
                <div className="login-form-container">
                    <h2 className="login-title">Login</h2>
                    <div className="login-form-content">
                        <div className="login-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form-group password-group">
                            <label>Senha</label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                            <Link to='/resetar-senha' className="forgot-password-button">Esqueceu a senha?</Link>
                        </div>
                        <div className="login-form-footer">
                            <button className="login-form-button" type="submit">Entrar</button>
                            <Link to='/cadastro' className="login-register-button">Não possui conta? <span>Cadastre-se</span></Link>
                        </div>
                    </div>
                </div>
            </form>
        </div> 
    );
};

export default Login;