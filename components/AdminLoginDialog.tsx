"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLoginDialog() {
  return (
    <Link href="/admin/login">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
          <Lock className="h-4 w-4" />
          Admin Login
        </Button>
      </motion.div>
    </Link>
  );
}
