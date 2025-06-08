import AdminOffcanvas from "@/components/AdminOffcanvas";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <AdminOffcanvas>
        {children}
      </AdminOffcanvas>
  );
}