interface DrawerEmptyContentProps {
  message: string;
}

export const DrawerEmptyContent = ({
  message,
}: Readonly<DrawerEmptyContentProps>) => {
  return <p className="text-sm font-normal text-drawerLightGray">{message}</p>;
};
