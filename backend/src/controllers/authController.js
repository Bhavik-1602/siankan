import { supabase, supabaseAdmin } from '../config/supabase.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`
        }
      }
    });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: data.user,
      session: data.session
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Login with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    console.log("Auth User:", data.user);
    console.log("Auth User ID:", data.user.id);

    const { data: allProfiles } = await supabaseAdmin
      .from("profiles")
      .select("*");

    console.log("ALL PROFILES");
    console.log(allProfiles);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // Get user profile from profiles table
    const {
      data: profile,
      error: profileError,
    } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    console.log("Profile:", profile);
    console.log("Profile Error:", profileError);

    if (profileError) {
      return res.status(400).json({
        success: false,
        error: profileError.message
      });
    }

    // Return user with role
    res.status(200).json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: profile.full_name,
        role: profile.role
      },
      session: data.session
    });

  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
