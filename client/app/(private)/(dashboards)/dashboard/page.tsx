"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  return (
    <ProtectedRoute requiredRoles={["ADMIN", "SUPERADMIN"]}>
      <motion.div
        className="p-6 bg-gray-50 min-h-[30vh] flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl font-semibold text-gray-800 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Admin Dashboard Overview
        </motion.h1>
      </motion.div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
