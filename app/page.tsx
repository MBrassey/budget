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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"

interface Expense {
  id: string
  label: string
  amount: number
  color: string
  category: string
}

interface Goal {
  id: string
  label: string
  targetAmount: number
  currentAmount: number
  color: string
  description: string
}

interface BudgetData {
  monthlyIncome: number
  biMonthlyIncome: number
  incomeType: "monthly" | "bimonthly"
  expenses: Expense[]
  goals: Goal[]
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
  
  .progress-bar {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 255, 0, 0.3);
  }
  
  .progress-fill {
    background: linear-gradient(90deg, #00FF00, #00FFFF);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.4);
  }
  
  
`

export default function TerminalBudget() {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    monthlyIncome: 0,
    biMonthlyIncome: 0,
    incomeType: "monthly",
    expenses: [],
    goals: [],
  })

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("terminalBudget")
    if (saved) {
      setBudgetData(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("terminalBudget", JSON.stringify(budgetData))
  }, [budgetData])

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      label: "new_expense",
      amount: 0,
      color: TERMINAL_COLORS[Math.floor(Math.random() * TERMINAL_COLORS.length)],
      category: "general",
    }
    setBudgetData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
    }))
  }

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      label: "new_goal",
      targetAmount: 0,
      currentAmount: 0,
      color: TERMINAL_COLORS[Math.floor(Math.random() * TERMINAL_COLORS.length)],
      description: "",
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
          setBudgetData(imported)
        } catch (error) {
          alert("ERROR: Invalid file format")
        }
      }
      reader.readAsText(file)
    }
  }

  // Calculations
  const monthlyIncome = budgetData.incomeType === "monthly" ? budgetData.monthlyIncome : budgetData.biMonthlyIncome * 2
  const totalMonthlyExpenses = budgetData.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const quarterlyExpenses = totalMonthlyExpenses * 3
  const annualExpenses = totalMonthlyExpenses * 12
  const monthlyFree = monthlyIncome - totalMonthlyExpenses
  const totalGoalTarget = budgetData.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalGoalCurrent = budgetData.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen terminal-bg text-green-400 p-4 terminal-text relative">
      <style dangerouslySetInnerHTML={{ __html: terminalStyles }} />

      <div className="max-w-7xl mx-auto relative">
        {/* Terminal Header */}
        <div className="terminal-card rounded-none p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Terminal className="h-6 w-6 terminal-accent" />
              <span className="terminal-header text-xl">budget_manager v2.1.4</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">user@arch-system</span>
            </div>
            <div className="text-right">
              <div className="terminal-header text-2xl font-mono tracking-wider">{formatTime(currentTime)}</div>
              <div className="text-gray-400 text-sm">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <Card className="terminal-card rounded-none mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="terminal-header flex items-center gap-2">
              <Server className="h-5 w-5" />
              FINANCIAL_STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="terminal-secondary text-sm">INCOME_TYPE</Label>
              <Select
                value={budgetData.incomeType}
                onValueChange={(value: "monthly" | "bimonthly") =>
                  setBudgetData((prev) => ({ ...prev, incomeType: value }))
                }
              >
                <SelectTrigger className="terminal-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-green-500/30">
                  <SelectItem value="monthly">monthly</SelectItem>
                  <SelectItem value="bimonthly">bi_monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="terminal-secondary text-sm">
                {budgetData.incomeType === "monthly" ? "MONTHLY" : "BI_MONTHLY"}_INCOME
              </Label>
              <Input
                type="number"
                value={
                  budgetData.incomeType === "monthly"
                    ? budgetData.monthlyIncome || ""
                    : budgetData.biMonthlyIncome || ""
                }
                onChange={(e) =>
                  setBudgetData((prev) => ({
                    ...prev,
                    [budgetData.incomeType === "monthly" ? "monthlyIncome" : "biMonthlyIncome"]:
                      Number(e.target.value) || 0,
                  }))
                }
                className="terminal-input"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end">
              <div>
                <p className="terminal-secondary text-sm">MONTHLY_TOTAL</p>
                <p className="terminal-accent text-2xl font-mono">${monthlyIncome.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card className="terminal-card rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 terminal-accent" />
                <span className="terminal-secondary text-sm">FREE_MEMORY</span>
              </div>
              <p className="terminal-accent text-xl font-mono">${monthlyFree.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">monthly_available</p>
            </CardContent>
          </Card>
          <Card className="terminal-card rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm">USED_MEMORY</span>
              </div>
              <p className="text-red-400 text-xl font-mono">${totalMonthlyExpenses.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">monthly_expenses</p>
            </CardContent>
          </Card>
          <Card className="terminal-card rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm">QUARTERLY</span>
              </div>
              <p className="text-yellow-400 text-xl font-mono">${quarterlyExpenses.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">3_month_total</p>
            </CardContent>
          </Card>
          <Card className="terminal-card rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-sm">ANNUAL</span>
              </div>
              <p className="text-purple-400 text-xl font-mono">${annualExpenses.toLocaleString()}</p>
              <p className="text-gray-500 text-xs">12_month_total</p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="flex gap-2 mb-4">
          <Button onClick={exportData} className="terminal-button">
            <Download className="h-4 w-4 mr-2" />
            export_data
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="terminal-button">
              <Upload className="h-4 w-4 mr-2" />
              import_data
            </Button>
          </div>
          <Button
            onClick={() => {
              const url = prompt("Enter background image URL (or leave empty for black background):")
              if (url !== null) {
                const style = document.querySelector("style[data-bg]") || document.createElement("style")
                style.setAttribute("data-bg", "true")
                style.textContent = url
                  ? `.terminal-bg { background-image: url('${url}') !important; }`
                  : `.terminal-bg { background: #000000 !important; }`
                if (!document.head.contains(style)) document.head.appendChild(style)
              }
            }}
            className="terminal-button"
          >
            <Terminal className="h-4 w-4 mr-2" />
            set_background
          </Button>
        </div>

        {/* Main Terminal Interface */}
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="terminal-card rounded-none grid w-full grid-cols-2">
            <TabsTrigger
              value="expenses"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 terminal-text"
            >
              ./expenses
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 terminal-text"
            >
              ./goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="terminal-header text-xl">EXPENSE_PROCESSES</h2>
              <Button onClick={addExpense} className="terminal-button">
                <Plus className="h-4 w-4 mr-2" />
                spawn_process
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetData.expenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={setEditingExpense}
                  onDelete={deleteExpense}
                  draggedItem={draggedItem}
                  setDraggedItem={setDraggedItem}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="terminal-header text-xl">TARGET_PROCESSES</h2>
              <Button onClick={addGoal} className="terminal-button">
                <Plus className="h-4 w-4 mr-2" />
                create_target
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetData.goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={setEditingGoal}
                  onDelete={deleteGoal}
                  draggedItem={draggedItem}
                  setDraggedItem={setDraggedItem}
                />
              ))}
            </div>

            {budgetData.goals.length > 0 && (
              <Card className="terminal-card rounded-none">
                <CardHeader>
                  <CardTitle className="terminal-header">GOAL_SUMMARY</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="terminal-secondary text-sm">TARGET_TOTAL</p>
                      <p className="terminal-accent text-2xl font-mono">${totalGoalTarget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="terminal-secondary text-sm">CURRENT_TOTAL</p>
                      <p className="terminal-accent text-2xl font-mono">${totalGoalCurrent.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="terminal-secondary">PROGRESS</span>
                      <span className="terminal-accent">
                        {totalGoalTarget > 0 ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0}%
                      </span>
                    </div>
                    <div className="progress-bar rounded-none h-2">
                      <div
                        className="progress-fill h-full rounded-none transition-all duration-300"
                        style={{
                          width: `${totalGoalTarget > 0 ? Math.min((totalGoalCurrent / totalGoalTarget) * 100, 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
  onEdit,
  onDelete,
  draggedItem,
  setDraggedItem,
}: {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
  draggedItem: string | null
  setDraggedItem: (id: string | null) => void
}) {
  return (
    <Card
      className={`terminal-card rounded-none cursor-move transition-all duration-200 ${
        draggedItem === expense.id ? "ring-1 ring-green-500" : ""
      }`}
      draggable
      onDragStart={() => setDraggedItem(expense.id)}
      onDragEnd={() => setDraggedItem(null)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-none"
              style={{ backgroundColor: expense.color, boxShadow: `0 0 5px ${expense.color}` }}
            />
            <CardTitle className="card-title text-sm font-mono">{expense.label}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(expense)}
              className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(expense.id)}
              className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-mono" style={{ color: expense.color }}>
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
  onEdit,
  onDelete,
  draggedItem,
  setDraggedItem,
}: {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  draggedItem: string | null
  setDraggedItem: (id: string | null) => void
}) {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0

  return (
    <Card
      className={`terminal-card rounded-none cursor-move transition-all duration-200 ${
        draggedItem === goal.id ? "ring-1 ring-green-500" : ""
      }`}
      draggable
      onDragStart={() => setDraggedItem(goal.id)}
      onDragEnd={() => setDraggedItem(null)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-none"
              style={{ backgroundColor: goal.color, boxShadow: `0 0 5px ${goal.color}` }}
            />
            <CardTitle className="card-title text-sm font-mono">{goal.label}</CardTitle>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(goal)}
              className="h-6 w-6 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(goal.id)}
              className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
          <div className="flex justify-between text-sm font-mono">
            <span style={{ color: goal.color }}>${goal.currentAmount.toLocaleString()}</span>
            <span className="text-gray-400">${goal.targetAmount.toLocaleString()}</span>
          </div>
          {goal.description && <p className="text-xs text-gray-500 font-mono mt-2">{goal.description}</p>}
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
      <DialogContent className="terminal-card text-green-400 rounded-none border-green-500/30">
        <DialogHeader>
          <DialogTitle className="terminal-header">EDIT_EXPENSE_PROCESS</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="terminal-secondary text-sm">PROCESS_NAME</Label>
            <Input
              value={editedExpense.label}
              onChange={(e) => setEditedExpense((prev) => ({ ...prev, label: e.target.value }))}
              className="terminal-input"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-sm">MEMORY_USAGE</Label>
            <Input
              type="number"
              value={editedExpense.amount || ""}
              onChange={(e) => setEditedExpense((prev) => ({ ...prev, amount: Number(e.target.value) || 0 }))}
              className="terminal-input"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-sm">CATEGORY</Label>
            <Input
              value={editedExpense.category}
              onChange={(e) => setEditedExpense((prev) => ({ ...prev, category: e.target.value }))}
              className="terminal-input"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-sm">COLOR_CODE</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {TERMINAL_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-none border ${
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
            <Button onClick={() => onSave(editedExpense)} className="terminal-button">
              save_changes
            </Button>
            <Button onClick={onClose} className="terminal-button">
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
      <DialogContent className="terminal-card text-green-400 rounded-none border-green-500/30">
        <DialogHeader>
          <DialogTitle className="terminal-header">EDIT_TARGET_PROCESS</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="terminal-secondary text-sm">TARGET_NAME</Label>
            <Input
              value={editedGoal.label}
              onChange={(e) => setEditedGoal((prev) => ({ ...prev, label: e.target.value }))}
              className="terminal-input"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-sm">TARGET_AMOUNT</Label>
            <Input
              type="number"
              value={editedGoal.targetAmount || ""}
              onChange={(e) => setEditedGoal((prev) => ({ ...prev, targetAmount: Number(e.target.value) || 0 }))}
              className="terminal-input"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-sm">CURRENT_AMOUNT</Label>
            <Input
              type="number"
              value={editedGoal.currentAmount || ""}
              onChange={(e) => setEditedGoal((prev) => ({ ...prev, currentAmount: Number(e.target.value) || 0 }))}
              className="terminal-input"
            />
          </div>
          <div>
            <Label className="terminal-secondary text-sm">DESCRIPTION</Label>
            <Textarea
              value={editedGoal.description}
              onChange={(e) => setEditedGoal((prev) => ({ ...prev, description: e.target.value }))}
              className="terminal-input"
              placeholder="optional_description..."
            />
          </div>
          <div>
            <Label className="terminal-secondary text-sm">COLOR_CODE</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {TERMINAL_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-none border ${
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
            <Button onClick={() => onSave(editedGoal)} className="terminal-button">
              save_changes
            </Button>
            <Button onClick={onClose} className="terminal-button">
              cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
