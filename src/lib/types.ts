export interface UserResponse {
    id: string;
    email: string;
    username?: string;
    phone_number?: string | null;
    first_name?: string;
    last_name?: string;
    avatar_url?: string | null;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
    is_email_verified: boolean;
    is_phone_verified: boolean;
    mfa_enabled: boolean;
    auth_strategies: string[];
    created_at: string;
    last_login_at?: string | null;
    roles: Array<{
        role: {
            id: string;
            name: string;
            description: string;
            scope: string;
            level: number;
            created_at: string;
        };
        tenant_id: string;
    }>;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user?: UserResponse;
}

export interface TenantResponse {
    id: string;
    name: string;
    description?: string;
    type: string;
    owner_id: string;
}
export interface OAuthLoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    is_new_user: boolean;
    provider: "google" | "github" | "microsoft" | "authengine";
}
