import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex grow">{children}</div>
    </div>
  );
}
