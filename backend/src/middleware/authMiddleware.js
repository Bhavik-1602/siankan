import { supabase } from '../config/supabase.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
    }
    
    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Not authorized, token invalid or expired' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalProtect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        req.user = user;
      }
    }
    next();
  } catch (err) {
    // Fail silently and proceed as guest
    next();
  }
};



import { supabaseAdmin } from "../config/supabase.js";

export const admin = async (req, res, next) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (error || !profile) {
      return res.status(403).json({
        success: false,
        error: "Profile not found"
      });
    }

    if (profile.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }

    next();

  } catch (err) {
    next(err);
  }
};
