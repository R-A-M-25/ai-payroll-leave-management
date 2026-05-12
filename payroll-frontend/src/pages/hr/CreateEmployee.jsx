import React,{useState} from "react";
import api from "../../api/api";

export default function PayrollManagement(){

  const [employeeId,setEmployeeId] = useState("");
  const [salary,setSalary] = useState("");
  const [date,setDate] = useState("");

  const [month,setMonth] = useState("");
  const [year,setYear] = useState("");

  const assignSalary = async ()=>{

    const res = await api.post("/payroll/salary", {
      employee_id:employeeId,
      monthly_salary:salary,
      effective_from:date
    });

    alert(res.data.message);

  };

  const runPayroll = async ()=>{

    const res = await api.post("/payroll/run", {
      month,
      year
    });

    alert(res.data.message);

  };

  return(

    <div>

      <h2>Payroll Management</h2>

      <h3>Assign Salary</h3>

      <input
        placeholder="Employee ID"
        onChange={(e)=>setEmployeeId(e.target.value)}
      />

      <input
        placeholder="Monthly Salary"
        onChange={(e)=>setSalary(e.target.value)}
      />

      <input
        type="date"
        onChange={(e)=>setDate(e.target.value)}
      />

      <button onClick={assignSalary}>
        Assign Salary
      </button>


      <h3>Run Payroll</h3>

      <input
        placeholder="Month"
        onChange={(e)=>setMonth(e.target.value)}
      />

      <input
        placeholder="Year"
        onChange={(e)=>setYear(e.target.value)}
      />

      <button onClick={runPayroll}>
        Run Payroll
      </button>

    </div>

  );

}