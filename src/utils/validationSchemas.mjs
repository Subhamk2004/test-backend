export const createUserValidationSchema = {
    username: {
        in: ['body'],
        isString: {
            errorMessage: 'username must be a string'
        },
        notEmpty: {
            errorMessage: 'username must not be empty'
        },
        isLength: {
            options: { min: 3 },
            errorMessage: 'username must be at least 3 characters long'
        }
    },
    password: {
        in: ['body'],
        isString: {
            errorMessage: 'Name must be a string'
        },
        notEmpty: {
            errorMessage: 'Name must not be empty'
        },
        isLength: {
            options: { min: 5 },
            errorMessage: 'Name must be at least 5 characters long'
        }
    },
    firstname: {
        in: ['body'],
        isString: {
            errorMessage: 'First name must be a string'
        },
        notEmpty: {
            errorMessage: 'First Name must not be empty'
        }
    },
    lastname: {
        in: ['body'],
        isString: {
            errorMessage: 'Last name must be a string'
        },
        optional: true
    },
}

export const checkQueryValidationSchema = {
    filter: {
        in:['query'],
        isString: {
            errorMessage: 'Filter must be a string'
        },
        notEmpty: {
            errorMessage: 'Filter must not be empty'
        },
    }
}


// By default, it will check the request body. If you want to validate query parameters, you would need to specify this in your schema:

// ex:
// export const searchValidationSchema = {
//   term: {
//     in: ['query'],  // This specifies to look in the query parameters
//     isLength: {
//       options: { min: 3 },
//       errorMessage: 'Search term must be at least 3 characters long'
//     }
//   }
//   // ... other validations
// };


// This is a custom made schema and is used to make code simpler and easier to read and understand and make code more modular.