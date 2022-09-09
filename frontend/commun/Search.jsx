import { useState, useEffect } from "react";
import { getAllUsers } from "../services/user"
import Link from "next/link";
import { TextField } from "@mui/material";

const Search = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [originData, setOriginData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllUsers().then((data) => {
            setOriginData(data);
            setUsers(data);
        });
    }, [])

    useEffect(() => {
        if (search.length > 0) {
            const filteredUsers = originData.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));
            setUsers(filteredUsers)
        } else {
            setUsers(originData)
        }
    }, [search])

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="search">
            <TextField label="Search" variant="outlined" value={search} onChange={handleChange} />
            {search.length > 0 && (
                <div className="search-dropdown">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <Link href={`/profile/${user.id}`} key={user.id}>
                                <p>{user.username}</p>
                            </Link>
                        ))
                    ) : (
                        <p>No user found</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Search;