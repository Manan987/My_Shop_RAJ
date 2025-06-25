import * as client from "openid-client";
import passport from "passport";
import session from "express-session";
import { Request, Response, NextFunction, Express } from "express";

// Extend session interface to include custom properties
declare module 'express-session' {
  interface SessionData {
    codeVerifier?: string;
    state?: string;
    user?: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
    };
  }
}

let sessionMiddleware: session.RequestHandler | null = null;

export function getSession(): session.RequestHandler {
  if (!sessionMiddleware) {
    // For SQLite setup, we'll use memory store for sessions
    console.warn('Using memory store for sessions (SQLite setup)');
    sessionMiddleware = session({
      secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });
  }
  return sessionMiddleware;
}

export async function setupAuth(app: Express) {
  try {
    // Setup session middleware
    app.use(getSession());
    app.use(passport.initialize());
    app.use(passport.session());

    // Skip OIDC setup if environment variables are not configured
    if (!process.env.REPL_ID || !process.env.CLIENT_ID || process.env.CLIENT_ID === 'your_client_id') {
      console.warn('OIDC not configured, skipping auth setup');
      return;
    }

    // Note: OIDC setup removed for development mode
    console.log("Auth setup completed successfully (development mode)");
  } catch (error) {
    console.error('Failed to setup auth:', error);
    throw error;
  }
}

export function getLogoutUrl(): string {
  const replId = process.env.REPL_ID;
  const replitDomains = process.env.REPLIT_DOMAINS;
  return `https://${replId}.${replitDomains}/auth/logout`;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // For development mode, check session or create mock user
  if (process.env.NODE_ENV !== 'production') {
    if (!req.session.user) {
      req.session.user = {
        id: 'dev-user-123',
        email: 'dev@rajgarments.com',
        name: 'Development User',
        isAdmin: true
      };
    }
    (req as any).user = { claims: { sub: req.session.user.id } };
    return next();
  }
  
  // Production authentication check
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: 'Unauthorized' });
}
