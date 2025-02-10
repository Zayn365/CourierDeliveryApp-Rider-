declare module '@env' {
  export const API_URL: string;
}
declare module '@assets/*' {
  const content: any;
  export default content;
}

declare module '@screens/*' {
  const content: any;
  export default content;
}

declare module '@components/*' {
  const content: any;
  export default content;
}

declare module '@utils/*' {
  const content: any;
  export default content;
}
