import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManagerOverview() {

const { token } = useAuth();
const navigate = useNavigate();

const [team,setTeam]=useState([]);
const [pendingLeaves,setPendingLeaves]=useState([]);
const [loading,setLoading]=useState(true);


useEffect(()=>{

fetchData();

},[]);



const fetchData=async()=>{

try{

/* Team */

const teamRes=await axios.get(

"http://localhost:5000/api/employee/team",

{
headers:{
Authorization:`Bearer ${token}`
}
}

);

setTeam(teamRes.data);



/* Leaves */

const leaveRes=await axios.get(

"http://localhost:5000/api/leaves/manager",

{
headers:{
Authorization:`Bearer ${token}`
}
}

);


const pending=leaveRes.data.filter(
l=>l.status==="PENDING"
);

setPendingLeaves(pending);


}catch(err){

console.error(err);

}finally{

setLoading(false);

}

};



const formatDate=(date)=>{

return new Date(date).toLocaleDateString();

};



return(

<div className="space-y-10">


{/* Header */}

<div>

<h1 className="text-3xl font-semibold">

Manager Dashboard

</h1>

<p className="text-gray-500">

Manage your team and leave requests

</p>

</div>



{/* Stats */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">


<div className="bg-white p-6 rounded-2xl shadow border">

<h3 className="text-gray-500 text-sm">

Team Members

</h3>

<p className="text-3xl font-semibold mt-2">

{loading?"-":team.length}

</p>

</div>



<div className="bg-white p-6 rounded-2xl shadow border">

<h3 className="text-gray-500 text-sm">

Pending Leaves

</h3>

<p className="text-3xl font-semibold mt-2 text-yellow-600">

{loading?"-":pendingLeaves.length}

</p>

</div>

</div>



{/* Pending Leaves Widget */}

<div className="bg-white p-8 rounded-3xl shadow border">

<div className="flex justify-between mb-6">

<h2 className="text-xl font-semibold">

Pending Leave Requests

</h2>

<button
onClick={()=>navigate("/manager/leaves")}
className="text-blue-600 text-sm"
>
View All
</button>

</div>


{loading ? (

<p className="text-gray-500">

Loading...

</p>

)

:

pendingLeaves.length===0 ? (

<p className="text-gray-500">

No pending requests

</p>

)

:

(

<table className="w-full text-sm">

<thead className="text-gray-500 text-xs uppercase">

<tr>

<th className="text-left py-2">
Employee
</th>

<th className="text-left py-2">
Type
</th>

<th className="text-left py-2">
Dates
</th>

</tr>

</thead>


<tbody>

{pendingLeaves.slice(0,5).map(leave=>(

<tr key={leave.id}>

<td className="py-2">

{leave.employee_email}

</td>

<td className="py-2">

{leave.leave_type}

</td>

<td className="py-2">

{formatDate(leave.start_date)} -
{formatDate(leave.end_date)}

</td>

</tr>

))}

</tbody>

</table>

)

}


</div>



{/* Team Snapshot */}

<div className="bg-white p-8 rounded-3xl shadow border">

<div className="flex justify-between mb-6">

<h2 className="text-xl font-semibold">

Team Snapshot

</h2>

<button
onClick={()=>navigate("/manager/team")}
className="text-blue-600 text-sm"
>
View Team
</button>

</div>


{loading ? (

<p className="text-gray-500">

Loading...

</p>

)

:

team.length===0 ? (

<p className="text-gray-500">

No team members

</p>

)

:

(

<div className="space-y-3">

{team.slice(0,5).map((emp,index)=>(

<div
key={index}
className="flex justify-between border-b pb-2"
>

<span>

{emp.name}

</span>

<span className="text-gray-500">

{emp.department}

</span>

</div>

))}

</div>

)

}


</div>



</div>

);
}