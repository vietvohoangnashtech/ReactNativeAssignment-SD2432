# Shopping App - Mobile (React Native)

A React Native shopping application with authentication, product catalog, shopping cart, and user profile management.

## Features

- **Authentication**: Login/Signup with JWT token management
- **4-Tab Navigation** (Post-Login):
  - **Discover**: Browse and discover products
  - **Search**: Shopping cart with search functionality
  - **Orders**: View order history and tracking
  - **Profile**: User profile management and settings
- **Product Details**: Full product information, features, and reviews
- **Shopping Cart**: Add/remove products, checkout
- **Order Management**: Track orders and order history
- **User Authentication**: Secure login with token storage

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── LoginForm.tsx
│   │   ├── Profile.tsx
│   │   ├── ProfileEdit.tsx
│   │   └── ScreenHeader.tsx
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.tsx         # Product discovery
│   │   ├── CartScreen.tsx         # Search & shopping cart
│   │   ├── OrderHistoryScreen.tsx # Order management
│   │   ├── ProfileScreen.tsx      # User profile
│   │   ├── LoginScreen.tsx        # Authentication
│   │   ├── ProductDetailScreen.tsx # Product details
│   │   └── CheckoutScreen.tsx     # Checkout flow
│   ├── store/               # State management (Zustand)
│   │   ├── authStore.ts
│   │   └── cartStore.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts
│   │   └── navigation.ts
│   ├── constants/           # App constants
│   │   ├── api.ts
│   │   └── theme.ts
│   └── utils/               # Utility functions
│       ├── axios.ts
│       └── localProfileDB.ts
├── __tests__/               # Test files
├── __mocks__/               # Mock modules
├── app.json                 # App configuration
├── App.tsx                  # Main app component with navigation
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── jest.config.js
└── package.json
```

## Navigation Structure

### Authentication Flow
- **Login Screen** → Authenticate user and get JWT token

### Main Tabs (Post-Login)
1. **Discover (Home)**: Product catalog and discovery
2. **Search (Cart)**: Search products and manage shopping cart
3. **Orders**: View order history and order details
4. **Profile**: User profile, settings, and profile editing

### Stack Navigation (Modal/Modal screens)
- **ProductDetail**: Full product information (from Home/Search)
- **Checkout**: Complete purchase
- **OrderHistory**: Detailed order information

## Tech Stack

- **React Native**: Cross-platform mobile development
- **React Navigation**: Navigation between screens
- **Zustand**: State management
- **TypeScript**: Type safety
- **Axios**: API calls
- **React Native Paper**: UI components
- **Material Community Icons**: Icon library
- **React Native Encrypted Storage**: Secure token storage
- **Jest**: Unit testing

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Install dependencies:
```bash
npm install
# OR
yarn install
```

2. Set up environment variables (create `.env` file):
```
API_BASE_URL=http://localhost:3000
```

## Running the App

### Step 1: Start Metro Server
```bash
npm start
# OR
yarn start
```

### Step 2: Run on Android
```bash
npm run android
# OR
yarn android
```

### Step 3: Run on iOS
```bash
npm run ios
# OR
yarn ios
```

## Development Commands

```bash
# Start development
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint

# Type check
npm run typecheck

# Build APK (Android)
npm run build:android

# Build IPA (iOS)
npm run build:ios
```

## API Integration

The app connects to a backend API. Ensure the backend server is running on `http://localhost:3000` or update `API_BASE_URL` in `.env`.

### API Endpoints Used:
- **Authentication**: `POST /auth/login`, `POST /auth/signup`
- **Products**: `GET /products`, `GET /products/:id`
- **Orders**: `GET /orders`, `POST /orders`
- **Users**: `GET /users/:id`, `PUT /users/:id`

## State Management

### Auth Store (Zustand)
Manages user authentication state:
- `isLoggedIn`: User login status
- `user`: Current user data
- `token`: JWT authentication token
- `login()`: Authenticate user
- `logout()`: Clear auth state

### Cart Store (Zustand)
Manages shopping cart state:
- `items`: Cart items array
- `addItem()`: Add product to cart
- `removeItem()`: Remove product from cart
- `clearCart()`: Empty the cart
- `getTotalPrice()`: Calculate total

## Type Definitions

### Navigation Types
- `RootStackParamList`: Main stack navigation parameters
- `MainTabParamList`: Bottom tab navigation parameters

### App Types
- `Product`: Product item type
- `User`: User data type
- `Order`: Order information type

See `src/types/index.ts` and `src/types/navigation.ts` for detailed types.

## Storage

- **Token Storage**: Encrypted storage for JWT tokens
- **User Profile**: Local database for user information
- **Async Storage**: Redux persist for state persistence

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test CartScreen.test.tsx

# Run with coverage
npm test -- --coverage
```

## Design System

### Color Palette
- **Primary Accent**: `#0DF2F2` (Cyan) - Active states, highlights
- **Dark**: `#0F172A`, `#111827` - Text, headings
- **Gray**: `#6B7280`, `#9CA3AF` - Secondary text
- **Light BG**: `#F9FAFB`, `#FFFFFF` - Backgrounds
- **Accent Red**: `#EF4444` - Danger states (Logout)

### Typography
- **Headings**: Inter 700/600, 20px
- **Body**: Inter 400, 14px  
- **Labels**: Inter 500, 12px (uppercase)

### Components
- **Border Radius**: 12px (cards), 9999px (pills/rounded)
- **Tab Height**: 60px
- **Shadow**: `0px 4px 20px 0px rgba(0, 0, 0, 0.05)`

## Troubleshooting

### Common Issues

**Port 8081 already in use**
```bash
# Kill the process using port 8081
npx kill-port 8081
```

**Android build fails**
```bash
# Clean gradle cache
cd android && ./gradlew clean && cd ..
npm run android
```

**iOS build fails**
```bash
# Clean build
rm -rf ~/Library/Developer/Xcode/DerivedData/*
npm run ios
```

**Module not found error**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Token not persisting**
- Ensure `react-native-encrypted-storage` is properly linked
- Check device storage permissions

## Contributing

When adding new features:
1. Create feature screens in `src/screens/`
2. Create components in `src/components/`
3. Update navigation types in `src/types/navigation.ts`
4. Add tests in `__tests__/`
5. Update this README with changes

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Jest Testing](https://jestjs.io/docs/getting-started)
