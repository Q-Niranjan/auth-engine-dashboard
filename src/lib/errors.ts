import axios from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string") return detail;
        if (Array.isArray(detail)) {
            return detail
                .map((item) =>
                    typeof item === "object" && item !== null && "msg" in item
                        ? String((item as { msg: unknown }).msg)
                        : String(item)
                )
                .join(", ");
        }
    }
    if (error instanceof Error && error.message) return error.message;
    return fallback;
}

export function isNotAllowedError(error: unknown): boolean {
    return error instanceof DOMException && error.name === "NotAllowedError";
}
