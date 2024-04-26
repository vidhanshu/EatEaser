/**
 * This component follows render props pattern to render the dialog for creating, reading and updating a table
 *
 * This file is responsible for rendering the dialog for creating, reading and updating a table
 * It uses the `CreateTableForm` component to render the form for creating, reading and updating a table
 * It uses the `GenericDialog` component to render the dialog
 * It uses the `useSearchParams` hook to get the search params from the url, namely the tableId and mode
 *
 * This dialog is completely controlled by the url, if the valid mode is present in the url, the dialog will be open
 */
import { useNavigate, useSearchParams } from "react-router-dom";
import { GenericDialog } from "@ui/components";

/// ------------------------------------------------------------------------------

const allowedModes = ["create", "edit", "view"];
export type ALLOWED_MODES = "create" | "edit" | "view";

/// ------------------------------------------------------------------------------

export const GenericUrlCruDialog = ({
  children,
  onCloseNavigateTo,
  itemName = "Table",
}: {
  children: (mode: ALLOWED_MODES, id: string) => React.ReactElement;
  onCloseNavigateTo: string;
  itemName?: string;
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const mode = searchParams.get("mode") as ALLOWED_MODES;

  //   if allowed mode isn't present in the url, return null
  if (mode && !allowedModes.includes(mode)) return null;

  //   if mode is edit or view and id isn't present in the url, return null
  if ((mode === "edit" || mode === "view") && !id) return null;

  return (
    <GenericDialog
      queryControlled={{
        open: !!mode,
        setOpen: (open) => {
          if (!open) {
            navigate(onCloseNavigateTo);
          }
        },
      }}
      dialogTitle={
        mode === "create"
          ? `Create ${itemName}`
          : mode === "edit"
            ? `Edit ${itemName}`
            : undefined
      }
      dissmissable={mode === "view"}
      content={children(mode, id ?? "")}
    />
  );
};

export default GenericUrlCruDialog;
