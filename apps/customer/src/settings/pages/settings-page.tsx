import { useTheme } from "@repo/ui";
import SignOutBtn from "@src/common/components/sign-out-btn";

const SettingsPage = () => {
  const { toggleTheme } = useTheme();
  return (
    <div>
      <button onClick={toggleTheme}>Togge theme</button>
      <SignOutBtn />
    </div>
  );
};

export default SettingsPage;
