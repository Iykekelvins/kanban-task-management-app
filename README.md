# Kanban Task Management App

A modern, full-stack task management application built with cutting-edge technologies. Organize your projects with intuitive drag-and-drop functionality and real-time collaboration features.

![Kanban App Preview](preview.png)

## ✨ Features

- **📋 Board Management** - Create, edit, and delete multiple boards for different projects
- **🎯 Task Organization** - Organize tasks across customizable columns (Todo, Doing, Done, etc.)
- **🖱️ Drag & Drop** - Seamlessly move tasks between columns with smooth animations
- **✅ Subtasks** - Break down complex tasks into manageable subtasks
- **🔐 Authentication** - Secure user authentication and authorization
- **⚡ Real-time Updates** - Instant synchronization across all devices
- **🎨 Beautiful UI** - Clean, modern interface with dark mode support
- **📱 Responsive Design** - Works flawlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework:** [Next.js 16](https://nextjs.org/) - React framework for production
- **Backend & Database:** [Convex](https://convex.dev/) - Real-time backend-as-a-service
- **Authentication:** [Clerk](https://clerk.dev/) - Complete user management
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/) - Modern drag and drop toolkit
- **Form Management:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Type-safe form validation
- **State Management:** Convex Real-time Queries

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Convex account ([sign up here](https://convex.dev/))
- A Clerk account ([sign up here](https://clerk.dev/))

### Installation

1. **Clone the repository**

```bash
   git clone https://github.com/iykekelvins/kanban-task-management-app.git
   cd kanban-app
```

2. **Install dependencies**

```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

```env
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   CLERK_JWT_ISSUER_DOMAIN=
   CLERK_SECRET_KEY=
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

   # Convex
   NEXT_PUBLIC_CONVEX_URL=
   CONVEX_DEPLOYMENT=
   NEXT_PUBLIC_CONVEX_URL=
   NEXT_PUBLIC_CONVEX_SITE_URL=

```

4. **Run Convex development server**

```bash
   npx convex dev
```

5. **Run the development server**

```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kanban-app/
├── app/                  # Next.js app directory
│   ├── (boards)/         # Board routes
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── modals/           # Modal components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Other components
├── convex/               # Convex backend
│   ├── boards.ts         # Board mutations & queries
│   ├── tasks.ts          # Task mutations & queries
│   ├── users.ts          # User mutations & queries
│   └── schema.ts         # Database schema
├── lib/                  # Utility functions
└── public/               # Static assets
```

## 🎯 Key Features Explained

### Board Management

- Create multiple boards for different projects
- Edit board names and columns
- Delete boards (cascades to all tasks)
- Custom column names (e.g., "Backlog", "In Progress", "Review", "Complete")

### Task Management

- Add tasks with title, description, and status
- Create subtasks for detailed task breakdown
- Track subtask completion progress
- Edit task details and status
- Delete tasks with confirmation

### Drag & Drop

- Intuitive drag handle on each task card
- Visual feedback during drag operations
- Drop tasks into any column to update status
- Optimistic updates for instant feedback
- Mobile-friendly touch support

### Real-time Collaboration

- All changes sync instantly across devices
- Multiple users can work on the same board
- No manual refresh needed

## 🔒 Security

- User authentication managed by Clerk
- All database operations validated server-side
- Users can only access and modify their own boards and tasks
- Secure API endpoints with Convex authentication

## 🎨 Customization

### Adding New Columns

When creating or editing a board, you can add custom columns to match your workflow.

### Theming

The app supports light and dark modes. Modify the Tailwind configuration to customize colors and styles.

## 📝 Database Schema

### Boards

- `_id`: Unique identifier
- `userId`: Owner's user ID
- `name`: Board name
- `slug`: URL-friendly identifier
- `columns`: Array of column names
- `createdAt`: Creation timestamp

### Tasks

- `_id`: Unique identifier
- `userId`: Owner's user ID
- `boardId`: Associated board ID
- `title`: Task title
- `description`: Task description
- `status`: Current column/status
- `subtasks`: Array of subtask objects
- `createdAt`: Creation timestamp

### Users

- `_id`: Unique identifier
- `tokenIdentifier`: Clerk token identifier
- `email`: User email
- `name`: User name
- `imageUrl`: Profile picture URL

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [dnd-kit](https://dndkit.com/)

## 📧 Contact

Kelvin Ochubili - [@iykekelvins](https://x.com/iykekelvins) - kelvinochubili@gmail.com

Project Link: [https://github.com/Iykekelvins/kanban-task-management-app](https://github.com/Iykekelvins/kanban-task-management-app)

---

Made with ❤️ using Next.js and Convex
