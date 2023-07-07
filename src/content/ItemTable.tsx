import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { KnownItem, UnknownItem } from "../proto/item_parser";
import {
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  IconButton,
  Collapse,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactElement, useState } from "react";
import { BuybackItem } from "./BuybackItem";
import { RepItem } from "../proto/buyback";
import { quantityToStr, priceToStr } from "./FmtUtil";

interface Props<I> {
  items: I[];
  color: string;
  title: string;
}

const TableBuyback = (props: Props<BuybackItem>): ReactElement => {
  const { items, color, title } = props;
  return (
    <TableInner<BuybackItem>
      items={items}
      color={color}
      title={title}
      head={() => <TableHeadBuyback />}
      body={(v) =>
        v.map((item) =>
          item.children.length > 0 ? (
            <TableRowBuybackWithChildren
              parent={item.parent}
              children={item.children}
            />
          ) : (
            <TableRowBuyback item={item.parent} />
          )
        )
      }
    />
  );
};

const TableParserKnown = (props: Props<KnownItem>): ReactElement => {
  const { items, color, title } = props;
  return (
    <TableInner<KnownItem>
      items={items}
      color={color}
      title={title}
      head={() => <TableHeadParser />}
      body={(v) => v.map((item) => <TableRowParserKnown item={item} />)}
    />
  );
};

const TableParserUnknown = (props: Props<UnknownItem>): ReactElement => {
  const { items, color, title } = props;
  return (
    <TableInner<UnknownItem>
      items={items}
      color={color}
      title={title}
      head={() => <TableHeadParser />}
      body={(v) => v.map((item) => <TableRowParserUnknown item={item} />)}
    />
  );
};

interface InnerProps<I> extends Props<I> {
  head: () => ReactElement;
  body: (items: I[]) => ReactElement[];
}

const TableInner = <I,>(props: InnerProps<I>): ReactElement => {
  const { head: headFn, body: bodyFn, color, title, items } = props;

  const TableInnerInner = (): ReactElement =>
    items.length === 0 ? (
      <></>
    ) : (
      <Table>
        {headFn()}
        <TableBody>{bodyFn(items)}</TableBody>
      </Table>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: color, textAlign: "center" }}
    >
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography>{`${title} (${items.length} items)`}</Typography>
      </Toolbar>
      <TableInnerInner />
    </TableContainer>
  );
};

const TableHeadParser = (): ReactElement => (
  <TableHead>
    <TableRow>
      <TableCell>{"Name"}</TableCell>
      <TableCell>{"Quantity"}</TableCell>
    </TableRow>
  </TableHead>
);

const TableHeadBuyback = (): ReactElement => (
  <TableHead>
    <TableRow>
      <TableCell />
      <TableHeadCellsBuyback />
    </TableRow>
  </TableHead>
);

const TableHeadCellsBuyback = (): ReactElement => (
  <>
    <TableCell>{"Name"}</TableCell>
    <TableCell>{"Quantity"}</TableCell>
    <TableCell>{"Per"}</TableCell>
    <TableCell>{"Total"}</TableCell>
    <TableCell>{"Description"}</TableCell>
  </>
);

const TableRowParserUnknown = (props: { item: UnknownItem }): ReactElement => {
  const { item } = props;
  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{quantityToStr(item.quantity, 0)}</TableCell>
    </TableRow>
  );
};

const TableRowParserKnown = (props: { item: KnownItem }): ReactElement => {
  const { item } = props;
  return (
    <TableRow>
      <TableCell>
        <NameWithImage name={item.name} typeId={item.typeId} />
      </TableCell>
      <TableCell>{quantityToStr(item.quantity, 0)}</TableCell>
    </TableRow>
  );
};

const TableRowBuybackWithChildren = (props: {
  parent: RepItem;
  children: RepItem[];
}): ReactElement => {
  const { parent, children } = props;

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCellsBuyback item={parent} />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="child items">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableHeadCellsBuyback />
                </TableRow>
              </TableHead>
              <TableBody>
                {children.map((child) => (
                  <TableRowBuyback item={child} isChild />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const TableRowBuyback = (props: {
  item: RepItem;
  isChild?: boolean;
}): ReactElement => {
  const { item, isChild } = props;
  return (
    <TableRow>
      <TableCell />
      <TableCellsBuyback item={item} isChild={isChild} />
    </TableRow>
  );
};

const TableCellsBuyback = (props: {
  item: RepItem;
  isChild?: boolean;
}): ReactElement => {
  const { item, isChild } = props;
  return (
    <>
      <TableCell>
        <NameWithImage name={item.name} typeId={item.typeId} />
      </TableCell>
      <TableCell>{quantityToStr(item.quantity, isChild ? 2 : 0)}</TableCell>
      <TableCell>{priceToStr(item.pricePer)}</TableCell>
      <TableCell>{priceToStr(item.pricePer * item.quantity)}</TableCell>
      <TableCell>{item.description}</TableCell>
    </>
  );
};

const NameWithImage = (props: {
  name: string;
  typeId: number;
}): ReactElement => {
  const { name, typeId } = props;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={`https://images.evetech.net/types/${typeId}/icon?size=32`}
        alt={typeId.toString()}
        width={32}
        height={32}
      />
      <div style={{ minWidth: "2px" }} />
      {name}
    </div>
  );
};

export { TableBuyback, TableParserKnown, TableParserUnknown };
