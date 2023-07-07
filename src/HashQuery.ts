const getHashQuery = (): string | undefined => {
  const re = /^[0123456789abcdef]{15,16}\/{0,1}$/;
  const hash = window.location.pathname.substring(1);
  if (hash !== "" && re.test(hash)) return hash;
  else return undefined;
};

const setHashQuery = (hash: string): void => {
  window.history.pushState({}, "", `/${hash}`);
};

export { getHashQuery, setHashQuery };
