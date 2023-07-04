import { ReactElement, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";

interface Props {
  onSubmit: (region: string, text: string) => void;
  regions: string[];
}

const ItemInput = (props: Props): ReactElement => {
  const { onSubmit, regions } = props;

  const [getTextOrUndefined, setText] = useText();
  const [getRegionIdxOrUndefined, setRegionIdx] = useRegionIdx();

  const getRegion = () => {
    const idx = getRegionIdxOrUndefined();
    if (idx === undefined) return "";
    else return regions[idx];
  };

  const getText = () => {
    const text = getTextOrUndefined();
    if (text === undefined) return "";
    else return text;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "50%",
        justifyContent: "flex-start",
        minHeight: "256px",
        // alignItems: "flex-start",
      }}
    >
      <div
        style={{
          minWidth: "320px",
          width: "100%",
          height: "50%",
          minHeight: "128px",
        }}
      >
        <TextInput setText={setText} />
      </div>
      <div
        style={{
          minWidth: "320px",
          marginTop: "8px",
          width: "100%",
          height: "6%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "56px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            marginRight: "8px",
          }}
        >
          <RegionInput setRegionIdx={setRegionIdx} regions={regions} />
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <SubmitButton onSubmit={() => onSubmit(getRegion(), getText())} />
        </div>
      </div>
    </div>
  );
};

interface TextInputProps {
  setText: (value: string) => void;
}

const TextInput = (props: TextInputProps): ReactElement => {
  const { setText } = props;
  return (
    <TextField
      onChange={(e) => setText(e.target.value)}
      sx={{
        // overflow: "auto",
        width: "100%",
        height: "100%",
        // overflowX: "scroll",
        "& .MuiInputBase-root": {
          width: "100%",
          height: "100%",
        },
        "& .MuiInputBase-input": {
          maxHeight: "100%",
          // overflowX: "scroll",
        },
      }}
      id={"outlined-multiline"}
      label={"paste items here"}
      multiline
      // rows={12}
    />
  );
};

interface RegionInputProps {
  setRegionIdx: (value: number) => void;
  regions: string[];
}

const RegionInput = (props: RegionInputProps): ReactElement => {
  const { setRegionIdx, regions } = props;

  const [localRegionIdx, setLocalRegionIdx] = useState<number>();

  const onChange = (e: SelectChangeEvent<number>) => {
    const idx = e.target.value as number;
    setLocalRegionIdx(idx);
    setRegionIdx(idx);
  };

  // sx={{
  //   '& .MuiFormControl-root': {
  //     height: "100%",
  //     marginTop: "0px",
  //     marginBottom: "0px",
  //   },
  //   '& .MuiOutlinedInput-root': {
  //     height: "100%",
  //   },
  //   width: "100%",
  //   height: "100%",
  // }}
  return (
    <FormControl variant={"outlined"} sx={{ width: "100%", height: "100%" }}>
      <InputLabel id={"select-region-label"}>{"select region"}</InputLabel>
      <Select
        renderValue={() =>
          localRegionIdx === undefined ? "" : regions[localRegionIdx]
        }
        sx={{
          "& .MuiSelect-select": { width: "100%" },
          width: "100%",
          height: "100%",
        }}
        labelId={"select-region-label"}
        label={"select region"}
        value={localRegionIdx ?? ""}
        id={"select-region"}
        onChange={onChange}
      >
        {regions.map((region, idx) => (
          <MenuItem key={region} value={idx}>
            {region}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

interface SubmitButtonProps {
  onSubmit: () => void;
}

const SubmitButton = (props: SubmitButtonProps): ReactElement => {
  const { onSubmit } = props;
  return (
    <Button
      sx={{ width: "100%", height: "100%" }}
      variant={"outlined"}
      onClick={onSubmit}
    >
      {"submit"}
    </Button>
  );
};

const useRegionIdx = (): [() => number | undefined, (v: number) => void] => {
  const ref = useRef<number>();
  return [() => ref.current, (v: number) => (ref.current = v)];
};

const useText = (): [() => string | undefined, (v: string) => void] => {
  const ref = useRef<string>();
  return [() => ref.current, (v: string) => (ref.current = v)];
};

export default ItemInput;
