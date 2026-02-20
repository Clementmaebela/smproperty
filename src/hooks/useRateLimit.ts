// Rate Limiting Hook for Authentication
import { useState, useCallback } from 'react';

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  isLocked: boolean;
  lockUntil: number;
}

const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  attemptWindow: 5 * 60 * 1000, // 5 minutes
};

const useRateLimit = () => {
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    isLocked: false,
    lockUntil: 0,
  });

  const checkRateLimit = useCallback((): { allowed: boolean; error?: string } => {
    const now = Date.now();
    const { attempts, lastAttempt, isLocked, lockUntil } = rateLimitState;

    // Check if currently locked out
    if (isLocked && now < lockUntil) {
      const remainingTime = Math.ceil((lockUntil - now) / 60000);
      return {
        allowed: false,
        error: `Too many failed attempts. Please try again in ${remainingTime} minutes.`
      };
    }

    // Reset if lockout period has passed
    if (isLocked && now >= lockUntil) {
      setRateLimitState({
        attempts: 0,
        lastAttempt: 0,
        isLocked: false,
        lockUntil: 0,
      });
    }

    return { allowed: true };
  }, [rateLimitState]);

  const recordAttempt = useCallback((success: boolean) => {
    const now = Date.now();
    const { attempts, lastAttempt } = rateLimitState;

    if (success) {
      // Reset on successful attempt
      setRateLimitState({
        attempts: 0,
        lastAttempt: 0,
        isLocked: false,
        lockUntil: 0,
      });
      return;
    }

    // Check if we're within the attempt window
    const timeSinceLastAttempt = now - lastAttempt;
    const newAttempts = timeSinceLastAttempt < RATE_LIMIT_CONFIG.attemptWindow 
      ? attempts + 1 
      : 1;

    // Check if we should lock out
    if (newAttempts >= RATE_LIMIT_CONFIG.maxAttempts) {
      setRateLimitState({
        attempts: newAttempts,
        lastAttempt: now,
        isLocked: true,
        lockUntil: now + RATE_LIMIT_CONFIG.lockoutDuration,
      });
    } else {
      setRateLimitState({
        attempts: newAttempts,
        lastAttempt: now,
        isLocked: false,
        lockUntil: 0,
      });
    }
  }, [rateLimitState]);

  return {
    checkRateLimit,
    recordAttempt,
    isLocked: rateLimitState.isLocked,
    remainingAttempts: Math.max(0, RATE_LIMIT_CONFIG.maxAttempts - rateLimitState.attempts),
  };
};

export default useRateLimit;
