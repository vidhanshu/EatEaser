import { Button, Typography } from "@ui/components";
import { Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const [time, setTime] = useState(5);
  const ref = useRef<number>(5);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => {
      if (ref.current > 0) {
        setTime((t) => t - 1);
        ref.current = ref.current - 1;
      } else {
        navigate("/");
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [ref]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col gap-4 items-center justify-center">
      <img src="/logo.svg" />
      <div className="flex flex-col items-center">
        <Typography variant="h1">404</Typography>
        <Typography variant="muted" className="text-lg">
          Page not found!
        </Typography>
        <Typography variant="muted" className="text-sm">
          redirecting to home in <span className="text-primary">{time} secs</span>
        </Typography>
      </div>
      <Link to="/">
        <Button endContent={<Home className="w-4" />} size="sm">
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
