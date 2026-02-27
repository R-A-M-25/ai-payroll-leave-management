import { NavLink } from "react-router-dom";

export default function ManagerSidebar() {

return (

<div className="w-64 h-screen bg-white border-r border-gray-200 p-6 space-y-6">

<h1 className="text-xl font-semibold">
PayrollPro
</h1>

<nav className="space-y-2">

<NavLink
to="/manager"
end
className={({isActive})=>
`block px-4 py-3 rounded-xl text-sm font-medium ${
isActive
? "bg-blue-100 text-blue-700"
: "text-gray-600 hover:bg-gray-100"
}`
}
>
Overview
</NavLink>


<NavLink
to="/manager/team"
className={({isActive})=>
`block px-4 py-3 rounded-xl text-sm font-medium ${
isActive
? "bg-blue-100 text-blue-700"
: "text-gray-600 hover:bg-gray-100"
}`
}
>
Team Members
</NavLink>


<NavLink
to="/manager/leaves"
className={({isActive})=>
`block px-4 py-3 rounded-xl text-sm font-medium ${
isActive
? "bg-blue-100 text-blue-700"
: "text-gray-600 hover:bg-gray-100"
}`
}
>
Leave Requests
</NavLink>

</nav>

</div>

);

}