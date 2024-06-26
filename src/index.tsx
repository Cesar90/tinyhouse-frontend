// import React, { useState, useEffect, useRef } from "react";
import React, { useState } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom' 
import ApolloClient from "apollo-boost"
import { ApolloProvider, useMutation } from '@apollo/react-hooks';
import { StripeProvider, Elements } from "react-stripe-elements";
// import { Layout,Spin, Affix } from 'antd'
import { Layout, Affix } from 'antd'
import {
    AppHeader,
    Home, 
    WrappedHost as Host, 
    Listing, 
    Listings, 
    Login, 
    NotFound,
    Stripe, 
    User} from "./sections";
// import { AppHeaderSkeleton } from "./lib/components";
import { LOG_IN } from "./lib/graphql/mutations/LogIn";
import { LogIn as LogInData, LogInVariables } from "./lib/graphql/mutations/LogIn/__generated__/LogIn"
import { Viewer } from './lib/types'
import * as serviceWorker from "./serviceWorker";
import "./styles/index.css"
import { ErrorBanner } from "./lib/components/ErrorBanner"

const client = new ApolloClient({
    //uri: "https://cesar-tinyhouse-backend.vercel.app/api",
    uri: "https://www.tinyhouse.app/api",
    request: async operation => {
        const token = sessionStorage.getItem("token")
        operation.setContext({
            headers: {
                "X-CSRF-TOKEN": token || ""
            }
        })
    }
})

const initialViewer: Viewer ={
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false
}

const App = () => {
    const [viewer, setViewer] = useState<Viewer>(initialViewer)
    // console.log(viewer) //Check the console to see viewer details after logging in
    // const [logIn, {error} ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    const [, {error} ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: data => {
            if(data && data.logIn){
                // console.log("onClompletedHere", data)
                setViewer(data.logIn)

                if(data.logIn.token){
                    sessionStorage.setItem("token", data.logIn.token)
                } else {
                    sessionStorage.removeItem("token")
                }

            }
        }
    })

    // const logInRef = useRef(logIn)
    // useEffect(() => {
    //     logInRef.current()
    // }, [])
    

    // if(!viewer.didRequest && !error){
    //     return (
    //         <Layout className="app-skeleton">
    //             <AppHeaderSkeleton />
    //             <div className="app-skeleton__spin-section">
    //                 <Spin size="large" tip="Launching Tinyhouse" />
    //             </div>
    //         </Layout>
    //     )
    // }
    
    console.log(error)
    const logInErrorBannerElement = error ? <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" /> : null

    return (
        <StripeProvider 
            apiKey={process.env.REACT_APP_S_PUBLISHABLE_KEY as string}>
            <Router>
            <Layout id="app">
                {logInErrorBannerElement}
                <Affix offsetTop={0} className="app__affix-header">
                    <AppHeader 
                    viewer={viewer} 
                    setViewer={setViewer} />
                </Affix>
                
                <Switch>
                    <Route exact path="/" 
                        component={Home} />
                    <Route 
                        exact 
                        path="/host" 
                        render={props => <Host {...props} viewer={viewer} />}    />
                    <Route 
                        exact
                        path="/listing/:id"
                        render={props => 
                            <Elements>
                                <Listing {...props} viewer={viewer} />
                            </Elements>
                        }
                    />

                    <Route exact path="/listings/:location?"  component={Listings} />
                    <Route exact path="/login" render={props => <Login {...props} setViewer={setViewer} />} />
                    <Route exact path="/stripe" render={props => <Stripe {...props} viewer={viewer} setViewer={setViewer} />} />
                    <Route exact path="/user/:id" render={props => <User {...props} viewer={viewer} setViewer={setViewer} />} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </Router>
        </StripeProvider>
    )
}

render(
    <ApolloProvider client={client}>
        {/* <Listings title="TinyHouse Listings" /> */}
        <App />
    </ApolloProvider>
    
    , document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
