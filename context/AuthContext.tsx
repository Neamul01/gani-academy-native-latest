import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface AuthProps {
  user?: any;
  setUser?: Dispatch<SetStateAction<null>>;
}

export const AuthenticatedUserContext = createContext<AuthProps>({});

export function useAuth() {
  return React.useContext(AuthenticatedUserContext);
}

export const AuthenticatedUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
