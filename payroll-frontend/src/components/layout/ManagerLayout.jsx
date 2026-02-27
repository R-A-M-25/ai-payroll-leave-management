import ManagerSidebar from "./ManagerSidebar";
import { Outlet } from "react-router-dom";

export default function ManagerLayout(){

return(

<div className="flex">

<ManagerSidebar/>

<div className="flex-1 p-10 bg-gray-50 min-h-screen">

<Outlet/>

</div>

</div>

);

}