export interface User {
  id: string
  name: string
  email: string
  photo: string
  callsMade: number
  totalCalls: number
  minutesUsed: number
  totalMinutes: number
  plan: string
  expiry: string
  sheetCreated: boolean
  sheetLink: string
  isAdmin: boolean
  lastActive: string
}

export interface CallRecord {
  id: string
  name: string
  phone: string
  status: "Called" | "Pending" | "Failed"
  lastCalled: string
}

export interface AdminStats {
  totalUsers: number
  totalCallsToday: number
  activeSubscriptions: number
}

// Mock current user data
export const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  photo: "https://i.pravatar.cc/150?img=3",
  callsMade: 12,
  totalCalls: 100,
  minutesUsed: 15,
  totalMinutes: 200,
  plan: "Pro Plan",
  expiry: "2025-05-30",
  sheetCreated: true,
  sheetLink: "https://sheets.google.com/mock123",
  isAdmin: true,
  lastActive: "2025-01-14",
}

// Mock call records
export const mockCallRecords: CallRecord[] = [
  {
    id: "1",
    name: "Alice Johnson",
    phone: "+1 (555) 123-4567",
    status: "Called",
    lastCalled: "2025-01-14 10:30 AM",
  },
  {
    id: "2",
    name: "Bob Smith",
    phone: "+1 (555) 987-6543",
    status: "Pending",
    lastCalled: "Never",
  },
  {
    id: "3",
    name: "Carol Davis",
    phone: "+1 (555) 456-7890",
    status: "Failed",
    lastCalled: "2025-01-13 3:45 PM",
  },
  {
    id: "4",
    name: "David Wilson",
    phone: "+1 (555) 321-0987",
    status: "Called",
    lastCalled: "2025-01-14 9:15 AM",
  },
]

// Mock admin data
export const mockAdminStats: AdminStats = {
  totalUsers: 142,
  totalCallsToday: 1240,
  activeSubscriptions: 89,
}

// Mock users for admin panel
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    photo: "https://i.pravatar.cc/150?img=3",
    callsMade: 12,
    totalCalls: 100,
    minutesUsed: 15,
    totalMinutes: 200,
    plan: "Pro Plan",
    expiry: "2025-05-30",
    sheetCreated: true,
    sheetLink: "https://sheets.google.com/mock123",
    isAdmin: true,
    lastActive: "2025-01-14",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    photo: "https://i.pravatar.cc/150?img=5",
    callsMade: 45,
    totalCalls: 50,
    minutesUsed: 120,
    totalMinutes: 150,
    plan: "Enterprise",
    expiry: "2025-08-15",
    sheetCreated: true,
    sheetLink: "https://sheets.google.com/mock456",
    isAdmin: false,
    lastActive: "2025-01-13",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    photo: "https://i.pravatar.cc/150?img=7",
    callsMade: 8,
    totalCalls: 25,
    minutesUsed: 5,
    totalMinutes: 50,
    plan: "Free",
    expiry: "2025-02-28",
    sheetCreated: false,
    sheetLink: "",
    isAdmin: false,
    lastActive: "2025-01-12",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    photo: "https://i.pravatar.cc/150?img=9",
    callsMade: 23,
    totalCalls: 75,
    minutesUsed: 67,
    totalMinutes: 100,
    plan: "Pro Plan",
    expiry: "2025-06-20",
    sheetCreated: true,
    sheetLink: "https://sheets.google.com/mock789",
    isAdmin: false,
    lastActive: "2025-01-14",
  },
  {
    id: "5",
    name: "Alex Chen",
    email: "alex@example.com",
    photo: "https://i.pravatar.cc/150?img=11",
    callsMade: 0,
    totalCalls: 10,
    minutesUsed: 0,
    totalMinutes: 30,
    plan: "Free",
    expiry: "2025-03-15",
    sheetCreated: false,
    sheetLink: "",
    isAdmin: false,
    lastActive: "2025-01-10",
  },
]

export const subscriptionPlans = [
  {
    id: "1",
    name: "Free",
    price: "$0/month",
    calls: 10,
    minutes: 30,
    features: ["Basic calling", "Google Sheets integration", "Email support"],
  },
  {
    id: "2",
    name: "Pro Plan",
    price: "$29/month",
    calls: 100,
    minutes: 200,
    features: ["Advanced calling", "Priority support", "Analytics dashboard", "Custom scripts"],
  },
  {
    id: "3",
    name: "Enterprise",
    price: "$99/month",
    calls: 500,
    minutes: 1000,
    features: ["Unlimited features", "24/7 support", "Custom integrations", "Team management"],
  },
]
