
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Heart, Sparkles, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      title: "Beautiful Task Management",
      description: "Organize your life with elegant, intuitive design"
    },
    {
      icon: <Zap className="h-6 w-6 text-pink-500" />,
      title: "Real-time Collaboration",
      description: "Share and collaborate on tasks in real-time"
    },
    {
      icon: <Heart className="h-6 w-6 text-rose-500" />,
      title: "Mindful Productivity",
      description: "Stay focused with gentle, motivating interactions"
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-600" />,
      title: "Magical Experience",
      description: "Smooth animations and delightful micro-interactions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-purple-100 dark:border-purple-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">TaskLove</span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient leading-tight">
              Fall in Love with
              <br />
              <span className="text-purple-600 dark:text-purple-400">Productivity</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Experience the most beautiful and intuitive task management app.
              <br />
              Designed to make your daily workflow feel magical.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-glow"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg border-purple-200 hover:border-purple-300 text-purple-600 hover:text-purple-700 dark:border-purple-700 dark:text-purple-400"
              >
                Watch Demo
              </Button>
            </div>

            {/* Hero Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl shadow-2xl p-1 animate-float">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-pulse-soft" />
                    <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                      Beautiful Dashboard Preview
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Coming to life with your tasks...
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Why You'll Love TaskLove
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              More than just a todo app - it's a delightful experience that makes productivity feel effortless
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-purple-100 dark:border-purple-700 hover:shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-800/30 transition-all duration-300 hover:-translate-y-2">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Ready to Transform Your Day?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands who've discovered the joy of beautiful, mindful productivity
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-glow"
            >
              Begin Your Journey
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-pink-300" />
            <span className="text-2xl font-bold">TaskLove</span>
          </div>
          <p className="text-purple-200">
            Made with ❤️ for people who love beautiful, functional design
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
