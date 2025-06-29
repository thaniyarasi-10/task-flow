import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

export const OfflineIndicator = () => {
  const isOnline = useOfflineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-center text-sm"
        >
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span>You're offline. Some features may not work properly.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};