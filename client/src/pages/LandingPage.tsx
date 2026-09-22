import { Link } from "react-router-dom";
import { CheckSquare, KanbanSquare, ListTodo, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
    {
        icon: KanbanSquare,
        title: "Kanban Board",
        description: "Drag and drop tasks across To Do, In Progress, and Done columns visually.",
    },
    {
        icon: ListTodo,
        title: "Smart Views",
        description: "See all tasks due Today, Upcoming, or filter by Inbox and Completed in one click.",
    },
    {
        icon: LayoutList,
        title: "List & Board Views",
        description: "Switch between Kanban board and list view to work the way that suits you best.",
    },
]

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 flex items-center justify-between h-14 px-6 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="flex items-center gap-2">
                    <CheckSquare className="text-primary w-5 h-5" />
                    <span className="font-bold">Taskflow</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link to="/login">Log in</Link>
                    </Button>
                    <Button className="rounded-full" asChild>
                        <Link to="/register">Get Started</Link>
                    </Button>
                </div>
            </nav>

            {/* Hero */}
            <section className="flex flex-col items-center text-center py-24 px-6 bg-gradient-to-b from-primary/5 to-background">
                <span className="rounded-full bg-primary/10 text-primary text-sm font-medium px-4 py-1 mb-8">
                    Task management, reimagined
                </span>
                <h1 className="text-5xl lg:text-6xl font-bold max-w-3xl">
                    Organize your work. Ship faster.
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mt-8">
                    Taskflow brings your tasks, projects, and team together in one place — with a Kanban board, smart views, and real-time task management.
                </p>
                <div className="flex items-center gap-4 mt-10">
                    <Button size="lg" className="rounded-full" asChild>
                        <Link to="/register">Get Started for Free</Link>
                    </Button>
                    <Button variant="ghost" size="lg" className="rounded-full" asChild>
                        <Link to="/login">Log in</Link>
                    </Button>
                </div>

                {/* App Preview Mockup */}
                <div className="w-full max-w-4xl mt-20 rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden shadow-2xl">
                    {/* Window header bar */}
                    <div className="h-8 bg-zinc-900 flex items-center gap-1.5 px-4 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <div className="flex h-96">
                        {/* Sidebar */}
                        <div className="w-[60px] shrink-0 bg-zinc-800 flex flex-col items-center gap-2.5 py-4">
                            <div className="w-8 h-2 rounded-full bg-zinc-600" />
                            <div className="w-8 h-2 rounded-full bg-zinc-600" />
                            <div className="w-8 h-2 rounded-full bg-zinc-600" />
                            <div className="w-8 h-2 rounded-full bg-zinc-600" />
                        </div>
                        {/* Main content */}
                        <div className="flex-1 grid grid-cols-3 gap-3 p-4 bg-muted/20">
                            {["To Do", "In Progress", "Done"].map((column) => (
                                <div key={column} className="bg-background rounded-lg p-2 flex flex-col gap-2">
                                    <span className="text-[10px] font-medium text-muted-foreground px-1">{column}</span>
                                    <div className="bg-muted/60 rounded-md h-10" />
                                    <div className="bg-muted/60 rounded-md h-10" />
                                    <div className="bg-muted/60 rounded-md h-10" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6">
                <h2 className="text-3xl font-bold text-center">Everything you need to stay organized</h2>
                <p className="text-muted-foreground text-center mt-3 max-w-xl mx-auto">
                    Powerful features to help you and your team plan, track, and finish work.
                </p>
                <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
                    {FEATURES.map((feature) => (
                        <div key={feature.title} className="bg-card ring-1 ring-foreground/10 rounded-2xl p-6 hover:ring-primary/30 hover:shadow-md transition-all">
                            <feature.icon className="text-primary w-8 h-8 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-muted-foreground text-sm py-8 border-t border-border">
                © 2026 Taskflow. Built with React, Node.js, and PostgreSQL.
            </footer>
        </div>
    )
}

export default LandingPage