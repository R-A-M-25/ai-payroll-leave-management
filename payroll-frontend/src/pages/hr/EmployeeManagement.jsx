import React,{useEffect,useState} from "react";
import api from "../../api/api";

export default function EmployeeManagement(){

  const [employees,setEmployees] = useState([]);

  const fetchEmployees = async ()=>{

    const res = await api.get("/employee/all");

    setEmployees(res.data);

  };

  useEffect(()=>{
    fetchEmployees();
  },[]);

  const deactivateEmployee = async(id)=>{

    const res = await api.patch(`/employee/deactivate/${id}`);

    alert(res.data.message);

    fetchEmployees();

  };

  return(

    <div>

      <h2>Employee Management</h2>

      <table border="1">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {employees.map(emp=>(
            <tr key={emp.id}>

              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>

              <td>

                <button
                  onClick={()=>deactivateEmployee(emp.id)}
                >
                  Deactivate
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

}