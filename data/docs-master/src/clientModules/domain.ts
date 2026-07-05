const defaultDomain = 'inappstory.com';
let parsedDomain: string | null = null;

export const getBaseDomain = (): string => {
  if (parsedDomain == null) {
    const baseHost = window.location?.host ?? '';
    const baseHostname = baseHost.split(':')[0] ?? '';
    const parts = baseHostname.split('.').reverse();
    parsedDomain = parts[0] != null && parts[1] != null ? `${parts[1]}.${parts[0]}` : defaultDomain;
  }
  return parsedDomain;
};
