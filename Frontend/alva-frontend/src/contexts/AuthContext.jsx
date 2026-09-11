import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("alva_token");
        if (storedToken) {
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post("/api/auth/login", { email, senha: password });
            const { token } = response.data;
            
            localStorage.setItem("alva_token", token);
            setToken(token);
        } catch (error) {
            console.error("Erro no login:", error);
            throw new Error("Credenciais inválidas");
        }
    };

    const logout = () => {
        localStorage.removeItem("alva_token");
        setToken(null);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};