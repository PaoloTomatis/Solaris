// Definizione rateLimit base
const baseLimiter = {
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Massimo richieste raggiunte!',
        data: null,
        status: 429,
    },
};

// Definizione rateLimit login
export const loginLimiter = {
    windowMs: 15 * 60 * 1000,
    max: 10,
    ...baseLimiter,
};

// Definizione rateLimit register
export const registerLimiter = {
    windowMs: 60 * 60 * 1000,
    max: 3,
    ...baseLimiter,
};

// Definizione rateLimit refresh
export const refreshLimiter = {
    windowMs: 60 * 1000,
    max: 20,
    ...baseLimiter,
};

// Definizione rateLimit richieste get
export const getRequestsLimiter = {
    windowMs: 60 * 1000,
    max: 120,
    ...baseLimiter,
};

// Definizione rateLimit richieste post
export const postRequestsLimiter = {
    windowMs: 60 * 1000,
    max: 30,
    ...baseLimiter,
};

// Definizione rateLimit richieste patch
export const patchRequestsLimiter = {
    windowMs: 60 * 1000,
    max: 40,
    ...baseLimiter,
};

// Definizione rateLimit richieste delete
export const deleteRequestsLimiter = {
    windowMs: 60 * 1000,
    max: 40,
    ...baseLimiter,
};
