/**
 * Landing page, only accessible when user is un-authenticated
 * It contains details about the EatEaser
 */
import { Button } from "@ui/components";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <Link to="/sign-in">
        <Button>Sign In</Button>
      </Link>
    </div>
  );
};

export default LandingPage;
