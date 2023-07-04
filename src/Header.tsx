import { ReactElement, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

interface Props {
  getAutoConfirmParse: () => boolean;
  setAutoConfirmParse: (v: boolean) => void;
  getLanguage: () => string;
  setLanguage: (v: string) => void;
  languages: string[];
}

const Header = (props: Props): ReactElement => {
  const {
    getAutoConfirmParse,
    setAutoConfirmParse,
    getLanguage,
    setLanguage,
    languages,
  } = props;
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "56px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "50%",
            // height: "100%",
            display: "flex",
            placeItems: "center",
            maxWidth: "256px",
            minWidth: "128px",
          }}
        >
          <LangSelector
            getLanguage={getLanguage}
            setLanguage={setLanguage}
            languages={languages}
          />
        </div>
      </div>
      <div className={"flex center fullheight"}>
        {"War Eagle Trading Co. Buyback Calculator"}
      </div>
      <div className={"flex center fullheight"}>
        <AutoConfirmParseCheckbox
          getAutoConfirmParse={getAutoConfirmParse}
          setAutoConfirmParse={setAutoConfirmParse}
        />
      </div>
    </>
  );
};

interface LangSelectorProps {
  getLanguage: () => string;
  setLanguage: (v: string) => void;
  languages: string[];
}

const LangSelector = (props: LangSelectorProps): ReactElement => {
  const { getLanguage, setLanguage, languages } = props;
  const [value, setValue] = useState<string>(getLanguage);
  return (
    <Select
      sx={{ width: "100%", height: "100%" }}
      value={value}
      onChange={(event: SelectChangeEvent) => {
        const lang = event.target.value;
        setLanguage(lang);
        setValue(lang);
      }}
    >
      {languages.map((lang) => (
        <MenuItem value={lang} key={lang}>
          {lang}
        </MenuItem>
      ))}
    </Select>
  );
};

interface AutoConfirmParseCheckboxProps {
  getAutoConfirmParse: () => boolean;
  setAutoConfirmParse: (v: boolean) => void;
}

const AutoConfirmParseCheckbox = (
  props: AutoConfirmParseCheckboxProps
): ReactElement => {
  const { getAutoConfirmParse, setAutoConfirmParse } = props;
  const [value, setValue] = useState<boolean>(getAutoConfirmParse);
  return (
    <FormControlLabel
      sx={{
        width: "100%",
        // height: "100%",
        // "& .MuiSvgIcon-root": { width: "100%", height: "100%" },
      }}
      control={
        <Checkbox
          sx={{
            "& .MuiSvgIcon-root": { width: "100%" },
          }}
          checked={value}
          onChange={(_, checked) => {
            setAutoConfirmParse(checked);
            setValue(checked);
          }}
        />
      }
      label={"Auto-Confirm"}
    />
  );
};

export default Header;
