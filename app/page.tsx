"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  DollarSign,
  Target,
  Activity,
  Terminal,
  Server,
  Database,
  Move,
  Check,
} from "lucide-react"

interface Expense {
  id: string
  label: string
  amount: number
  color: string
  category: string
  position: number
}

interface Goal {
  id: string
  label: string
  targetAmount: number
  currentAmount: number
  color: string
  description: string
  position: number
  completedDate?: string // Added completedDate
}

interface BudgetData {
  monthlyIncome: number
  expenses: Expense[]
  goals: Goal[]
  completedGoals: Goal[] // Added completedGoals
}

const TERMINAL_COLORS = [
  "#00FF00", // Bright Green
  "#00FFFF", // Cyan
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#FF6600", // Orange
  "#0066FF", // Blue
  "#66FF00", // Lime
  "#FF0066", // Pink
  "#00FF66", // Green-Cyan
  "#6600FF", // Purple
  "#FF6600", // Orange-Red
  "#FFFFFF", // White
]

const terminalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
  
  /* Custom Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 255, 0, 0.2);
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(0, 255, 0, 0.6), rgba(0, 255, 0, 0.3));
    border: 1px solid rgba(0, 255, 0, 0.4);
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0.5));
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  }
  
  ::-webkit-scrollbar-corner {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 255, 0, 0.2);
  }
  
  /* Firefox Scrollbar */
  html {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 255, 0, 0.6) rgba(0, 0, 0, 0.8);
  }
  
  .terminal-bg {
    background: #000000;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }
  
  .terminal-card {
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(0, 255, 0, 0.4);
    backdrop-filter: blur(15px);
    font-family: 'JetBrains Mono', 'Courier New', monospace;
  }
  
  .terminal-card:hover {
    border-color: rgba(0, 255, 0, 0.7);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.15);
    background: rgba(0, 0, 0, 0.75);
  }
  
  .terminal-text {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-weight: 400;
  }
  
  .terminal-header {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-weight: 600;
    color: #00FF00;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.8);
  }
  
  .terminal-accent {
    color: #00FF00;
    text-shadow: 0 0 8px rgba(0, 255, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8);
    font-weight: 500;
  }
  
  .terminal-secondary {
    color: #00FFFF;
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.8);
  }
  
  .card-title {
    color: #FFFFFF;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9), 0 0 8px rgba(255, 255, 255, 0.3);
    font-weight: 600;
  }
  
  .terminal-button {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 255, 0, 0.5);
    color: #00FF00;
    font-family: 'JetBrains Mono', monospace;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
  }
  
  .terminal-button:hover {
    background: rgba(0, 255, 0, 0.1);
    border-color: #00FF00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }

  .file-input-wrapper {
    position: relative;
    display: inline-block;
  }

  .file-input-wrapper:hover .terminal-button {
    background: rgba(0, 255, 0, 0.1);
    border-color: #00FF00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }
  
  .terminal-input {
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid rgba(0, 255, 0, 0.4);
    color: #00FF00;
    font-family: 'JetBrains Mono', monospace;
    backdrop-filter: blur(10px);
  }
  
  .terminal-input:focus {
    border-color: #00FF00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
    background: rgba(0, 0, 0, 0.95);
  }

  /* Hide number input spinners */
  .terminal-input::-webkit-outer-spin-button,
  .terminal-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .terminal-input[type=number] {
    -moz-appearance: textfield;
  }
  
  .progress-bar {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 255, 0, 0.3);
  }
  
  .progress-fill {
    background: linear-gradient(90deg, #00FF00, #00FFFF);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.4);
  }

  /* Drag and Drop Styling */
  .draggable-card {
    cursor: grab;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .draggable-card:active {
    cursor: grabbing;
  }

  .dragging {
    transform: rotate(5deg) scale(1.05);
    z-index: 1000;
    box-shadow: 0 20px 40px rgba(0, 255, 0, 0.3), 0 0 30px rgba(0, 255, 0, 0.2);
    border-color: rgba(0, 255, 0, 0.8) !important;
    background: rgba(0, 0, 0, 0.9) !important;
  }

  .drag-over {
    border: 2px dashed rgba(0, 255, 0, 0.6);
    background: rgba(0, 255, 0, 0.05);
    transform: scale(0.98);
  }

  .drag-placeholder {
    border: 2px dashed rgba(0, 255, 0, 0.4);
    background: rgba(0, 255, 0, 0.02);
    opacity: 0.5;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 255, 0, 0.6);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }

  .move-handle {
    opacity: 0;
    transition: opacity 0.2s ease;
    color: rgba(0, 255, 0, 0.6);
  }

  .draggable-card:hover .move-handle {
    opacity: 1;
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    .terminal-bg {
      background-attachment: scroll;
    }
    
    .terminal-card {
      backdrop-filter: blur(10px);
    }
    
    .terminal-button {
      min-height: 44px;
      touch-action: manipulation;
    }
    
    .terminal-input {
      min-height: 44px;
      font-size: 16px;
    }
    
    /* Mobile scrollbar adjustments */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .move-handle {
      opacity: 1;
    }
  }
`

export default function TerminalBudget() {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    monthlyIncome: 0,
    expenses: [],
    goals: [],
    completedGoals: [], // Initialize completedGoals
  })

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [draggedItem, setDraggedItem] = useState<{ type: "expense" | "goal"; id: string } | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [backgroundImage, setBackgroundImage] = useState<string>("")
  const [userIP, setUserIP] = useState<string>("127.0.0.1")
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before showing time
  useEffect(() => {
    setMounted(true)
    setCurrentTime(new Date())
  }, [])

  // Get user's IP address
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        setUserIP(data.ip)
      } catch (error) {
        // Fallback to localhost if IP fetch fails
        setUserIP("127.0.0.1")
      }
    }
    fetchIP()
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("terminalBudget")
    const savedBg = localStorage.getItem("terminalBackground")
    if (saved) {
      const data = JSON.parse(saved)
      // Migrate old data without positions or completedGoals
      if (data.expenses) {
        data.expenses = data.expenses.map((expense: any, index: number) => ({
          ...expense,
          position: expense.position ?? index,
        }))
      }
      if (data.goals) {
        data.goals = data.goals.map((goal: any, index: number) => ({
          ...goal,
          position: goal.position ?? index,
        }))
      }
      setBudgetData({
        ...data,
        completedGoals: data.completedGoals || [], // Ensure completedGoals is initialized
      })
    }

    if (savedBg) {
      setBackgroundImage(savedBg)
    } else {
      // Check if default bg_image.jpg exists
      const img = new Image()
      img.crossOrigin = "anonymous" // Set crossOrigin to avoid CORS issues
      img.src = "/bg_image.jpg" // Changed to .jpg
      img.onload = () => {
        setBackgroundImage("/bg_image.jpg") // Changed to .jpg
      }
      img.onerror = () => {
        setBackgroundImage("") // Fallback to black if default image not found
      }
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("terminalBudget", JSON.stringify(budgetData))
  }, [budgetData])

  // Save background to localStorage whenever it changes
  useEffect(() => {
    if (backgroundImage && backgroundImage !== "/bg_image.jpg") {
      // Changed to .jpg
      localStorage.setItem("terminalBackground", backgroundImage)
    } else if (backgroundImage === "") {
      // If background is explicitly set to black
      localStorage.removeItem("terminalBackground")
    }
    // If backgroundImage is "/bg_image.jpg", we don't save it to localStorage
    // as it's the default and should only be loaded if no user-set background exists.
  }, [backgroundImage])

  const addExpense = () => {
    const newPosition = Math.max(...budgetData.expenses.map((e) => e.position), -1) + 1
    const newExpense: Expense = {
      id: Date.now().toString(),
      label: "new_expense",
      amount: 0,
      color: TERMINAL_COLORS[Math.floor(Math.random() * TERMINAL_COLORS.length)],
      category: "general",
      position: newPosition,
    }
    setBudgetData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }))
  }

  const addGoal = () => {
    const newPosition = Math.max(...budgetData.goals.map((g) => g.position), -1) + 1
    const newGoal: Goal = {
      id: Date.now().toString(),
      label: "new_goal",
      targetAmount: 0,
      currentAmount: 0,
      color: TERMINAL_COLORS[Math.floor(Math.random() * TERMINAL_COLORS.length)],
      description: "",
      position: newPosition,
    }
    setBudgetData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }))
  }

  const updateExpense = (expense: Expense) => {
    setBudgetData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === expense.id ? expense : e)),
    }))
    setEditingExpense(null)
  }

  const updateGoal = (goal: Goal) => {
    setBudgetData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === goal.id ? goal : g)),
    }))
    setEditingGoal(null)
  }

  const deleteExpense = (id: string) => {
    setBudgetData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }))
  }

  const deleteGoal = (id: string) => {
    setBudgetData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }))
  }

  const completeGoal = (id: string) => {
    setBudgetData((prev) => {
      const goalToComplete = prev.goals.find((g) => g.id === id)
      if (!goalToComplete) return prev

      const updatedGoals = prev.goals.filter((g) => g.id !== id)
      const completedGoal = { ...goalToComplete, completedDate: new Date().toISOString() }

      return {
        ...prev,
        goals: updatedGoals,
        completedGoals: [...prev.completedGoals, completedGoal],
      }
    })
  }

  const reorderItems = (type: "expense" | "goal", draggedId: string, targetIndex: number) => {
    setBudgetData((prev) => {
      if (type === "expense") {
        const items = [...prev.expenses]
        const draggedIndex = items.findIndex((item) => item.id === draggedId)
        const draggedItem = items[draggedIndex]

        // Remove dragged item
        items.splice(draggedIndex, 1)

        // Insert at new position
        items.splice(targetIndex, 0, draggedItem)

        // Update positions
        const updatedItems = items.map((item, index) => ({
          ...item,
          position: index,
        }))

        return { ...prev, expenses: updatedItems }
      } else {
        const items = [...prev.goals]
        const draggedIndex = items.findIndex((item) => item.id === draggedId)
        const draggedItem = items[draggedIndex]

        // Remove dragged item
        items.splice(draggedIndex, 1)

        // Insert at new position
        items.splice(targetIndex, 0, draggedItem)

        // Update positions
        const updatedItems = items.map((item, index) => ({
          ...item,
          position: index,
        }))

        return { ...prev, goals: updatedItems }
      }
    })
  }

  const exportData = () => {
    const dataStr = JSON.stringify(budgetData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "budget_export.json"
    link.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          // Ensure positions and completedGoals exist for imported data
          if (imported.expenses) {
            imported.expenses = imported.expenses.map((expense: any, index: number) => ({
              ...expense,
              position: expense.position ?? index,
            }))
          }
          if (imported.goals) {
            imported.goals = imported.goals.map((goal: any, index: number) => ({
              ...goal,
              position: goal.position ?? index,
            }))
          }
          setBudgetData({
            ...imported,
            completedGoals: imported.completedGoals || [],
          })
        } catch (error) {
          alert("ERROR: Invalid file format")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("ERROR: Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("ERROR: Image too large (max 5MB)")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setBackgroundImage(result)
      }
      reader.readAsDataURL(file)
    }
    // Reset the input
    event.target.value = ""
  }

  // Calculations
  const monthlyIncome = budgetData.monthlyIncome
  const totalMonthlyExpenses = budgetData.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const quarterlyExpenses = totalMonthlyExpenses * 3
  const annualExpenses = totalMonthlyExpenses * 12
  const monthlyFree = monthlyIncome - totalMonthlyExpenses
  const totalGoalTarget = budgetData.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalGoalCurrent = budgetData.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalCompletedGoalCost = budgetData.completedGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)

  // Sort items by position
  const sortedExpenses = [...budgetData.expenses].sort((a, b) => a.position - b.position)
  const sortedGoals = [...budgetData.goals].sort((a, b) => a.position - b.position)
  const sortedCompletedGoals = [...budgetData.completedGoals].sort((a, b) => {
    if (a.completedDate && b.completedDate) {
      return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
    }
    return 0
  })

  const formatTime = (date: Date) => {
    if (!mounted) return "00:00:00"

    return date.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    if (!mounted) return "Loading..."

    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  const getBackgroundStyle = () => {
    if (!backgroundImage || backgroundImage.trim() === "") {
      return { backgroundColor: "#000000" }
    }
    return {
      backgroundImage: `url('${backgroundImage}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat",
    }
  }

  return (
    <div className="min-h-screen text-green-400 p-2 sm:p-4 terminal-text relative" style={getBackgroundStyle()}>
      <style dangerouslySetInnerHTML={{ __html: terminalStyles }} />

      <div className="max-w-7xl mx-auto relative">
        {/* Terminal Header */}
        <div className="terminal-card rounded-none p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Terminal className="h-5 w-5 sm:h-6 sm:w-6 terminal-accent" />
              <span className="terminal-header text-lg sm:text-xl">budget</span>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-gray-400 text-xs sm:text-sm hidden sm:inline">user@{userIP}</span>
            </div>
            <div className="text-left sm:text-right">
              <div className="terminal-header text-xl sm:text-2xl font-mono tracking-wider">
                {formatTime(currentTime)}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <Card className="terminal-card rounded-none mb-3 sm:mb-4">
          <CardHeader className="pb-2 p-3 sm:p-6">
            <CardTitle className="terminal-header flex items-center gap-2 text-base sm:text-lg">
              <Server className="h-4 w-4 sm:h-5 sm:w-5" />
              FINANCIAL_STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-6 pt-0">
            <div className="space-y-2">
              <Label className="terminal-secondary text-xs sm:text-sm">MONTHLY_INCOME</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={budgetData.monthlyIncome || ""}
                onChange={(e) =>
                  setBudgetData((prev) => ({
                    ...prev,
                    monthlyIncome: Number(e.target.value) || 0,
                  }))
                }
                className="terminal-input h-11 sm:h-10"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end">
              <div>
                <p className="terminal-secondary text-xs sm:text-sm">MONTHLY_TOTAL</p>
                <p className="terminal-accent text-xl sm:text-2xl font-mono">${monthlyIncome.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
          <Card className="terminal-card rounded-none">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 terminal-accent" />
                <span className="terminal-secondary text-xs sm:text-sm">FREE</span>
              </div>
              <p className="terminal-accent text-sm sm:text-xl font-mono">${monthlyFree.toLocaleString()}</p>
              <p className="text-gray-500 text-xs hidden sm:block">monthly_available</p>
            </CardContent>
          </Card>
          <Card className="terminal-card rounded-none">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <Database className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                <span className="text-red-400 text-xs sm:text-sm">USED</span>
              </div>
              <p className="text-red-400 text-sm sm:text-xl font-mono">${totalMonthlyExpenses.toLocaleString()}</p>
              <p className="text-gray-500 text-xs hidden sm:block">monthly_expenses</p>
            </CardContent>
          </Card>
          <Card className="terminal-card rounded-none">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs sm:text-sm">Q3 USED</span>
              </div>
              <p className="text-yellow-400 text-sm sm:text-xl font-mono">${quarterlyExpenses.toLocaleString()}</p>
              <p className="text-gray-500 text-xs hidden sm:block">3_month_costs</p>
            </CardContent>
          </Card>
          <Card className="terminal-card rounded-none">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                <span className="text-purple-400 text-xs sm:text-sm">YEAR USED</span>
              </div>
              <p className="text-purple-400 text-sm sm:text-xl font-mono">${annualExpenses.toLocaleString()}</p>
              <p className="text-gray-500 text-xs hidden sm:block">12_month_costs</p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
          <Button onClick={exportData} className="terminal-button h-11 sm:h-auto">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">export_data</span>
            <span className="sm:hidden">export</span>
          </Button>
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button className="terminal-button h-11 sm:h-auto w-full sm:w-auto pointer-events-none">
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">import_data</span>
              <span className="sm:hidden">import</span>
            </Button>
          </div>
          <div className="file-input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button className="terminal-button h-11 sm:h-auto pointer-events-none">
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">upload_background</span>
              <span className="sm:hidden">background</span>
            </Button>
          </div>
          {/* Clear background button now attempts to load default or sets to black */}
          <Button
            onClick={() => {
              localStorage.removeItem("terminalBackground") // Clear user-set background
              const img = new Image()
              img.crossOrigin = "anonymous" // Set crossOrigin to avoid CORS issues
              img.src = "/bg_image.jpg" // Changed to .jpg
              img.onload = () => {
                setBackgroundImage("/bg_image.jpg") // Changed to .jpg
              }
              img.onerror = () => {
                setBackgroundImage("") // Fallback to black if default image not found
              }
            }}
            className="terminal-button h-11 sm:h-auto"
          >
            <Terminal className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">clear_background</span>
            <span className="sm:hidden">clear</span>
          </Button>
        </div>

        {/* Main Terminal Interface */}
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="terminal-card rounded-none grid w-full grid-cols-2 h-11 sm:h-auto">
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 terminal-text text-sm sm:text-base"
            >
              ./expenses
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 terminal-text text-sm sm:text-base"
            >
              ./goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <h2 className="terminal-header text-lg sm:text-xl">EXPENSE_PROCESSES</h2>
              <Button onClick={addExpense} className="terminal-button h-11 sm:h-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">spawn_process</span>
                <span className="sm:hidden">add expense</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sortedExpenses.map((expense, index) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  index={index}
                  onEdit={setEditingExpense}
                  onDelete={deleteExpense}
                  draggedItem={draggedItem}
                  setDraggedItem={setDraggedItem}
                  dragOverIndex={dragOverIndex}
                  setDragOverIndex={setDragOverIndex}
                  onReorder={reorderItems}
                />
              ))}
              {sortedExpenses.length === 0 && (
                <div className="drag-placeholder col-span-full">
                  <Move className="h-6 w-6 mr-2" />
                  No expense processes running. Click "spawn_process" to add one.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <h2 className="terminal-header text-lg sm:text-xl">TARGET_PROCESSES</h2>
              <Button onClick={addGoal} className="terminal-button h-11 sm:h-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">create_target</span>
                <span className="sm:hidden">add goal</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {sortedGoals.map((goal, index) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={index}
                  onEdit={setEditingGoal}
                  onDelete={deleteGoal}
                  onComplete={completeGoal} // Pass completeGoal function
                  draggedItem={draggedItem}
                  setDraggedItem={setDraggedItem}
                  dragOverIndex={dragOverIndex}
                  setDragOverIndex={setDragOverIndex}
                  onReorder={reorderItems}
                />
              ))}
              {sortedGoals.length === 0 && (
                <div className="drag-placeholder col-span-full">
                  <Move className="h-6 w-6 mr-2" />
                  No target processes active. Click "create_target" to add one.
                </div>
              )}
            </div>

            {budgetData.goals.length > 0 && (
              <Card className="terminal-card rounded-none">
                <CardHeader className="p-3 sm:p-6">
                  <CardTitle className="terminal-header text-base sm:text-lg">GOAL_SUMMARY</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <p className="terminal-secondary text-xs sm:text-sm">TARGET_TOTAL</p>
                      <p className="terminal-accent text-lg sm:text-2xl font-mono">
                        ${totalGoalTarget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="terminal-secondary text-xs sm:text-sm">CURRENT_TOTAL</p>
                      <p className="terminal-accent text-lg sm:text-2xl font-mono">
                        ${totalGoalCurrent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="terminal-secondary">PROGRESS</span>
                      <span className="terminal-accent">
                        {totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0}%
                      </span>
                    </div>
                    <div className="progress-bar rounded-none h-2">
                      <div
                        className="h-full rounded-none transition-all duration-300"
                        style={{
                          width: `${totalGoalTarget > 0 ? Math.min((totalGoalCurrent / totalGoalTarget) * 100, 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {sortedCompletedGoals.length > 0 && (
              <CompletedGoalsCard completedGoals={sortedCompletedGoals} totalCompletedCost={totalCompletedGoalCost} />
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Dialogs */}
        {editingExpense && (
          <EditExpenseDialog expense={editingExpense} onSave={updateExpense} onClose={() => setEditingExpense(null)} />
        )}

        {editingGoal && <EditGoalDialog goal={editingGoal} onSave={updateGoal} onClose={() => setEditingGoal(null)} />}
      </div>
    </div>
  )
}

// Expense Card Component
function ExpenseCard({
  expense,
  index,
  onEdit,
  onDelete,
  draggedItem,
  setDraggedItem,
  dragOverIndex,
  setDragOverIndex,
  onReorder,
}: {
  expense: Expense
  index: number
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
  draggedItem: { type: "expense" | "goal"; id: string } | null
  setDraggedItem: (item: { type: "expense" | "goal"; id: string } | null) => void
  dragOverIndex: number | null
  setDragOverIndex: (index: number | null) => void
  onReorder: (type: "expense" | "goal", draggedId: string, targetIndex: number) => void
}) {
  const isDragging = draggedItem?.type === "expense" && draggedItem?.id === expense.id
  const isDragOver = dragOverIndex === index && draggedItem?.type === "expense"

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedItem({ type: "expense", id: expense.id })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem?.type === "expense" && draggedItem.id !== expense.id) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem?.type === "expense" && draggedItem.id !== expense.id) {
      onReorder("expense", draggedItem.id, index)
    }
    setDragOverIndex(null)
  }

  return (
    <Card
      className={`terminal-card rounded-none draggable-card transition-all duration-200 ${
        isDragging ? "dragging" : ""
      } ${isDragOver ? "drag-over" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-2 p-3 sm:p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className="w-2 h-2 rounded-none flex-shrink-0"
              style={{ backgroundColor: expense.color, boxShadow: `0 0 5px ${expense.color}` }}
            />
            <CardTitle className="card-title text-xs sm:text-sm font-mono truncate">{expense.label}</CardTitle>
            <Move className="h-3 w-3 move-handle flex-shrink-0" />
          </div>
          <div className="flex gap-1 flex-shrink-0 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(expense)}
              className="h-8 w-8 sm:h-6 sm:w-6 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(expense.id)}
              className="h-8 w-8 sm:h-6 sm:w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="text-lg sm:text-xl font-mono" style={{ color: expense.color }}>
          ${expense.amount.toLocaleString()}
        </div>
        <Badge variant="secondary" className="mt-2 bg-black/50 text-gray-400 border border-gray-600 text-xs">
          {expense.category}
        </Badge>
      </CardContent>
    </Card>
  )
}

// Goal Card Component
function GoalCard({
  goal,
  index,
  onEdit,
  onDelete,
  onComplete, // New prop for completing goal
  draggedItem,
  setDraggedItem,
  dragOverIndex,
  setDragOverIndex,
  onReorder,
}: {
  goal: Goal
  index: number
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  onComplete: (id: string) => void // New prop type
  draggedItem: { type: "expense" | "goal"; id: string } | null
  setDraggedItem: (item: { type: "expense" | "goal"; id: string } | null) => void
  dragOverIndex: number | null
  setDragOverIndex: (index: number | null) => void
  onReorder: (type: "expense" | "goal", draggedId: string, targetIndex: number) => void
}) {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  const isDragging = draggedItem?.type === "goal" && draggedItem?.id === goal.id
  const isDragOver = dragOverIndex === index && draggedItem?.type === "goal"

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedItem({ type: "goal", id: goal.id })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem?.type === "goal" && draggedItem.id !== goal.id) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedItem?.type === "goal" && draggedItem.id !== goal.id) {
      onReorder("goal", draggedItem.id, index)
    }
    setDragOverIndex(null)
  }

  return (
    <Card
      className={`terminal-card rounded-none draggable-card transition-all duration-200 ${
        isDragging ? "dragging" : ""
      } ${isDragOver ? "drag-over" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-2 p-3 sm:p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className="w-2 h-2 rounded-none flex-shrink-0"
              style={{ backgroundColor: goal.color, boxShadow: `0 0 5px ${goal.color}` }}
            />
            <CardTitle className="card-title text-xs sm:text-sm font-mono truncate">{goal.label}</CardTitle>
            <Move className="h-3 w-3 move-handle flex-shrink-0" />
          </div>
          <div className="flex gap-1 flex-shrink-0 ml-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onComplete(goal.id)} // New complete button
              className="h-8 w-8 sm:h-6 sm:w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(goal)}
              className="h-8 w-8 sm:h-6 sm:w-6 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(goal.id)}
              className="h-8 w-8 sm:h-6 sm:w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="terminal-secondary">PROGRESS</span>
            <span className="terminal-accent">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar rounded-none h-1">
            <div
              className="h-full rounded-none transition-all duration-300"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: goal.color,
                boxShadow: `0 0 5px ${goal.color}`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs sm:text-sm font-mono">
            <span style={{ color: goal.color }}>${goal.currentAmount.toLocaleString()}</span>
            <span className="text-gray-400">${goal.targetAmount.toLocaleString()}</span>
          </div>
          {goal.description && <p className="text-xs text-gray-500 font-mono mt-2 line-clamp-2">{goal.description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// Edit Expense Dialog
function EditExpenseDialog({
  expense,
  onSave,
  onClose,
}: {
  expense: Expense
  onSave: (expense: Expense) => void
  onClose: () => void
}) {
  const [editedExpense, setEditedExpense] = useState(expense)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="terminal-card text-green-400 rounded-none border-green-500/30 w-[95vw] max-w-md mx-auto">
        <DialogHeader className="p-3 sm:p-6 pb-2">
          <DialogTitle className="terminal-header text-base sm:text-lg">EDIT_EXPENSE_PROCESS</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-3 sm:p-6 pt-0">
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">PROCESS_NAME</Label>
            <Input
              value={editedExpense.label}
              onChange={(e) => setEditedExpense((prev) => ({ ...prev, label: e.target.value }))}
              className="terminal-input h-11 sm:h-10 mt-1"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">MEMORY_USAGE</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={editedExpense.amount || ""}
              onChange={(e) => setEditedExpense((prev) => ({ ...prev, amount: Number(e.target.value) || 0 }))}
              className="terminal-input h-11 sm:h-10 mt-1"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">CATEGORY</Label>
            <Input
              value={editedExpense.category}
              onChange={(e) => setEditedExpense((prev) => ({ ...prev, category: e.target.value }))}
              className="terminal-input h-11 sm:h-10 mt-1"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">COLOR_CODE</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {TERMINAL_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 sm:w-6 sm:h-6 rounded-none border ${
                    editedExpense.color === color ? "border-white" : "border-gray-600"
                  }`}
                  style={{
                    backgroundColor: color,
                    boxShadow: editedExpense.color === color ? `0 0 10px ${color}` : "none",
                  }}
                  onClick={() => setEditedExpense((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={() => onSave(editedExpense)} className="terminal-button h-11 sm:h-auto flex-1">
              save_changes
            </Button>
            <Button onClick={onClose} className="terminal-button h-11 sm:h-auto flex-1">
              cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Edit Goal Dialog
function EditGoalDialog({
  goal,
  onSave,
  onClose,
}: {
  goal: Goal
  onSave: (goal: Goal) => void
  onClose: () => void
}) {
  const [editedGoal, setEditedGoal] = useState(goal)

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="terminal-card text-green-400 rounded-none border-green-500/30 w-[95vw] max-w-md mx-auto">
        <DialogHeader className="p-3 sm:p-6 pb-2">
          <DialogTitle className="terminal-header text-base sm:text-lg">EDIT_TARGET_PROCESS</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-3 sm:p-6 pt-0">
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">TARGET_NAME</Label>
            <Input
              value={editedGoal.label}
              onChange={(e) => setEditedGoal((prev) => ({ ...prev, label: e.target.value }))}
              className="terminal-input h-11 sm:h-10 mt-1"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">TARGET_AMOUNT</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={editedGoal.targetAmount || ""}
              onChange={(e) => setEditedGoal((prev) => ({ ...prev, targetAmount: Number(e.target.value) || 0 }))}
              className="terminal-input h-11 sm:h-10 mt-1"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">CURRENT_AMOUNT</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={editedGoal.currentAmount || ""}
              onChange={(e) => setEditedGoal((prev) => ({ ...prev, currentAmount: Number(e.target.value) || 0 }))}
              className="terminal-input h-11 sm:h-10 mt-1"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">DESCRIPTION</Label>
            <Textarea
              value={editedGoal.description}
              onChange={(e) => setEditedGoal((prev) => ({ ...prev, description: e.target.value }))}
              className="terminal-input mt-1"
              placeholder="optional_description..."
              rows={3}
            />
          </div>
          <div>
            <Label className="terminal-secondary text-xs sm:text-sm">COLOR_CODE</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {TERMINAL_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 sm:w-6 sm:h-6 rounded-none border ${
                    editedGoal.color === color ? "border-white" : "border-gray-600"
                  }`}
                  style={{
                    backgroundColor: color,
                    boxShadow: editedGoal.color === color ? `0 0 10px ${color}` : "none",
                  }}
                  onClick={() => setEditedGoal((prev) => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={() => onSave(editedGoal)} className="terminal-button h-11 sm:h-auto flex-1">
              save_changes
            </Button>
            <Button onClick={onClose} className="terminal-button h-11 sm:h-auto flex-1">
              cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// New Completed Goals Card Component
function CompletedGoalsCard({
  completedGoals,
  totalCompletedCost,
}: {
  completedGoals: Goal[]
  totalCompletedCost: number
}) {
  return (
    <Card className="terminal-card rounded-none mt-3 sm:mt-4">
      <CardHeader className="pb-2 p-3 sm:p-6">
        <CardTitle className="terminal-header text-base sm:text-lg">COMPLETED_TARGETS</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="space-y-3">
          {completedGoals.map((goal) => (
            <div key={goal.id} className="flex justify-between items-center text-sm font-mono">
              <span className="text-gray-400">{goal.label}</span>
              <span style={{ color: goal.color }}>${goal.targetAmount.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between items-center">
          <span className="terminal-secondary text-sm sm:text-base">TOTAL_ACHIEVED_COSTS</span>
          <span className="terminal-accent text-lg sm:text-xl font-mono">${totalCompletedCost.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
