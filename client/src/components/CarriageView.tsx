export function CarriageView({ svg }: any) {
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}