/**
 * AppNavigator — Full Navigation Structure (Phase 7–12)
 *
 * Structure:
 *  Root Stack
 *  ├── Splash
 *  ├── Onboarding        ← Phase 11 (first-launch only)
 *  ├── Login
 *  ├── Register
 *  ├── ForgotPassword    ← Phase 10
 *  ├── UserRoot  (Bottom Tab Navigator)
 *  │    ├── HomeTab       → HomeScreen
 *  │    ├── ExploreTab    → Stack (Destinations → PackageList → PackageDetails)
 *  │    ├── WishlistTab   → WishlistScreen
 *  │    ├── BookingsTab   → BookingsScreen
 *  │    └── ProfileTab    → ProfileScreen
 *  └── AdminRoot (Stack Navigator)
 *       └── AdminDashboard + all admin screens incl. Analytics (Phase 12)
 *
 *  Screens above tabs:
 *  ├── PackageDetails, Booking, Checkout, BookingConfirmation
 *  ├── BookingDetail, Notifications
 *  ├── ReviewSubmit    ← Phase 7
 *  ├── ChangePassword  ← Phase 7
 *  ├── HelpSupport     ← Phase 7
 *  ├── Search          ← Phase 10
 *  ├── MyReviews       ← Phase 11
 *  ├── Offers          ← Phase 12
 *  └── Terms           ← Phase 12
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'; // Phase 10
import OnboardingScreen from '../screens/auth/OnboardingScreen';          // Phase 11

// User Screens
import HomeScreen from '../screens/user/HomeScreen';
import DestinationsScreen from '../screens/user/DestinationsScreen';
import PackageListScreen from '../screens/user/PackageListScreen';
import PackageDetailsScreen from '../screens/user/PackageDetailsScreen';
import BookingScreen from '../screens/user/BookingScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';
import BookingConfirmationScreen from '../screens/user/BookingConfirmationScreen';
import BookingsScreen from '../screens/user/BookingsScreen';
import BookingDetailScreen from '../screens/user/BookingDetailScreen';
import WishlistScreen from '../screens/user/WishlistScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';

// Phase 7 — New user screens
import ReviewSubmitScreen from '../screens/user/ReviewSubmitScreen';
import ChangePasswordScreen from '../screens/user/ChangePasswordScreen';
import HelpSupportScreen from '../screens/user/HelpSupportScreen';

// Phase 10–12 — New user screens
import SearchScreen from '../screens/user/SearchScreen';           // Phase 10
import MyReviewsScreen from '../screens/user/MyReviewsScreen';     // Phase 11
import EditProfileScreen from '../screens/user/EditProfileScreen'; // Phase 11
import OffersScreen from '../screens/user/OffersScreen';           // Phase 12
import TermsScreen from '../screens/user/TermsScreen';             // Phase 12

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminLoginScreen from '../screens/admin/AdminLoginScreen';
import AdminPackagesScreen from '../screens/admin/AdminPackagesScreen';
import AdminPackageFormScreen from '../screens/admin/AdminPackageFormScreen';
import AdminCouponsScreen from '../screens/admin/AdminCouponsScreen';
import AdminCouponFormScreen from '../screens/admin/AdminCouponFormScreen';
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen';
import AdminBookingDetailScreen from '../screens/admin/AdminBookingDetailScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminReviewsScreen from '../screens/admin/AdminReviewsScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen'; // Phase 12

import { Colors, Theme } from '../constants';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExploreStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();

// ── Explore Stack: Destinations → PackageList → PackageDetails ──
const ExploreNavigator = () => (
  <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
    <ExploreStack.Screen name="Destinations" component={DestinationsScreen} />
    <ExploreStack.Screen name="PackageList" component={PackageListScreen} />
    <ExploreStack.Screen name="PackageDetails" component={PackageDetailsScreen} />
  </ExploreStack.Navigator>
);

// ── Tab icon — clean text symbol, no emoji ──────────────────────
const TabIcon = ({ symbol, label, focused, color }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 18, color, fontWeight: focused ? '700' : '400', lineHeight: 22 }}>
      {symbol}
    </Text>
  </View>
);

// ── User Bottom Tab Navigator ────────────────────────────────────
const UserTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontSize: Theme.fontSize.xs,
        fontWeight: Theme.fontWeight.medium,
      },
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon symbol="⌂" focused={focused} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="ExploreTab"
      component={ExploreNavigator}
      options={{
        tabBarLabel: 'Explore',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon symbol="◎" focused={focused} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="WishlistTab"
      component={WishlistScreen}
      options={{
        tabBarLabel: 'Wishlist',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon symbol="♡" focused={focused} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="BookingsTab"
      component={BookingsScreen}
      options={{
        tabBarLabel: 'Bookings',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon symbol="≡" focused={focused} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused, color }) => (
          <TabIcon symbol="◉" focused={focused} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

// ── Admin Stack Navigator ────────────────────────────────────────
const AdminNavigator = () => (
  <AdminStack.Navigator screenOptions={{ headerShown: false }}>
    <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <AdminStack.Screen name="AdminPackages" component={AdminPackagesScreen} />
    <AdminStack.Screen name="AdminPackageForm" component={AdminPackageFormScreen} />
    <AdminStack.Screen name="AdminCoupons" component={AdminCouponsScreen} />
    <AdminStack.Screen name="AdminCouponForm" component={AdminCouponFormScreen} />
    <AdminStack.Screen name="AdminBookings" component={AdminBookingsScreen} />
    <AdminStack.Screen name="AdminBookingDetail" component={AdminBookingDetailScreen} />
    <AdminStack.Screen name="AdminUsers" component={AdminUsersScreen} />
    <AdminStack.Screen name="AdminReviews" component={AdminReviewsScreen} />
    <AdminStack.Screen name="AdminAnalytics" component={AdminAnalyticsScreen} />
  </AdminStack.Navigator>
);

// ── Root Stack (entire app) ──────────────────────────────────────
const AppNavigator = () => (
  <NavigationContainer>
    <RootStack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      {/* Auth */}
      <RootStack.Screen name="Splash" component={SplashScreen} />
      <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <RootStack.Screen name="AdminLogin" component={AdminLoginScreen} />

      {/* User app (with bottom tabs) */}
      <RootStack.Screen name="UserRoot" component={UserTabNavigator} />

      {/* Screens that appear above the tab bar */}
      <RootStack.Screen name="PackageDetails" component={PackageDetailsScreen} />
      <RootStack.Screen name="Booking" component={BookingScreen} />
      <RootStack.Screen name="Checkout" component={CheckoutScreen} />
      <RootStack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <RootStack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <RootStack.Screen name="Notifications" component={NotificationsScreen} />

      {/* Phase 7 — User feature screens */}
      <RootStack.Screen name="ReviewSubmit" component={ReviewSubmitScreen} />
      <RootStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <RootStack.Screen name="HelpSupport" component={HelpSupportScreen} />

      {/* Phase 10–12 — New feature screens */}
      <RootStack.Screen name="Search" component={SearchScreen} />
      <RootStack.Screen name="MyReviews" component={MyReviewsScreen} />
      <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
      <RootStack.Screen name="Offers" component={OffersScreen} />
      <RootStack.Screen name="Terms" component={TermsScreen} />

      {/* Admin app */}
      <RootStack.Screen name="AdminRoot" component={AdminNavigator} />
    </RootStack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
