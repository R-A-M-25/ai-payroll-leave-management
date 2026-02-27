const pool = require("../config/db");

/* ===============================
   GET PROFILE
================================= */

exports.getProfile = async (req,res)=>{

try{

const userId=req.user.userId;

const result=await pool.query(
`
SELECT 
u.name,
u.email,
e.department,
e.created_at
FROM users u
JOIN employees e
ON u.id=e.user_id
WHERE u.id=$1
`,
[userId]
);

if(result.rows.length===0){

return res.status(404).json({
message:"Employee not found"
});

}

res.json(result.rows[0]);

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};



/* ===============================
   UPDATE PROFILE
================================= */

exports.updateProfile=async(req,res)=>{

try{

const userId=req.user.userId;

const {name,department}=req.body;

await pool.query(
`
UPDATE users
SET name=$1
WHERE id=$2
`,
[name,userId]
);

await pool.query(
`
UPDATE employees
SET department=$1
WHERE user_id=$2
`,
[department,userId]
);


const updated=await pool.query(
`
SELECT 
u.name,
u.email,
e.department,
e.created_at
FROM users u
JOIN employees e
ON u.id=e.user_id
WHERE u.id=$1
`,
[userId]
);

res.json(updated.rows[0]);

}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};



/* ===============================
   MANAGER TEAM ⭐
================================= */

exports.getTeam=async(req,res)=>{

try{

const userId=req.user.userId;


/* Manager Employee ID */

const manager=await pool.query(
"SELECT id FROM employees WHERE user_id=$1",
[userId]
);

if(manager.rows.length===0){

return res.status(404).json({
message:"Manager not found"
});

}


const managerId=manager.rows[0].id;


/* Team Members */

const result=await pool.query(
`
SELECT 
u.name,
u.email,
e.department,
e.designation,
e.created_at
FROM employees e
JOIN users u
ON e.user_id=u.id
WHERE e.manager_id=$1
ORDER BY u.name
`,
[managerId]
);


res.json(result.rows);


}catch(err){

console.error(err);

res.status(500).json({
message:"Server error"
});

}

};