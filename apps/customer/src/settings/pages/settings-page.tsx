import { useTheme } from "@repo/ui";

const SettingsPage = () => {
  const { toggleTheme } = useTheme();
  return (
    <div>
      <button onClick={toggleTheme}>Togge theme</button>
    </div>
  );
};

export default SettingsPage;
