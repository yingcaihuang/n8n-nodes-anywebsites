# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-06-27

### 🔄 Major Authentication Refactor

#### Changed
- **Authentication Method**: Complete overhaul from API Key to JWT Token authentication
  - Replaced API Key credentials with Username/Password login
  - Implemented automatic JWT token acquisition through `/api/auth/login` endpoint
  - Added intelligent token caching with automatic refresh on expiry
  - JWT tokens are cached for 1 hour with 5-minute early refresh buffer

#### Added
- **Login Flow**: Automatic login process before API calls
  - Username and password credential fields
  - JWT token management with caching
  - Automatic token refresh on 401 errors
  - Better error handling for authentication failures

#### Fixed
- **API Compatibility**: Now fully compatible with actual AnyWebsites API
  - Matches the authentication flow used in Go reference implementation
  - Proper JWT Bearer token authentication for all API calls
  - Correct credential testing using login endpoint

#### Technical Improvements
- Enhanced GenericFunctions with JWT token management
- Improved error handling with automatic retry on token expiry
- Better credential validation through actual login attempt
- Updated unit tests to reflect new authentication model

#### Breaking Changes
- **Credentials**: Existing API Key credentials are no longer valid
- **Setup**: Users must reconfigure with Username/Password instead of API Key
- **Authentication**: All API calls now use JWT tokens instead of API Keys

#### Verified Functionality
- ✅ Login with username/password
- ✅ JWT token acquisition and caching
- ✅ Content upload with authentication
- ✅ Content listing with authentication
- ✅ Automatic token refresh on expiry
- ✅ SSL certificate validation control

## [1.0.3] - 2024-06-27

### Fixed
- **Authentication Method**: Changed from X-API-Key header to Bearer token authentication
  - Updated credential authentication to use `Authorization: Bearer <token>` header
  - Fixed API requests to match actual AnyWebsites API authentication requirements
  - Updated GenericFunctions to use Bearer token instead of X-API-Key
  - This resolves "Authorization header required" and "Invalid token" errors

### Technical Improvements
- Updated unit tests to reflect new authentication method
- Improved API compatibility with actual AnyWebsites service
- Better alignment with standard Bearer token authentication practices

### Breaking Changes
- **Authentication**: Existing credentials may need to be reconfigured
- API Key format should be compatible with Bearer token authentication

## [1.0.2] - 2024-06-27

### Fixed
- **Credential Testing**: Fixed credential test configuration that was causing authentication validation issues
  - Changed test endpoint from `/health` to `/api/content` (existing API endpoint)
  - Fixed test rule configuration to use proper `responseCode` type with required `message` field
  - Resolved TypeScript compilation errors in credential test rules
  - Updated unit tests to reflect new test configuration

### Technical Improvements
- Improved credential validation reliability
- Better error handling for authentication test failures
- Enhanced type safety for credential test rules

## [1.0.1] - 2024-06-27

### Fixed
- **SVG Icon Display**: Fixed SVG icon path issue that prevented node icon from displaying correctly
  - Updated gulpfile.js to preserve directory structure when copying SVG files
  - SVG files now correctly placed in `dist/nodes/AnyWebsites/` directory

### Added
- **SSL Certificate Validation Control**: Added option to ignore SSL certificate validation
  - New "Ignore SSL Issues" toggle in credentials configuration (enabled by default)
  - Useful for self-signed certificates and development environments
  - Applied to both API requests and credential testing

### Technical Improvements
- Enhanced credential testing with SSL validation control
- Updated unit tests to cover new SSL option
- Improved build process for proper asset handling

## [1.0.0] - 2024-06-27

### Added
- Initial implementation of AnyWebsites n8n node
- Support for AnyWebsites API authentication with API key and base URL
- Core operations:
  - **Upload Content**: Upload HTML content and get published URL
  - **Get Content List**: Retrieve list of uploaded content with pagination
  - **Get Content**: Get specific content details by ID
  - **Update Content**: Update existing content
  - **Delete Content**: Delete content by ID
- Comprehensive error handling and type safety
- Support for public and private content with access codes
- Content expiration date support
- Automatic URL generation for uploaded content
- Unit tests for node and credentials
- Complete documentation with examples
- TypeScript configuration and build setup
- ESLint and Prettier configuration
- MIT License

### Features
- 🔐 **Secure Authentication**: API Key based authentication
- 📄 **HTML Content Management**: Full CRUD operations for HTML content
- 🌐 **Access Control**: Support for public/private content with access codes
- ⏰ **Content Expiration**: Optional expiration dates for content
- 📊 **Pagination**: Support for paginated content listing
- 🛡️ **Error Handling**: Comprehensive error handling with meaningful messages
- 📝 **TypeScript**: Full TypeScript support with type safety
- 🧪 **Testing**: Unit tests for all components
- 📚 **Documentation**: Comprehensive documentation and examples

### Technical Details
- Built with TypeScript for type safety
- Uses n8n-workflow interfaces for proper integration
- Follows n8n community node standards
- Includes proper error handling and validation
- Supports both Bearer token and API key authentication
- Automatic URL generation for published content
- Configurable base URL for different AnyWebsites instances

### Requirements
- Node.js >= 18.10
- n8n >= 1.0.0
- AnyWebsites API access

### Installation
```bash
npm install n8n-nodes-anywebsites
```

### Usage
1. Configure AnyWebsites API credentials in n8n
2. Add AnyWebsites node to your workflow
3. Select desired operation (Upload, Get, Update, Delete)
4. Configure parameters based on operation
5. Execute workflow to interact with AnyWebsites API
