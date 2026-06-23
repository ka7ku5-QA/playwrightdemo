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
            lastName: "User",
            zipCode: '12345',
        },
    },
    incorrectCredentials: {
        credentials: {
            username: "inval",
            password: "123@"
        },
        account: {
            firstName: "Incorrect",
            lastName: "Creds",
            zipCode: ""
        },
    },
    noCredentials: {
        credentials: {
            username: "",
            password: ""
        },
        account: {
            firstName: "No",
            lastName: "Creds",
            zipCode: ""
        },
    },

    lockedOutUser: {
        credentials: {
            username: "locked_out_user",
            password: password
        },
        account: {
            firstName: "locked_out",
            lastName: "User",
            zipCode: ""
        },
    },
    problemUser: {
        credentials: {
            username: "problem_user",
            password: password
        },
        account: {
            firstName: "Problem",
            lastName: "User",
            zipCode: ""
        },
    },
    performanceGlitchUser: {
        credentials: {
            username: "performance_glitch_user",
            password: password
        },
        account: {
            firstName: "Performance_glitch",
            lastName: "User",
            zipCode: ""
        },
    },
    errorUser: {
        credentials: {
            username: "error_user",
            password: password
        },
        account: {
            firstName: "Error",
            lastName: "User",
            zipCode: ""
        },
    },
    visualUser: {
        credentials: {
            username: "visual_user",
            password: password
        },
        account: {
            firstName: "Visual",
            lastName: "User",
            zipCode: ""
        },
    }
}