import { Rep as BuybackRep } from "../proto/buyback";

const BIGINT_0 = BigInt(0);

const isCheckHit = (rep: BuybackRep): boolean =>
  rep.sum !== 0 && rep.timestamp !== BIGINT_0 && rep.hash !== "";

const isCheckMiss = (rep: BuybackRep): boolean => !isCheckHit(rep);

export { isCheckHit, isCheckMiss };
