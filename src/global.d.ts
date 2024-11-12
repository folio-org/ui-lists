declare module '*.css' {
  const styles: { [className: string]: string };
  export = styles;
}

declare module '*.json' {
  const value: any;
  export default value;
}
