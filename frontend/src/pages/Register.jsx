import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Register.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
    const [showRepeatPassword, setShowRepeatPassword] = useState(false); // Estado para mostrar/ocultar senha repetida
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLengthRegex = /.{8,}/;
    const lowerCaseRegex = /[a-z]/;
    const upperCaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[@$!%*?&]/;

    const handleRegister = async (e) => {
        e.preventDefault();

        console.log('Nome:', name);
        console.log('Email:', email);
        console.log('Senha:', password);
        console.log('Repetir Senha:', repeatPassword);

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

        // Verificações de senha
        if (!minLengthRegex.test(password)) {
            toast.warning("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (!lowerCaseRegex.test(password)) {
            toast.warning("A senha deve conter pelo menos uma letra minúscula.");
            return;
        }

        if (!upperCaseRegex.test(password)) {
            toast.warning("A senha deve conter pelo menos uma letra maiúscula.");
            return;
        }

        if (!digitRegex.test(password)) {
            toast.warning("A senha deve conter pelo menos um número.");
            return;
        }

        if (!specialCharRegex.test(password)) {
            toast.warning("A senha deve conter pelo menos um caractere especial (@$!%*?&).");
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

            console.log('Resposta do registro:', response.data);
            if (response.status === 201) {
                toast.success("Cadastro realizado com sucesso!");
                navigate('/login');
            } else {
                toast.error("Erro ao realizar o cadastro. Tente novamente.");
            }
        } catch (error) {
            console.error('Erro:', error);
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
                                placeholder="exemplo@exemplo.com"
                                required
                            />
                        </div>
                        <div className="register-form-group">
                            <label>Senha</label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle" 
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        <div className="register-form-group">
                            <label>Repetir Senha</label>
                            <div className="password-container">
                                <input
                                    type={showRepeatPassword ? "text" : "password"}
                                    value={repeatPassword}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle" 
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                >
                                    <FontAwesomeIcon icon={showRepeatPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
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