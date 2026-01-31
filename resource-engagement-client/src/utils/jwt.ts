import { jwtDecode } from "jwt-decode";
import type { IJwtPayload } from "../types";

/**
 * Utility functions for JWT token handling
 */

/**
 * Decodes a JWT token and returns the payload
 * @param token - JWT token string
 * @returns Decoded JWT payload
 */
export function decodeJwtToken(token: string): IJwtPayload | null {
  try {
    const decoded = jwtDecode<IJwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Gets the expiration date of a JWT token
 * @param token - JWT token string
 * @returns Date object or null if token is invalid
 */
export function getTokenExpirationDate(token: string): Date | null {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Gets the time remaining until token expires in seconds
 * @param token - JWT token string
 * @returns seconds until expiration or 0 if expired/invalid
 */
export function getTokenTimeRemaining(token: string): number {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Date.now() / 1000;
    const timeRemaining = decoded.exp - currentTime;
    return Math.max(0, timeRemaining);
  } catch {
    return 0;
  }
}

/**
 * Extracts user information from JWT token payload
 * @param token - JWT token string
 * @returns User information from token or null
 */
export function getUserFromToken(
  token: string
): { id: string; email: string; name?: string } | null {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded || !decoded.sub || !decoded.email) {
      return null;
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

/**
 * Validates if a JWT token has the required structure and is not expired
 * @param token - JWT token string
 * @returns true if token is valid and not expired
 */
export function isValidToken(token: string): boolean {
  if (!token) return false;

  try {
    const decoded = decodeJwtToken(token);
    if (!decoded) return false;

    // Check required fields
    if (!decoded.sub || !decoded.exp) return false;

    // Check if token is expired
    return !isTokenExpired(token);
  } catch {
    return false;
  }
}
