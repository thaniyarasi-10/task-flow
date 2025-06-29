import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Handle email confirmation from URL
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const email = searchParams.get('email');

      if (token && type === 'signup') {
        setIsVerifying(true);
        try {
          // Verify the email confirmation token
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) throw error;

          toast({
            title: "Email Verified! 🎉",
            description: "Your account has been confirmed. You can now sign in.",
          });

          // Clear URL parameters and switch to login
          window.history.replaceState({}, '', '/auth');
          setIsLogin(true);
          if (email) {
            setFormData(prev => ({ ...prev, email }));
          }
        } catch (error: any) {
          console.error('Email verification error:', error);
          toast({
            title: "Verification Failed",
            description: "The verification link may be expired or invalid. Please try signing up again.",
            variant: "destructive"
          });
        } finally {
          setIsVerifying(false);
        }
      }
    };

    handleEmailConfirmation();
  }, [searchParams, toast]);

  // Get the current site URL for redirects
  const getSiteUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://taskspacetodo.netlify.app';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) return;
    if (!isLogin && !formData.name.trim()) return;

    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back! 🎉",
          description: "You've been signed in successfully.",
        });
        navigate('/dashboard');
      } else {
        // For signup, enable email confirmation
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              full_name: formData.name,
            },
            emailRedirectTo: `${getSiteUrl()}/auth`
          }
        });
        
        if (error) throw error;
        
        // Check if user was created successfully
        if (data.user) {
          if (data.user.email_confirmed_at) {
            // Email is already confirmed (auto-confirm is enabled)
            toast({
              title: "Account created successfully! 🎉",
              description: "You can now sign in to your account.",
            });
            setIsLogin(true); // Switch to login mode
          } else {
            // Email confirmation required
            toast({
              title: "Check your email! 📧",
              description: "We've sent you a verification link. Please check your email (including spam folder) and click the link to verify your account.",
            });
            
            // Show email verification notice
            setIsLogin(true); // Switch to login mode for when they return
          }
        } else {
          toast({
            title: "Account created! ✅",
            description: "Please try signing in with your credentials.",
          });
          setIsLogin(true); // Switch to login mode
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = "An error occurred during authentication";
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and click the verification link before signing in.";
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
        setIsLogin(true);
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.message?.includes('Signup is disabled')) {
        errorMessage = "Account creation is temporarily disabled. Please contact support.";
      } else if (error.message?.includes('Email rate limit exceeded')) {
        errorMessage = "Too many email attempts. Please wait a few minutes before trying again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show verification screen if verifying email
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we confirm your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? "Sign in to your workspace" : "Get started with your new workspace"}
              </p>
            </div>

            {/* Form */}
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                        minLength={6}
                      />
                    </div>
                    {!isLogin && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Password must be at least 6 characters long
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                      </div>
                    ) : (
                      isLogin ? "Sign in" : "Create account"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>

                {/* Email verification notice */}
                {!isLogin && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Email Verification Required
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          After creating your account, you'll receive a verification email. Please check your inbox (and spam folder) and click the verification link to activate your account.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email confirmation help */}
                {isLogin && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      <AlertCircle className="inline h-3 w-3 mr-1" />
                      Having trouble signing in? Make sure you've verified your email address.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex flex-1 bg-blue-50 dark:bg-gray-800 items-center justify-center p-12">
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Your productive workspace awaits
            </h2>
            <div className="space-y-4">
              {[
                "Organize tasks with intuitive boards",
                "Collaborate with your team in real-time", 
                "Track progress with powerful analytics",
                "Access everything from any device"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Auth;