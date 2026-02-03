/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel, PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
    auth: {
        clientId: 'c8233776-db0b-4bde-bb3e-ba6112b7539e', // This is the ONLY mandatory field that you need to supply.
        authority: 'https://login.microsoftonline.com/2ab8e9cd-018a-4b90-b107-815f3a0d91b5', // Replace the placeholder with your tenant subdomain
        redirectUri: 'http://localhost:5173/login/redirect', // Points to window.location.origin. You must register this URI on Microsoft Entra admin center/App Registration.
        postLogoutRedirectUri: '/login', // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    system: {
        responseMode: "query", // 🔑 THIS IS THE FIX
    },
    cache: {
        cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const loginRequest = {
    scopes: [
        "User.Read"
    ],
};

export const msalInstance = new PublicClientApplication(msalConfig);
