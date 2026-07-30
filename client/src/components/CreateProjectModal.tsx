import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/context/AuthContext";
import { FolderOpen, FileText } from "lucide-react";

interface CreateProjectModalProps {
    isOpen: boolean,
    onClose: () => void,
    onProjectCreated: (project: any) => void
}

export const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { token } = useAuth()

    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            if (name == '') {
                setError('Project name is required')
                return
            }

            const response = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, description }),

            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
            } else {
                onProjectCreated(data)
                onClose()
                setName('')
                setDescription('')
                setError('')
            }
        } catch {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-background rounded-2xl border border-primary/30 shadow-lg shadow-primary/10">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add Project</DialogTitle>
                    <p className="text-muted-foreground text-sm">Create a new project to organize your tasks</p>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {/* Name Field */}
                    <div className="flex flex-col gap-2">
                        <Label>Name</Label>
                        <div className="relative">
                            <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input className="rounded-full pl-9" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    {/* Description Field */}
                    <div className="flex flex-col gap-2">
                        <Label>Description</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input className="rounded-full pl-9" placeholder="Add a description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    {error && <p className="text-destructive text-sm text-center">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="ghost" className="rounded-full" onClick={onClose}>Cancel</Button>
                    <Button className="rounded-full" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Project'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}