// app/_context/AuthContext.js or wherever your context is

import { createContext } from 'react';

// ✅ This creates the context object
const AuthContext = createContext(null);

// ✅ This exports it properly
export default AuthContext;
