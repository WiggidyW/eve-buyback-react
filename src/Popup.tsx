import { ReactElement } from "react";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

interface PopupThrowerProps {
  close: () => void;
  popup?: Popup;
}

const PopupThrower = (props: PopupThrowerProps): ReactElement => {
  const { popup, close } = props;
  return (
    <Dialog open={popup ? true : false} onClose={close}>
      <DialogTitle>{popup?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{popup?.message}</DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

interface Popup {
  message: string;
  title: string;
  ok: boolean;
}

const Err = (e: Error): Popup => ({
  message: decodeURI(e.message),
  title: "Error",
  ok: false,
});

export type { Popup };
export { PopupThrower, Err };
