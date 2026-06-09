// Generates a random 6-digit numeric string (100000–999999) used for email
// confirmation and password reset codes. Stored in the Token collection with a 10-minute TTL.
export const generateToken = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();
