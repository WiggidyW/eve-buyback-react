import { ReactElement } from "react";
import { KnownItem, ParseRep } from "../proto/item_parser";
import DialogContent from "@mui/material/DialogContent";
import { TableParserKnown, TableParserUnknown } from "./ItemTable";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

interface Props {
  onAccept: (items: KnownItem[]) => void;
  onReject: () => void;
  rep?: ParseRep;
}

const ItemConfirmation = (props: Props): ReactElement => {
  const { onAccept, onReject, rep } = props;
  if (rep === undefined) return <></>;
  else
    return (
      <Dialog open onClose={onReject}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge={"start"}
              color={"error"}
              onClick={onReject}
              aria-label={"reject"}
              size={"large"}
            >
              <ThumbDownIcon />
            </IconButton>
            <Typography
              sx={{
                display: "flex",
                flex: "1",
                alignItems: "center",
                justifyContent: "center",
              }}
              variant="h6"
              component="div"
            >
              {"Confirm Items"}
            </Typography>
            <IconButton
              edge={"end"}
              color={"success"}
              onClick={() => onAccept(rep.knownItems)}
              aria-label={"accept"}
              size={"large"}
            >
              <ThumbUpIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ "& .MuiPaper-root": { overflowX: "visible" } }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TableParserUnknown
              items={rep.unknownItems}
              title={"Unknown"}
              color={"rgb(34, 19, 19)"}
            />
            <div style={{ minWidth: "24px" }} />
            <TableParserKnown
              items={rep.knownItems}
              title={"Known"}
              color={"rgb(19, 34, 19)"}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
};

export default ItemConfirmation;
