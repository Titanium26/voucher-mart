// lib/passwordRules.ts
export function passwordMeetsRules(pw: string) {
  return (
    typeof pw === "string" &&
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&        // uppercase
    /[a-z]/.test(pw) &&        // lowercase
    /[0-9]/.test(pw) &&        // number
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw) // symbol
  );
}

export const PASSWORD_RULES_TEXT =
  "Password must be 8+ characters and include uppercase, lowercase, a number, and a symbol.";
