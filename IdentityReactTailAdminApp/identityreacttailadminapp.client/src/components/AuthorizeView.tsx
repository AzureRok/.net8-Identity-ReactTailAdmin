import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from './UserContext';

interface User {
    email: string;
    fullName: string;
    roles: string[];
}

function AuthorizeView(props: { children: React.ReactNode }) {

    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); 
    let emptyuser: User = { email: "", fullName:"", roles :[] };

    const [user, setUser] = useState(emptyuser);

    useEffect(() => {
        if (authorized) return;
        let retryCount = 0; 
        let maxRetries = 10;
        let delay: number = 1000;

        function wait(delay: number) {
            return new Promise((resolve) => setTimeout(resolve, delay));
        }

        async function fetchWithRetry(url: string, options: any) {
            try {
                let response = await fetch(url, options);

                if (response.status == 200) {
                    console.log("Authorized");
                    let dto: any = await response.json();
                    setUser({ email: dto.email, fullName: dto.fullName, roles: dto.roles });
                    setAuthorized(true);
                    return response;
                } else if (response.status == 401) {
                    console.log("Unauthorized");
                    return response; 
                } else {
                    throw new Error("" + response.status);
                }
            } catch (error) {
                retryCount++;
                if (retryCount > maxRetries) {
                    throw error;
                } else {
                    await wait(delay);
                    return fetchWithRetry(url, options);
                }
            }
        }

        fetchWithRetry("/auth-data", {
            method: "GET",
        })
            .catch((error) => {
                console.log(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    if (loading) {
        return (
            <>
                <p>Loading...</p>
            </>
        );
    }
    else {
        if (authorized && !loading) {
            return (
                <>
                    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
                </>
            );
        } else {
            return (
                <>
                    <Navigate to="/auth/signin" />
                </>
            )
        }
    }

}

export default AuthorizeView;