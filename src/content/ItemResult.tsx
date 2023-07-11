import { ReactElement } from "react";
import { TableBuyback } from "./ItemTable";
import { Rep as BuybackRep } from "../proto/buyback";
import { buybackItemsFromRepItems } from "./BuybackItem";
import {
  AppBar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  priceToStr,
  timestampToEveDate,
  timestampToLocalDate,
} from "./FmtUtil";
import { setHashQuery } from "../HashQuery";

interface Props {
  rep?: BuybackRep;
}

const ItemResult = (props: Props): ReactElement => {
  const { rep } = props;

  if (rep === undefined) return <></>;
  else {
    setHashQuery(rep.hash); // This is gonna be called too often here (shouldn't need to happen every render) TODO: fix
    const { accepted: acceptedItems, rejected: rejectedItems } =
      buybackItemsFromRepItems(rep.items);

    return (
      <>
        <BuybackDetails rep={rep} />
        <div style={{ minWidth: "8px" }} />
        <TableBuyback
          items={acceptedItems}
          color={"rgb(39, 54, 39)"}
          title={"Accepted"}
        />
        <div style={{ minWidth: "8px" }} />
        <TableBuyback
          items={rejectedItems}
          color={"rgb(54, 39, 39)"}
          title={"Rejected"}
        />
      </>
    );
  }
};

const BuybackDetails = (props: { rep: BuybackRep }): ReactElement => {
  const { rep } = props;
  return (
    <TableContainer
      component={AppBar}
      sx={{ marginTop: "80px", position: "absolute", overflow: "visible" }}
    >
      <Table
        size={"small"}
        sx={{
          tableLayout: "fixed",
          "& .MuiTableCell-root": { align: "center" },
          whiteSpace: "nowrap",
          minWidth: "960px",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center">{"Region"}</TableCell>
            <TableCell align="center">{"Sum Value"}</TableCell>
            <TableCell align="center">{"Hash Code"}</TableCell>
            <TableCell align="center">{"Date (Local)"}</TableCell>
            <TableCell align="center">{"Date (EVE)"}</TableCell>
            <TableCell align="center">{"Version"}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center">{rep.location}</TableCell>
            <TableCell align="center">{priceToStr(rep.sum)}</TableCell>
            <TableCell align="center">{rep.hash}</TableCell>
            <TableCell align="center">
              {timestampToLocalDate(rep.timestamp)}
            </TableCell>
            <TableCell align="center">
              {timestampToEveDate(rep.timestamp)}
            </TableCell>
            <TableCell align="center">{rep.version}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemResult;
