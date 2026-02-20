import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In a real implementation, this would call Firebase password reset
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Password Reset Sent | Rural Properties South Africa</title>
          <meta name="description" content="Password reset email sent successfully" />
        </Helmet>

        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold">Check Your Email</h2>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to<br />
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Check your spam folder if you don't see it</p>
                    <p>• The link will expire in 24 hours</p>
                    <p>• Click the link to create a new password</p>
                  </div>
                  <div className="space-y-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail('');
                      }}
                      className="w-full"
                    >
                      Send Another Email
                    </Button>
                    <Button
                      onClick={() => navigate('/signin')}
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password | Rural Properties South Africa</title>
        <meta name="description" content="Reset your Rural Properties account password" />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/signin')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>

          <Card className="shadow-lg">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">
                Forgot Password?
              </CardTitle>
              <p className="text-muted-foreground text-center">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link 
                  to="/signin" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                Need help? Contact{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  support
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
