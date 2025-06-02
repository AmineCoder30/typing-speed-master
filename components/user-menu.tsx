"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, LogOut, Settings, Trophy, MoreVertical, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/auth-store"
import { AuthModal } from "./auth-modal"

export function UserMenu() {
  const { user, profile, signOut } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const getSkillLevel = () => {
    if (!profile)
      return {
        level: "Guest",
        color: "text-slate-400",
        gradient: "from-slate-500 to-slate-600",
        icon: User,
      }

    const avgWpm = profile.avg_wpm
    if (avgWpm >= 70)
      return {
        level: "Expert",
        color: "text-purple-400",
        gradient: "from-purple-500 to-pink-500",
        icon: Crown,
      }
    if (avgWpm >= 50)
      return {
        level: "Advanced",
        color: "text-blue-400",
        gradient: "from-blue-500 to-cyan-500",
        icon: Zap,
      }
    if (avgWpm >= 30)
      return {
        level: "Intermediate",
        color: "text-green-400",
        gradient: "from-green-500 to-emerald-500",
        icon: Trophy,
      }
    return {
      level: "Beginner",
      color: "text-orange-400",
      gradient: "from-orange-500 to-yellow-500",
      icon: User,
    }
  }

  const skillLevel = getSkillLevel()

  if (!user) {
    return (
      <>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="w-full gap-3 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 border-0"
          >
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span className="font-medium">Sign In</span>
          </Button>
        </motion.div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  return (
    <div className="relative">
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant="ghost"
          className="w-full gap-3 p-3 h-auto bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/70 hover:to-slate-500/70 text-white border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div
            className={`w-10 h-10 bg-gradient-to-r ${skillLevel.gradient} rounded-full flex items-center justify-center relative`}
          >
            {/* show the user icon */}
            <skillLevel.icon className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          <div className="hidden md:block text-left flex-1">
            <div className="text-sm font-medium text-white">{profile?.username || user.email?.split("@")[0]}</div>
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className={`text-xs border-0 bg-gradient-to-r ${skillLevel.gradient} text-white`}
              >
                {skillLevel.level}
              </Badge>
            </div>
          </div>
          <MoreVertical className="w-4 h-4 text-slate-300" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute left-0 bottom-full mt-2 w-72 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-700/30 to-slate-600/30">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${skillLevel.gradient} rounded-full flex items-center justify-center relative`}
                >
                  <skillLevel.icon className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{profile?.username || user.email?.split("@")[0]}</div>
                  <div className="text-sm text-slate-400">{user.email}</div>
                  <Badge
                    variant="outline"
                    className={`text-xs mt-1 border-0 bg-gradient-to-r ${skillLevel.gradient} text-white`}
                  >
                    {skillLevel.level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            {profile && (
              <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {profile.best_wpm}
                    </div>
                    <div className="text-xs text-slate-400">Best WPM</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {profile.avg_wpm}
                    </div>
                    <div className="text-xs text-slate-400">Avg WPM</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {profile.total_tests}
                    </div>
                    <div className="text-xs text-slate-400">Tests</div>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
                onClick={() => {
                  setShowMenu(false)
                }}
              >
                <Settings className="w-4 h-4 text-blue-400" />
                Profile Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300"
                onClick={() => {
                  setShowMenu(false)
                }}
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                Achievements
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-11 text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 transition-all duration-300"
                onClick={() => {
                  signOut()
                  setShowMenu(false)
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>

            {/* Footer decoration */}
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-700">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse delay-300"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full animate-pulse delay-700"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
    </div>
  )
}
