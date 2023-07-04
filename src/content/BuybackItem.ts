import { RepItem } from "../proto/buyback";

interface BuybackItemUninit {
  parent?: RepItem;
  children: RepItem[];
}

interface BuybackItem {
  parent: RepItem;
  children: RepItem[];
}

interface BuybackItems {
  accepted: BuybackItem[];
  rejected: BuybackItem[];
}

const BuybackItemsFromRepItems = (
  repItems: RepItem[]
): [BuybackItem[], BuybackItem[]] => {
  const buybackItemsMapped = new Map<number, BuybackItemUninit>();
  let acceptedLength = 0;
  let rejectedLength = 0;

  repItems.forEach((repItem) => {
    const buybackItem = buybackItemsMapped.get(repItem.parentTypeId);

    // If this repItem is a parent
    if (repItem.parentTypeId === repItem.typeId) {
      // It buybackItem is undefined, set parent to repItem and child to []
      if (buybackItem === undefined)
        buybackItemsMapped.set(repItem.parentTypeId, {
          parent: repItem,
          children: [],
        });
      // Otherwise, update it and set repItem as parent
      else buybackItem.parent = repItem;
      // Update the the len of the accepted and rejected fields
      if (repItem.accepted) acceptedLength++;
      else rejectedLength++;
    }

    // If this repItem is a child
    else {
      // If buybackItem is undefined, set parent to {} and child to [repItem]
      if (buybackItem === undefined)
        buybackItemsMapped.set(repItem.parentTypeId, { children: [] });
      // Otherwise, update it and push repItem to children
      else buybackItem.children.push(repItem);
      // We do not track children length for allocation
    }
  });

  const buybackItems = {
    accepted: new Array<BuybackItem>(acceptedLength),
    rejected: new Array<BuybackItem>(rejectedLength),
  };
  let acceptedIdx = 0;
  let rejectedIdx = 0;

  buybackItemsMapped.forEach((buybackItemUninit) => {
    const buybackItem = {
      parent:
        buybackItemUninit.parent ??
        (() => {
          throw new Error("Unreachable");
        })(),
      children: buybackItemUninit.children,
    };
    if (buybackItem.parent.accepted) {
      buybackItems.accepted[acceptedIdx] = buybackItem;
      acceptedIdx++;
    } else {
      buybackItems.rejected[rejectedIdx] = buybackItem;
      rejectedIdx++;
    }
  });

  return [buybackItems.accepted, buybackItems.rejected];
};

export type { BuybackItem, BuybackItems };
export { BuybackItemsFromRepItems };
