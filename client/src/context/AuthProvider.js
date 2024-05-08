import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [mapId, setMapId ] = useState()

    return (
        <AuthContext.Provider value={{ auth, setAuth, mapId, setMapId }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;