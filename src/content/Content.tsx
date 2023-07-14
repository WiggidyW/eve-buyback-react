import { ItemParserClient } from "../proto/item_parser.client";
import { BuybackClient } from "../proto/buyback.client";
import { useState, useRef, useEffect, ReactElement } from "react";
import { Rep as BuybackRep } from "../proto/buyback";
import { ParseRep } from "../proto/item_parser";
import { Popup, Err } from "../Popup";
import { KnownItem } from "../proto/item_parser";
import { CircularProgress } from "@mui/material";
import ItemInput from "./ItemInput";
import ItemConfirmation from "./ItemConfirmation";
import ItemResult from "./ItemResult";
import { isCheckHit } from "./PbUtil";
import { setHashQuery } from "../HashQuery";

const MAX_BUY_ATTEMPTS = 3;
const BUY_ATTEMPT_DELAY_MS = 1000;

interface Props {
  getAutoConfirmParse: () => boolean;
  itemParserClient: ItemParserClient;
  setPopup: (popup: Popup) => void;
  buybackClient: BuybackClient;
  getLanguage: () => string;
  hashQuery?: string;
  regions: string[];
}

const Content = (props: Props): ReactElement => {
  const {
    getAutoConfirmParse,
    itemParserClient,
    buybackClient,
    getLanguage,
    hashQuery,
    setPopup,
    regions,
  } = props;

  const [getRegion, setRegion] = useRegion();
  const [rep, setRep] = useState<BuybackRep | ParseRep>();
  const [fetching, setFetching] = useState(hashQuery !== undefined);

  useEffect(() => {
    // If a hash query is provided, send a hash query request
    if (hashQuery !== undefined) sendHashReq(hashQuery);
  }, [hashQuery]);

  const sendHashReq = async (hashQuery: string) => {
    try {
      // Send a check request to the buyback server using the hashQuery
      const buybackRep = await buybackClient.check({
        hash: hashQuery,
        language: getLanguage(),
      }).response;

      // Set the rep to the buyback rep if it exists.
      if (isCheckHit(buybackRep)) setRep(buybackRep);
      // Otherwise, remove the hash query from the url and throw a popup
      else {
        setHashQuery("");
        setPopup({
          message: `No appraisal found for the hash code "${hashQuery}"`,
          title: "No Appraisal Found",
          ok: false,
        });
      }

      // If an error occurs, throw an error popup
    } catch (e) {
      setPopup(Err(e as Error));
    }

    // Set fetching to false (triggering the main screen)
    setFetching(false);
  };

  const sendBuyReq = async (
    region: string,
    items: KnownItem[],
    enableSetFetcing?: boolean
  ) => {
    const sendBuyReqInner = async (attempt?: number) => {
      // If the attempt is undefined, set it to 1
      if (attempt === undefined) attempt = 0;
      try {
        // Send a buyback request to the buyback server using the parsed items
        const buybackRep = await buybackClient.buy({
          language: getLanguage(),
          location: region,
          items: items.map((item) => ({
            typeId: item.typeId,
            quantity: Number(item.quantity),
          })),
        }).response;

        // Set the rep to the buyback rep
        setRep(buybackRep);
      } catch (e) {
        // If the attempt is less than MAX_ATTEMPTS, wait ATTEMPT_DELAY_MS before retrying
        if (attempt < MAX_BUY_ATTEMPTS)
          await setTimeout(
            () => sendBuyReqInner(attempt! + 1),
            BUY_ATTEMPT_DELAY_MS
          );
        // Otherwise, throw an error popup
        else setPopup(Err(e as Error));
      }
    };

    // Throw an invalid input popup if the input is invalid
    if (items.length === 0) setPopup(NoKnownItems);
    else if (region === "") setPopup(PleaseSelectRegion);
    // If the input is valid, continue
    else {
      // If enabled, Set fetching to true (triggering a loading screen)
      if (enableSetFetcing) setFetching(true);

      await sendBuyReqInner();

      // If enabled, Set fetching to false (triggering the main screen)
      if (enableSetFetcing) setFetching(false);
    }
  };

  const sendParseReq = async (region: string, text: string) => {
    // Throw an invalid input popup if the input is invalid
    if (region === "") setPopup(PleaseSelectRegion);
    else if (text.trim() === "") setPopup(PleaseEnterItems);
    // If the input is valid, continue
    else {
      // Set fetching to true (triggering a loading screen)
      setFetching(true);

      try {
        // Send a parse request to the item parser server
        const parseRep = await itemParserClient.parse({
          text: text,
          language: getLanguage(),
        }).response;

        // If auto confirm is enabled, send a buyback request to the buyback server
        if (getAutoConfirmParse()) {
          await sendBuyReq(region, parseRep.knownItems);

          // Otherwise, set the rep to the parse rep
          // and the region to the selected region
        } else {
          setRegion(region);
          setRep(parseRep);
        }

        // If an error occurs, throw an error popup
      } catch (e) {
        setPopup(Err(e as Error));
      }

      // Set fetching to false (triggering the main screen)
      setFetching(false);
    }
  };

  // If currently fetching, return a loading screen
  if (fetching) return <CircularProgress />;
  // If not fetching, return the main screen
  else
    return (
      <>
        <ItemConfirmation
          onAccept={(v: KnownItem[]) => sendBuyReq(getRegion(), v, true)}
          onReject={() => setRep(undefined)}
          rep={isParseRep(rep) ? (rep as ParseRep) : undefined}
        />
        <ItemInput onSubmit={sendParseReq} regions={regions} />
        <ItemResult rep={isBuybackRep(rep) ? (rep as BuybackRep) : undefined} />
      </>
    );
};

const isParseRep = (rep: BuybackRep | ParseRep | undefined): boolean => {
  return rep !== undefined && "knownItems" in rep;
};

const isBuybackRep = (rep: BuybackRep | ParseRep | undefined): boolean => {
  return rep !== undefined && "hash" in rep;
};

const useRegion = (): [() => string, (v: string) => void] => {
  const ref = useRef<string>("");
  const getRegion = () => ref.current;
  const setRegion = (region: string) => (ref.current = region);
  return [getRegion, setRegion];
};

const PleaseSelectRegion: Popup = {
  message: "Please select a region before submitting",
  title: "No region selected",
  ok: false,
};

const PleaseEnterItems: Popup = {
  message: "Please input item(s) before submitting",
  title: "No item(s) entered",
  ok: false,
};

const NoKnownItems: Popup = {
  message: "No known items found from input",
  title: "No known items",
  ok: false,
};

export default Content;
