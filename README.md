# auth-engine-dashboard

Next.js dashboard for **AuthEngine** — platform and tenant administration, user self-service, MFA and passkeys.

**Documentation:** [auth-engine-docs](https://github.com/auth-engine/auth-engine-docs) · published at [docs.authengine.org](https://docs.authengine.org)

| Guide | Link |
|-------|------|
| Quick Start | [quick-start.md](https://docs.authengine.org/quick-start/) |
| OAuth2 / OIDC | [oauth2-oidc-guides.md](https://docs.authengine.org/oauth2-oidc-guides/) |
| API Reference | [api-reference.md](https://docs.authengine.org/api-reference/) |
| Architecture | [architecture.md](https://docs.authengine.org/architecture/) |
| Deployment | [deployment.md](https://docs.authengine.org/deployment/) |
| Security | [security-overview.md](https://docs.authengine.org/security-overview/) |

## Production

| Host | Role |
|------|------|
| [api.authengine.org](https://api.authengine.org) | API + Swagger |
| [auth.authengine.org](https://auth.authengine.org) | OIDC / login UI |
| [app.authengine.org](https://app.authengine.org) | Admin dashboard |
| [docs.authengine.org](https://docs.authengine.org) | Documentation |

## Docker

Dockerfile only — compose files live in **[auth-engine-infra/compose](https://github.com/auth-engine/auth-engine-infra/tree/main/compose)**.

```bash
cd auth-engine-infra/compose
docker compose up -d --build
```

Pre-built production images and CI/CD: [Deployment guide](https://docs.authengine.org/deployment/).

## Related repositories

| Repository | Role |
|------------|------|
| [auth-engine](https://github.com/auth-engine/auth-engine) | Backend API |
| [auth-engine-data](https://github.com/auth-engine/auth-engine-data) | Roles, permissions & super-admin seeding |
| [auth-engine-docs](https://github.com/auth-engine/auth-engine-docs) | Platform documentation |
| [auth-engine-infra](https://github.com/auth-engine/auth-engine-infra) | Terraform & Docker Compose |
