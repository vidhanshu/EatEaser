import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Typography } from "@ui/components";

const Logo = ({ iconOnly = false }: { iconOnly?: boolean }) => (
  <Link to="/" className="flex items-center gap-x-2 mx-auto w-fit">
    <img src="/logo.svg" className="w-8 h-8" />
    <AnimatePresence>
      {!iconOnly && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.01 }}>
          <Typography className="text-white" variant="h5">
            EatEaser
          </Typography>
        </motion.div>
      )}
    </AnimatePresence>
  </Link>
);

export default Logo;
