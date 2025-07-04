
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, BarChart3, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
      title: "Task Management",
      description: "Organize and prioritize your work with powerful task boards"
    },
    {
      icon: <Users className="h-6 w-6 text-green-600" />,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates and sharing"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      title: "Progress Tracking",
      description: "Monitor productivity with detailed analytics and insights"
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      title: "Smart Automation",
      description: "Streamline workflows with intelligent task automation"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">TaskSpace</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-tight">
              Your work, organized.
              <br />
              <span className="text-blue-600">Your way.</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              The all-in-one workspace where teams come together to get things done. 
              Plan, organize, and track all your work in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg h-14"
              >
                Start for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl p-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Dashboard Header Preview */}
                  <div className="bg-blue-600 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-white/20 rounded flex items-center justify-center">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">TaskSpace</span>
                      </div>
                      <div className="text-sm opacity-80">Dashboard</div>
                    </div>
                  </div>
                  
                  {/* Stats Cards Preview */}
                  <div className="p-6">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="text-blue-600 text-2xl font-bold">12</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="text-orange-600 text-2xl font-bold">3</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-green-600 text-2xl font-bold">8</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="text-purple-600 text-2xl font-bold">67%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completion</div>
                      </div>
                    </div>
                    
                    {/* Task List Preview */}
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="h-3 w-3 bg-blue-500 rounded-full mr-3"></div>
                        <div className="text-sm font-medium">Design new landing page</div>
                        <div className="ml-auto text-xs text-gray-500">High Priority</div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
                        <div className="text-sm font-medium">Review marketing strategy</div>
                        <div className="ml-auto text-xs text-gray-500">Completed</div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="h-3 w-3 bg-orange-500 rounded-full mr-3"></div>
                        <div className="text-sm font-medium">Team meeting preparation</div>
                        <div className="ml-auto text-xs text-gray-500">Medium Priority</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Everything you need to stay productive
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help individuals and teams accomplish more
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
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
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Ready to get organized?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of teams already using TaskSpace to stay productive
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl h-14"
            >
              Start your workspace
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-semibold">TaskSpace</span>
          </div>
          <p className="text-gray-400">
            Built for teams that want to get things done
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
