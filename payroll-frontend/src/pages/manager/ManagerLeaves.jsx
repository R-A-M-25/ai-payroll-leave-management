import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ManagerLeaves() {

const { token } = useAuth();

const [leaves,setLeaves]=useState([]);
const [loading,setLoading]=useState(true);



useEffect(()=>{

fetchLeaves();

},[]);



const fetchLeaves=async()=>{

try{

const res=await axios.get(

"http://localhost:5000/api/leaves/manager",

{
headers:{
Authorization:`Bearer ${token}`
}
}

);

setLeaves(res.data);

}catch(err){

console.error(err);

}finally{

setLoading(false);

}

};



const updateStatus=async(id,status)=>{

try{

await axios.put(

`http://localhost:5000/api/leaves/${id}/status`,

{status},

{
headers:{
Authorization:`Bearer ${token}`
}
}

);


fetchLeaves();


}catch(err){

console.error(err);

alert("Update failed");

}

};



const formatDate=(date)=>{

return new Date(date).toLocaleDateString();

};



const statusBadge=(status)=>{

const base="px-3 py-1 rounded-full text-xs font-medium";


if(status==="PENDING")
return `${base} bg-yellow-100 text-yellow-700`;

if(status==="APPROVED")
return `${base} bg-green-100 text-green-700`;

if(status==="REJECTED")
return `${base} bg-red-100 text-red-700`;

};



return(

<div className="space-y-10">

{/* Header */}

<div>

<h1 className="text-3xl font-semibold">

Leave Requests

</h1>

<p className="text-gray-500">

Review employee leave applications

</p>

</div>



<div className="bg-white rounded-3xl shadow border overflow-hidden">


{loading ? (

<div className="p-10 text-center text-gray-500">

Loading leave requests...

</div>

)

:

leaves.length===0 ? (

<div className="p-10 text-center text-gray-500">

No leave requests

</div>

)

:

(

<table className="w-full text-sm">

<thead className="bg-gray-50 text-gray-500 text-xs uppercase">

<tr>

<th className="px-6 py-4 text-left">

Employee

</th>

<th className="px-6 py-4 text-left">

Type

</th>

<th className="px-6 py-4 text-left">

Dates

</th>

<th className="px-6 py-4 text-left">

Reason

</th>

<th className="px-6 py-4 text-left">

Status

</th>

<th className="px-6 py-4 text-left">

Action

</th>

</tr>

</thead>


<tbody className="divide-y">

{leaves.map(leave=>(

<tr key={leave.id}>

<td className="px-6 py-4">

{leave.employee_email}

</td>


<td className="px-6 py-4">

{leave.leave_type}

</td>


<td className="px-6 py-4">

{formatDate(leave.start_date)} -
{formatDate(leave.end_date)}

</td>


<td className="px-6 py-4 text-gray-600">

{leave.reason}

</td>


<td className="px-6 py-4">

<span className={statusBadge(leave.status)}>

{leave.status}

</span>

</td>


<td className="px-6 py-4">


{leave.status==="PENDING" && (

<div className="flex gap-2">


<button
onClick={()=>updateStatus(leave.id,"APPROVED")}
className="bg-green-600 text-white px-3 py-1 rounded"
>
Approve
</button>


<button
onClick={()=>updateStatus(leave.id,"REJECTED")}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Reject
</button>


</div>

)}


</td>


</tr>

))}

</tbody>

</table>

)

}


</div>

</div>

);
}