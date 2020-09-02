import React from 'react'
import { Route, Redirect } from 'react-router-dom'
const PrivateRoute = ({component: Component, ...props}) => {
    return <Route {...props} render={(p) => {
        const login = document.cookie.includes('login=true')
        if (login){ 
            return <Component />
        } else { 
            alert("Please log in, then you can access this web!")
            return <Redirect to={{
                pathname: '/',
                state: {
                    from: p.location.pathname
                }
            }}/>
        }
    }}/>
}
export default PrivateRoute