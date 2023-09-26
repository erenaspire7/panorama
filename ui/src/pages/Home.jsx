import { useLoaderData } from "react-router-dom";
import Dashboard from "./Dashboard";
import Landing from "./Landing";

export default function Home() {
  const { isAuthenticated } = useLoaderData();
  

  return isAuthenticated ? <Dashboard /> : <Landing />;
}
