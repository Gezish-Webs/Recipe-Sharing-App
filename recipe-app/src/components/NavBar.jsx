import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/auth";

const NavBar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-orange-600">
          RecipeShare
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-orange-600">
            Home
          </Link>
          {currentUser ? (
            <>
              <Link to="/create" className="hover:text-orange-600">
                Add Recipe
              </Link>
              <Link
                to={`/profile/${currentUser.uid}`}
                className="hover:text-orange-600"
              >
                Profile
              </Link>
              <button onClick={handleLogout} className="hover:text-orange-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-600">
                Login
              </Link>
              <Link to="/register" className="hover:text-orange-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
