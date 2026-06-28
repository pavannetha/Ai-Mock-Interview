import axios from "axios";
import React, { useEffect, useState } from "react";
import { FunnelChart } from "recharts";

export default function State() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  async function getUsers() {
    setIsloading(true);
    try {
      setTimeout(async () => {
        const data = await axios.get(`https://dummyjson.com/users`);
        console.log(data, "data in getUsers");
        setUsers(data.data.users);
        setIsloading(false);
      }, 3000);
    } catch (err) {
      setIsloading(false);
    }
  }
  console.log(users, "users in getUsers");
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      {isLoading && <p>Loading...</p>}
      <ol>
        {users.map((user) => {
          return <li>{user.firstName}</li>;
        })}
      </ol>
    </div>
  );
}
