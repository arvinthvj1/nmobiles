import { Navbar } from "@/components/navbar";

export default function ManageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
       <Navbar/>
				{children}
    </div>
	);
}