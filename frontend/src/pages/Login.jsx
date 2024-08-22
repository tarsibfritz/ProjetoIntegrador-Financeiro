import { useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Hook para navegação

    // Regex para validar emails no formato simples, que contém "@" e termina com ".com"
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
            }, 1500); // 1500 milissegundos = 1.5 segundo
            return;
        }

        try {
            // Enviar solicitação POST para fazer login do usuário
            const response = await axios.post('http://localhost:3000/api/users/login', {
                email,
                password,
            });

            // Verificar se a resposta é bem-sucedida e mostrar uma mensagem apropriada
            if (response.status === 200) {
                toast.success("Login realizado com sucesso!");
                navigate('/home'); // Redireciona para a página /home
            } else {
                toast.error("Erro ao realizar o login. Tente novamente.");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.warning("Credenciais inválidas!"); // Erro de login inválido
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
                        <div className="login-form-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form-footer">
                            <button className="login-form-button" type="submit">Entrar</button>
                            <a href='/register' className="login-register-button">Não possui conta? <span>Cadastre-se</span></a>
                        </div>
                    </div>
                </div>
            </form>
        </div> 
    )
}

export default Login;