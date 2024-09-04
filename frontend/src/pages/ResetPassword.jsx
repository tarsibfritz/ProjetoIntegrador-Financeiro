import { useState } from "react";
import { toast } from 'react-toastify';
import { resetPassword } from '../services/userService';
import "../styles/ResetPassword.css";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !newPassword || !confirmPassword) {
            toast.info("Todos os campos são obrigatórios!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warning("As senhas não coincidem!");
            return;
        }

        try {
            await resetPassword(email, newPassword);
            toast.success("Senha redefinida com sucesso!");
            // Redirecionar ou limpar os campos conforme necessário
        } catch (error) {
            toast.error("Erro ao redefinir a senha. Tente novamente.");
        }
    };

    return (
        <div className="reset-password">
            <form onSubmit={handleSubmit}>
                <div className="reset-password-container">
                    <h2 className="reset-password-title">Redefinir Senha</h2>
                    <div className="reset-password-content">
                        <div className="reset-password-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="reset-password-group">
                            <label>Nova Senha</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="reset-password-group">
                            <label>Confirmar Senha</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="reset-password-button" type="submit">Redefinir Senha</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;