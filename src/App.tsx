import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { TwirpFetchTransport } from "@protobuf-ts/twirp-transport";
import { ItemParserClient } from "./proto/item_parser.client";
import { BuybackClient } from "./proto/buyback.client";
import { useState, useRef, ReactElement } from "react";
import { Popup, PopupThrower } from "./Popup";
import "./App.css";
import Content from "./content/Content";
import Header from "./Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getHashQuery } from "./HashQuery";

const Theme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface Props {
  buybackServerUrl: string;
  itemParserServerUrl: string;
  languages: string[];
  regions: string[];
}

const App = (props: Props): ReactElement => {
  const { buybackServerUrl, itemParserServerUrl, languages, regions } = props;

  const [getAutoConfirmParse, setAutoConfirmParse] = useAutoConfirmParse();
  const [getLanguage, setLanguage] = useLanguage(languages[0]);
  const parseClient = useState(() => initParseClient(itemParserServerUrl))[0];
  const buyClient = useState(() => initBuyClient(buybackServerUrl))[0];
  const hashQuery = useState(getHashQuery)[0];
  const [popup, setPopup] = useState<Popup>();

  return (
    <ThemeProvider theme={Theme}>
      <div style={{ height: "100vh" }}>
        <PopupThrower close={() => setPopup(undefined)} popup={popup} />
        <div
          style={{
            height: "56px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "8px",
            paddingBottom: "8px",
            backgroundColor: "#00000f",
          }}
        >
          <Header
            languages={languages}
            getLanguage={getLanguage}
            setLanguage={setLanguage}
            getAutoConfirmParse={getAutoConfirmParse}
            setAutoConfirmParse={setAutoConfirmParse}
          />
        </div>
        <div
          style={{
            marginTop: "80px",
            padding: "8px",
            height: "calc(100% - 176px)",
            width: "calc(100% - 16px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Content
            getAutoConfirmParse={getAutoConfirmParse}
            itemParserClient={parseClient}
            setPopup={setPopup}
            buybackClient={buyClient}
            getLanguage={getLanguage}
            hashQuery={hashQuery}
            regions={regions}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

const useAutoConfirmParse = (): [() => boolean, (v: boolean) => void] => {
  const [lsGet, lsSet] = useLocalStorage("autoConfirmParse");
  return [
    () => (lsGet() === null ? false : true),
    (v: boolean) => lsSet(v ? "" : null),
  ];
};

const useLanguage = (
  defaultLanguage: string
): [() => string, (v: string) => void] => {
  const [lsGet, lsSet] = useLocalStorage("language");
  return [() => lsGet() || defaultLanguage, (v: string) => lsSet(v)];
};

const useLocalStorage = (
  key: string
): [() => string | null, (v: string | null) => void] => {
  // We use this ref in a way similar to a useEffect with [] as the dependency
  const accessorRef = useRef<[() => string | null, (v: string) => void]>();
  const storageRef: React.MutableRefObject<string | null> =
    useRef<string>(null);

  // If accessorRef is undefined, then we initialize it.
  if (accessorRef.current === undefined) {
    const storageValue = localStorage.getItem(key);
    storageRef.current = storageValue;

    // This gets the value of the storageRef.
    const get = () => storageRef.current;

    // This sets the value of the storageRef and updates localStorage.
    // storageRef and storageValue are synchronized.
    const set = (v: string | null) => {
      if (v !== storageRef.current) {
        storageRef.current = v;
        if (v === null) localStorage.removeItem(key);
        else localStorage.setItem(key, v);
      }
    };

    // Set the accessorRef to the getter and setter.
    accessorRef.current = [get, set];
  }

  // We return the getter and setter.
  return [
    accessorRef.current[0],
    accessorRef.current[1] as (v: string | null) => void,
  ];
};

const initBuyClient = (baseUrl: string): BuybackClient =>
  new BuybackClient(new GrpcWebFetchTransport({ baseUrl }));

const initParseClient = (baseUrl: string): ItemParserClient =>
  new ItemParserClient(new TwirpFetchTransport({ baseUrl }));

export default App;
