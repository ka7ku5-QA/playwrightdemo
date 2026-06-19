import type { User } from "../credentials";

const password = "secret_sauce";

export const users: { [key:string]: User } = {
    standardUser: {
        credentials: {
            username: "standard_user",
            password: password
        },
        account: {
            firstName: "standard",
            lastName: "User"
        },
    },
    incorrectCredentials: {
        credentials: {
            username: "inval",
            password: "123@"
        },
        account: {
            firstName: "Incorrect",
            lastName: "Creds"
        },
    },
    noCredentials: {
        credentials: {
            username: "",
            password: ""
        },
        account: {
            firstName: "No",
            lastName: "Creds"
        },
    },

    lockedOutUser: {
        credentials: {
            username: "locked_out_user",
            password: password
        },
        account: {
            firstName: "locked_out",
            lastName: "User"
        },
    },
    problemUser: {
        credentials: {
            username: "problem_user",
            password: password
        },
        account: {
            firstName: "Problem",
            lastName: "User"
        },
    },
    performanceGlitchUser: {
        credentials: {
            username: "performance_glitch_user",
            password: password
        },
        account: {
            firstName: "Performance_glitch",
            lastName: "User"
        },
    },
    errorUser: {
        credentials: {
            username: "error_user",
            password: password
        },
        account: {
            firstName: "Error",
            lastName: "User"
        },
    },
    visualUser: {
        credentials: {
            username: "visual_user",
            password: password
        },
        account: {
            firstName: "Visual",
            lastName: "User"
        },
    }
}