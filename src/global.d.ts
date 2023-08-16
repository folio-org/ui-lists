declare module '@folio/stripes/components';
declare module '@folio/stripes/smart-components';
declare module '@folio/stripes/core';
declare module '@folio/stripes-acq-components';
declare module '*.css' {
  const styles: { [className: string]: string };
  export = styles;
}
declare module '*.json' {
  const value: any;
  export default value;
}
