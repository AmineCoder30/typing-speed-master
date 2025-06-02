"use client"

import { motion } from "framer-motion"
import {
  Keyboard,
  BarChart3,
  Settings,
  User,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Timer,
  Quote,
  Code,
  Type,
  Zap,
  Target,
  Brain,
  Languages,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTypingStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/user-menu"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { currentView, setCurrentView, setShowSettings, testMode, setTestMode, isTestActive } = useTypingStore()

  const navigationItems = [
    {
      id: "test",
      label: "Typing Test",
      icon: Keyboard,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-500/10 to-cyan-500/10",
      hoverColor: "hover:from-blue-500/20 hover:to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
      hoverColor: "hover:from-purple-500/20 hover:to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      id: "history",
      label: "History",
      icon: Trophy,
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-yellow-500/10 to-orange-500/10",
      hoverColor: "hover:from-yellow-500/20 hover:to-orange-500/20",
      iconColor: "text-yellow-500",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-500/10 to-emerald-500/10",
      hoverColor: "hover:from-green-500/20 hover:to-emerald-500/20",
      iconColor: "text-green-500",
    },
  ]

  const testModes = [
    {
      id: "words",
      label: "Random Words",
      icon: Type,
      gradient: "from-indigo-500 to-blue-500",
      bgColor: "bg-gradient-to-r from-indigo-500/10 to-blue-500/10",
      hoverColor: "hover:from-indigo-500/20 hover:to-blue-500/20",
      iconColor: "text-indigo-500",
    },
    {
      id: "quotes",
      label: "Quotes",
      icon: Quote,
      gradient: "from-rose-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-rose-500/10 to-pink-500/10",
      hoverColor: "hover:from-rose-500/20 hover:to-pink-500/20",
      iconColor: "text-rose-500",
    },
    {
      id: "code",
      label: "Code",
      icon: Code,
      gradient: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-r from-violet-500/10 to-purple-500/10",
      hoverColor: "hover:from-violet-500/20 hover:to-purple-500/20",
      iconColor: "text-violet-500",
    },
    {
      id: "arabic-words",
      label: "Arabic Words",
      icon: Languages,
      gradient: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
      hoverColor: "hover:from-amber-500/20 hover:to-orange-500/20",
      iconColor: "text-amber-500",
    },
    {
      id: "arabic-quotes",
      label: "Arabic Quotes",
      icon: MessageSquare,
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-r from-emerald-500/10 to-teal-500/10",
      hoverColor: "hover:from-emerald-500/20 hover:to-teal-500/20",
      iconColor: "text-emerald-500",
    },
    {
      id: "custom",
      label: "Custom Text",
      icon: Timer,
      gradient: "from-teal-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-teal-500/10 to-cyan-500/10",
      hoverColor: "hover:from-teal-500/20 hover:to-cyan-500/20",
      iconColor: "text-teal-500",
    },
  ]

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 -left-5 w-20 h-20 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between relative z-10">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TypeSpeed
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-slate-400">Pro</span>
              </div>
            </div>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-8 h-8 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6 relative z-10 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-3">
          {!collapsed && (
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-medium text-slate-300">Navigation</h3>
            </div>
          )}
          {navigationItems.map((item) => (
            <motion.div key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 relative overflow-hidden transition-all duration-300",
                  collapsed && "px-2",
                  currentView === item.id
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.iconColor.split("-")[1]}-500/25`
                    : `${item.bgColor} ${item.hoverColor} text-slate-300 hover:text-white border border-transparent hover:border-white/10`,
                )}
                onClick={() => setCurrentView(item.id as any)}
                disabled={isTestActive && item.id !== "test"}
              >
                {currentView === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon
                  className={cn("w-5 h-5 relative z-10", currentView === item.id ? "text-white" : item.iconColor)}
                />
                {!collapsed && <span className="relative z-10 font-medium">{item.label}</span>}
                {currentView === item.id && !collapsed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Test Modes */}
        {currentView === "test" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {!collapsed && (
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-medium text-slate-300">Test Modes</h3>
              </div>
            )}
            {testModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11 relative overflow-hidden transition-all duration-300",
                    collapsed && "px-2",
                    testMode === mode.id
                      ? `bg-gradient-to-r ${mode.gradient} text-white shadow-md`
                      : `${mode.bgColor} ${mode.hoverColor} text-slate-400 hover:text-white border border-transparent hover:border-white/10`,
                  )}
                  onClick={() => setTestMode(mode.id as any)}
                  disabled={isTestActive}
                >
                  {testMode === mode.id && (
                    <motion.div
                      layoutId="activeMode"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <mode.icon
                    className={cn("w-4 h-4 relative z-10", testMode === mode.id ? "text-white" : mode.iconColor)}
                  />
                  {!collapsed && <span className="relative z-10 text-sm font-medium">{mode.label}</span>}
                  {testMode === mode.id && !collapsed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 space-y-3 relative z-10">
        <div className="mb-3">
          <UserMenu  />
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-11 bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300",
              collapsed && "px-2",
            )}
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </Button>
        </motion.div>

        {/* Decorative elements */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 pt-2"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full animate-pulse delay-300"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full animate-pulse delay-700"></div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
