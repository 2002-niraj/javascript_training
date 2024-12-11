import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();
import constant from "../constant/constant.js";
const { CONNECTION_SUCCESS,CONNECTION_FAILED} = constant.dbConstant
const {DB_HOST,DB_USER,DB_PASSWORD,DB_NAME } = process.env;
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password:DB_PASSWORD,
  database:DB_NAME,
  waitForConnections:true,
  connectionLimit:10,
  queueLimit:0
});

pool.getConnection((error,connection)=>{

    if(error){
      console.error(CONNECTION_FAILED);
    }
    console.log(CONNECTION_SUCCESS);
    connection.release(); 
  })
  
export default pool;