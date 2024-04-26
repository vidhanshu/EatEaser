/**
 * This file uses render prop pattern
 * You can use it directly or use the render prop pattern
 * to customize the button
 *
 * @example:
 * use as below for render prop pattern
 * <SignOutBtn>
 *  {(signOut) => (
 *   <AnyCustomerClickableComponent
 *    onClick={signOut}
 *   />
 *  )}
 * </SignOutBtn>
 */

import useAuthStore from "@src/common/stores/auth-store";
import { ROUTES } from "@src/common/utils/api-routes";
import axiosInstance from "@src/common/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { Button, ButtonProps, toast } from "@ui/components";
import { AxiosError } from "axios";

const SignOutBtn = ({
  children,
  btnProps: { onClick, ...btnProps } = {},
}: {
  children?: (mutate: () => void) => JSX.Element;
  btnProps?: ButtonProps;
}) => {
  const signOut = useAuthStore((data) => data.signOut);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(ROUTES.auth.signOut);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message ?? "Sign out successfully");
      signOut();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const response = error.response?.data;
        toast.error(response?.error ?? "An error occurred");
      }
    },
  });

  if (children) return children(mutate);
  return (
    <div>
      <Button loading={isPending} onClick={() => mutate()} {...btnProps}>
        Sign Out
      </Button>
    </div>
  );
};

export default SignOutBtn;
