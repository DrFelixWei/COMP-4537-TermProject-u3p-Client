import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const Navbar = () => {
  const auth = useAuthUser(); // Get user data

  return (
    <nav>
      <Link to="/">Home</Link>
      {auth() && (
        <>
          {auth().role === "admin" && <Link to="/admin">Admin Panel</Link>}
          <Logout />
        </>
      )}
      {!auth() && <Link to="/login">Login</Link>}
    </nav>
  );
};

export default Navbar;
