                                                                                        //value for Wwa Centralna
export type PkpicEPAStationId = number & { readonly __brand: "PkpicEPAStationId" };     //5100136
export type PkpicEVAStationId = number & { readonly __brand: "PkpicEVAStationId" };     //5100065
export type PkpicPOSStationId = number & { readonly __brand: "PkpicPOSStationId" };     //33605
export type PkpicCodeStationId = number & { readonly __brand: "PkpicCodeStationId" };   //242

export const formatPkpicGrmDate = (d: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return ( d.getFullYear().toString() + pad(d.getMonth() + 1) + pad(d.getDate()) + pad(d.getUTCHours()) + pad(d.getMinutes()) );
};

export const formatPkpicLastUpdateDate = (date: Date): string => {
  const pad = (n: number, width = 2) => String(n).padStart(width, "0");

  return ( date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) + "." + pad(date.getMilliseconds(), 3) );
}
