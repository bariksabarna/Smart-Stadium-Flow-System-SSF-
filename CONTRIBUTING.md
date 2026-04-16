# Contributing to StadiumPulse Pro

Thank you for your interest in contributing to StadiumPulse Pro! We follow professional standards to ensure the safety and reliability of stadium operations.

## Development Workflow

1. **Standard Hygiene**: Ensure all code is formatted with Prettier and passes ESLint verification.
   ```bash
   npm run format
   npm run lint
   ```
2. **Technical Standards**: 
   - Use ES6+ modules for all JS files.
   - All critical logic in the Intelligence Engine must have 100% test coverage.
   - New API endpoints must be documented and tested in `tests/api.test.js`.

3. **GCP Integration**: Any new features should maintain compatibility with Google Cloud Run and leverage structured logging.

4. **Accessibility**: All UI changes must maintain WCAG AA compliance.

## Security

If you find a security vulnerability, please refer to our [SECURITY.md](SECURITY.md) for disclosure details.
