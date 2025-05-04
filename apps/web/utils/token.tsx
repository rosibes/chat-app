export function isTokenExpired(token: string): boolean {
    try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) {
            throw new Error("Invalid token format");
        }
        const payload = JSON.parse(atob(payloadPart));
        return payload.exp < Math.floor(Date.now() / 1000);
    } catch {
        return true;
    }
}
