export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center">
      <main className="wrapper">{children}</main>
    </div>
  );
}
