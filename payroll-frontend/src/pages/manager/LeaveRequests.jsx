const LeaveRequests = () => {
  return (
    <div className="container">
      <h2>Leave Requests</h2>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave</th>
            <th>Dates</th>
            <th>AI Tag</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ram</td>
            <td>SL</td>
            <td>12–13 Jan</td>
            <td>Medical | High</td>
            <td className="actions">
              <button disabled>Approve</button>
              <button disabled className="secondary">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequests;
