
import { useState, useEffect } from "react";
import { IUser } from "../../commun/types";
import { getUserByUsername } from "../../services/user";
import { Button, Box, Input } from "@mui/material";
import { useRouter } from "next/router";

const Login = () => {
    const [user, setUser] = useState<IUser>();
    const [input, setInput] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getUserByUsername(input).then((user) => {
            setUser(user);
        }).catch(() => {
            console.log("Failed to sign login")
        });
        setInput("");
    }

    useEffect(() => {
        if (user) {
            // token
            localStorage.setItem("user", JSON.stringify(user));
            router.push({
                pathname: '/chat',
                // query: { username: user.username },
              });
        }
    }, [user]);

    return (
        <Box sx={{padding: "10px"}}>
             <form
                onSubmit={handleSubmit}
                style={{display: "flex", gap: "5px"}}
                >
                <Input
                    type='text'
                    placeholder='Enter your name'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button type='submit' variant='outlined' color='primary'>Authenticate</Button>
      </form>
        </Box>
    );
};

export default Login;
