import React,{useEffect,useState} from "react";
import api from "../../api/api";

export default function Payroll(){

  const [payslips,setPayslips] = useState([]);

  useEffect(()=>{

    const fetchPayslips = async ()=>{

      const res = await api.get("/payroll/payslips");

      setPayslips(res.data);

    };

    fetchPayslips();

  },[]);

  return(

    <div>

      <h2>Payslip History</h2>

      <table border="1">

        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th>Base Salary</th>
            <th>LOP Days</th>
            <th>Deduction</th>
            <th>Net Salary</th>
          </tr>
        </thead>

        <tbody>

          {payslips.map(p=>(
            <tr key={p.id}>
              <td>{p.month}</td>
              <td>{p.year}</td>
              <td>{p.base_salary}</td>
              <td>{p.lop_days}</td>
              <td>{p.lop_deduction}</td>
              <td>{p.net_salary}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  );

}