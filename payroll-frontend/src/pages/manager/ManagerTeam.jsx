import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function TeamMembers() {

  const { token } = useAuth();

  const [members,setMembers]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetchMembers();
  },[]);


  const fetchMembers = async ()=>{

    try{

      const res = await axios.get(
        "http://localhost:5000/api/employee/team",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      setMembers(res.data);

    }catch(err){

      console.error(err);

    }finally{

      setLoading(false);

    }

  };


  const formatDate=(date)=>{

    if(!date) return "-";

    return new Date(date).toLocaleDateString();

  };


  return (

    <div className="max-w-6xl mx-auto space-y-10">

      <h1 className="text-3xl font-semibold">
        Team Members
      </h1>


      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">


        {loading ? (

          <div className="p-10 text-center">
            Loading team members...
          </div>

        ) : members.length===0 ? (

          <div className="p-10 text-center text-gray-500">
            No team members assigned
          </div>

        ):(


        <table className="w-full">

          <thead className="bg-gray-50 text-left">

            <tr>

              <th className="p-4">
                Name
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Department
              </th>

              <th className="p-4">
                DOJ
              </th>

            </tr>

          </thead>


          <tbody>

            {members.map((m)=>(
              
              <tr
              key={m.id}
              className="border-t"
              >

                <td className="p-4">
                  {m.name}
                </td>

                <td className="p-4">
                  {m.email}
                </td>

                <td className="p-4">
                  {m.department}
                </td>

                <td className="p-4">
                  {formatDate(m.doj)}
                </td>

              </tr>

            ))}

          </tbody>


        </table>

        )}

      </div>


    </div>

  );

}