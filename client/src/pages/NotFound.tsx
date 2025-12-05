import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>Page Not Found ❌</h1>
      <Link to="/">
        <button className="mt-4">Go Back Home</button>
      </Link>
    </div>
  );
};

export default NotFound;
