const quantityToStr = (v: number | bigint, places: number): string =>
  Number(v).toLocaleString(undefined, {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  });

const priceToStr = (v: number): string => "Ƶ " + quantityToStr(v, 2);

const timestampToLocalDate = (epoch: bigint): string =>
  new Date(Number(epoch) * 1000).toLocaleString();

const timestampToEveDate = (epoch: bigint): string =>
  new Date(Number(epoch) * 1000).toUTCString();

export { quantityToStr, priceToStr, timestampToEveDate, timestampToLocalDate };
