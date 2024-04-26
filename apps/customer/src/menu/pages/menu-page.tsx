import SignOutBtn from "@src/common/components/sign-out-btn";
import useAuthStore from "@src/common/stores/auth-store";

const MenuPage = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      <SignOutBtn />
      <h1>User details:</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default MenuPage;
