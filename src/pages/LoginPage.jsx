/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="text-center">
      <p>
        Don't Have an account?
        <Link to="/sign-up" className="ml-1 text-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
