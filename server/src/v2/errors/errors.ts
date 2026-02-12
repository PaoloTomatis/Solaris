// Lista errori
const errorsList = [
    { message: 'Irrigations data are less than 10', code: 400 },
    { message: 'Irrigations data are wrong', code: 400 },
    { message: 'The device must be owned by a user', code: 400 },
    { message: "The device mustn't be in automatic or safe mode", code: 400 },
    { message: 'Invalid authentication', code: 401 },
    { message: 'Invalid email or credentials', code: 401 },
    {
        message: 'The device does not exists or is owned by an other user',
        code: 403,
    },
    {
        message: 'The user has to be an admin to perform this action',
        code: 403,
    },
    { message: 'Device settings not found', code: 404 },
    { message: 'Sign keys are missing', code: 500 },
    { message: 'Creation of the device failed', code: 500 },
    { message: 'Activation failed', code: 500 },
    { message: 'Deletion of the device failed', code: 500 },
    { message: 'Update of device settings failed', code: 500 },
    { message: 'Deletion of the user failed', code: 500 },
    { message: 'Update of user settings failed', code: 500 },
];

// Esportazione lista
export default errorsList;
