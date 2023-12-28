import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

interface AuthProps {
  user?: any;
  setUser?: Dispatch<SetStateAction<null>>;
  logOut: () => void;
}

export const AuthenticatedUserContext = createContext<AuthProps>({
  user: null,
  setUser: () => {},
  logOut: async () => {},
});

export function useAuth() {
  return React.useContext(AuthenticatedUserContext);
}

export const AuthenticatedUserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState(null);

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser, logOut }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

// android config: 191216961610-eiqreopelk2034un6uhccpukphqs0vdq.apps.googleusercontent.com
