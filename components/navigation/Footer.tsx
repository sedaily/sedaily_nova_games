"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-slate-900 text-white py-8 mt-auto"
    >
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-bold korean-heading mb-2">서울경제신문</h3>
        <p className="text-sm text-slate-300 korean-text">
          © 2025 서울경제신문. All rights reserved. | AI로 만드는 더 나은 경제 정보
        </p>
      </div>
    </motion.footer>
  )
}
