
import { 
  Parent, 
  Expense, 
  Event, 
  Notification 
} from './types';

export const mockParents: Parent[] = [
  {
    id: 'parent1',
    name: 'Alex Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=4A9FE8&color=fff',
    email: 'alex@example.com',
    phone: '555-123-4567'
  },
  {
    id: 'parent2',
    name: 'Jordan Smith',
    avatar: 'https://ui-avatars.com/api/?name=Jordan+Smith&background=56C5C5&color=fff',
    email: 'jordan@example.com',
    phone: '555-987-6543'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: 'exp1',
    description: 'School supplies',
    amount: 85.75,
    date: '2023-08-15',
    category: 'education',
    paidBy: 'parent1',
    receiptUrl: '/placeholder.svg',
    status: 'pending',
    splitMethod: '50/50',
    notes: 'Notebooks, pens, and backpack for the new school year',
    createdAt: '2023-08-15T14:30:00Z',
    updatedAt: '2023-08-15T14:30:00Z'
  },
  {
    id: 'exp2',
    description: 'Dentist appointment',
    amount: 150,
    date: '2023-07-28',
    category: 'medical',
    paidBy: 'parent2',
    receiptUrl: '/placeholder.svg',
    status: 'approved',
    splitMethod: '50/50',
    notes: 'Regular checkup and cleaning',
    createdAt: '2023-07-28T10:15:00Z',
    updatedAt: '2023-07-29T08:20:00Z'
  },
  {
    id: 'exp3',
    description: 'Soccer club registration',
    amount: 250,
    date: '2023-08-05',
    category: 'activities',
    paidBy: 'parent1',
    receiptUrl: '/placeholder.svg',
    status: 'paid',
    splitMethod: '50/50',
    notes: 'Fall season registration fee and uniform',
    createdAt: '2023-08-05T16:45:00Z',
    updatedAt: '2023-08-07T11:30:00Z'
  },
  {
    id: 'exp4',
    description: 'Winter clothes',
    amount: 125.35,
    date: '2023-08-20',
    category: 'clothing',
    paidBy: 'parent2',
    receiptUrl: '/placeholder.svg',
    status: 'disputed',
    splitMethod: '50/50',
    notes: 'New winter jacket and boots',
    createdAt: '2023-08-20T09:10:00Z',
    updatedAt: '2023-08-21T14:25:00Z'
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    title: 'Parent-teacher meeting',
    description: 'Discuss first quarter progress',
    startDate: '2023-09-15T15:00:00Z',
    endDate: '2023-09-15T16:00:00Z',
    allDay: false,
    location: 'Lincoln Elementary School, Room 102',
    priority: 'high',
    createdBy: 'parent1',
    reminders: [
      {
        id: 'rem1',
        time: '2023-09-15T14:00:00Z',
        type: 'push',
        sent: false
      }
    ]
  },
  {
    id: 'evt2',
    title: 'Dentist appointment',
    description: 'Regular 6-month checkup',
    startDate: '2023-09-20T10:30:00Z',
    endDate: '2023-09-20T11:30:00Z',
    allDay: false,
    location: 'Dr. Miller Dental Office',
    priority: 'medium',
    createdBy: 'parent2',
    reminders: [
      {
        id: 'rem2',
        time: '2023-09-20T09:30:00Z',
        type: 'push',
        sent: false
      },
      {
        id: 'rem3',
        time: '2023-09-19T18:00:00Z',
        type: 'email',
        sent: false
      }
    ]
  },
  {
    id: 'evt3',
    title: 'Soccer practice',
    description: 'Weekly training session',
    startDate: '2023-09-16T16:00:00Z',
    endDate: '2023-09-16T17:30:00Z',
    allDay: false,
    location: 'Memorial Park Field 3',
    priority: 'medium',
    createdBy: 'parent1',
    reminders: [
      {
        id: 'rem4',
        time: '2023-09-16T15:00:00Z',
        type: 'push',
        sent: false
      }
    ]
  },
  {
    id: 'evt4',
    title: 'School Holiday',
    description: 'No school - Teacher preparation day',
    startDate: '2023-09-25T00:00:00Z',
    endDate: '2023-09-25T23:59:59Z',
    allDay: true,
    priority: 'low',
    createdBy: 'parent2',
    reminders: []
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    type: 'expense_added',
    message: 'Alex added a new expense: School supplies ($85.75)',
    relatedId: 'exp1',
    createdAt: '2023-08-15T14:30:00Z',
    read: false
  },
  {
    id: 'notif2',
    type: 'expense_approved',
    message: 'Alex approved the expense: Dentist appointment ($150)',
    relatedId: 'exp2',
    createdAt: '2023-07-29T08:20:00Z',
    read: true
  },
  {
    id: 'notif3',
    type: 'expense_paid',
    message: 'Jordan paid their share of Soccer club registration ($125)',
    relatedId: 'exp3',
    createdAt: '2023-08-07T11:30:00Z',
    read: true
  },
  {
    id: 'notif4',
    type: 'expense_disputed',
    message: 'Alex disputed the expense: Winter clothes ($125.35)',
    relatedId: 'exp4',
    createdAt: '2023-08-21T14:25:00Z',
    read: false
  },
  {
    id: 'notif5',
    type: 'event_added',
    message: 'Jordan added a new event: Dentist appointment on Sep 20',
    relatedId: 'evt2',
    createdAt: '2023-08-30T09:15:00Z',
    read: false
  },
  {
    id: 'notif6',
    type: 'event_reminder',
    message: 'Reminder: Parent-teacher meeting tomorrow at 3:00 PM',
    relatedId: 'evt1',
    createdAt: '2023-09-14T15:00:00Z',
    read: false
  }
];
