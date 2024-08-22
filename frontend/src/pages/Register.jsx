import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleNextStep = (e) => {
        e.preventDefault();

        if (!email || !password || !repeatPassword) {
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

        setStep(2);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.info("O campo nome é obrigatório!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/users", {
                name,
                email,
                password,
            });
            if (response.status === 201) {
                toast.success("Cadastro realizado com sucesso!");
            } else {
                toast.error("Erro ao realizar o cadastro. Tente novamente.");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setStep(1);
                toast.warning(error.response.data.error || "Erro no cadastro. Tente novamente.");
            } else {
                toast.error("Erro ao realizar o cadastro. Tente novamente.");
            }
        }
    };

    return (
        <div className="register">
            {step === 1 && (
                <div className="register-step">
                    <form onSubmit={handleNextStep} noValidate>
                        <div className="register-form-container">
                            <div className="register-form-content">
                                <h2 className="register-title">Cadastro</h2>
                                <div className="register-form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="register-form-group">
                                    <label htmlFor="password">Senha</label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div className="register-form-group">
                                    <label htmlFor="repeatPassword">Repetir Senha</label>
                                    <input
                                        id="repeatPassword"
                                        type="password"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div className="register-form-footer">
                                    <button className="register-form-button" type="submit">Próximo</button>
                                    <a href='/login' className="register-login-button">Já possui cadastro? <span>Login</span></a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div className="register-step">
                    <form onSubmit={handleRegister} noValidate>
                        <div className="register-form-container">
                            <div className="register-form-content">
                                <h2 className="register-title">Como devemos chamá-lo?</h2>
                                <div className="register-form-group">
                                    <label htmlFor="name">Nome</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="register-form-footer">
                                    <button className="register-form-button" type="submit">Cadastrar</button>
                                    <a href='/login' className="register-login-button">Já possui cadastro? <span>Login</span></a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Register;