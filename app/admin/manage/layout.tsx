"use client"
import NavBar from "@/components/navbar";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  debugger
  return (
    <div>
      <NavBar />
      <div className="px-6">{children}</div>
    </div>
  );
}
