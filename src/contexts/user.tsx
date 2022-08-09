import { Roles } from "@src/db/users";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface IUserContext {
  isLoggedIn: boolean;
  isAdmin: boolean;
  email: string;
  roles: string[];
  setUser: (payload: { email: string; roles: Roles[] }) => void;
  logout: () => void;
}

const defaultContext: IUserContext = {
  isLoggedIn: false,
  isAdmin: false,
  email: "",
  roles: [],
  setUser: () => void 0,
  logout: () => void 0,
};

const UserContext = createContext(defaultContext);

export function UserContextProvider(props: PropsWithChildren<{}>) {
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<Roles[]>([]);

  const value: IUserContext = {
    isLoggedIn: email.length > 0,
    isAdmin: roles.includes(Roles.Admin),
    email,
    roles,
    setUser: (payload) => {
      setEmail(payload.email);
      setRoles(payload.roles);
    },
    logout: () => {
      setEmail("");
      setRoles([]);
    },
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
