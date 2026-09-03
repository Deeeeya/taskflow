import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { User, Palette } from "lucide-react";

interface SettingsModalProps {
    isOpen: boolean,
    onClose: () => void
}

export const SettingsPage = ({ isOpen, onClose }: SettingsModalProps) => {
    const { user } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [activeSection, setActiveSection] = useState<'account' | 'appearance'>('account')

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl h-[500px] p-0">
                {/* holds sidebar + content */}
                <div className="flex h-full">
                    {/* sidebar that holds sections/buttons */}
                    <div className="flex flex-col w-48 h-full bg-muted/40 border-r p-3">
                        <p className="text-xs uppercase text-muted-foreground font-medium mb-2">SETTINGS</p>
                        <Button
                            className={`w-full justify-start gap-2 rounded-md text-sm font-normal ${activeSection === 'account' ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                            variant="ghost"
                            onClick={() => setActiveSection('account')}
                        >
                            <User className="w-4 h-4" />
                            Account
                        </Button>
                        <Button
                            className={`w-full justify-start gap-2 rounded-md text-sm font-normal ${activeSection === 'appearance' ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                            variant="ghost"
                            onClick={() => setActiveSection('appearance')}
                        >
                            <Palette className="w-4 h-4" />
                            Appearance
                        </Button>
                    </div>
                    {/* right section of settings modal */}
                    <div className="flex-1 p-6 overflow-auto">
                        {activeSection === 'account' && (
                            <>
                                <h3 className="font-semibold mb-2">Account</h3>
                                <div className="bg-card ring-1 ring-foreground/10 rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex justify-center items-center text-sm font-bold shrink-0">
                                            {user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <span className="font-medium">{user?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3">
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="text-sm">{user?.email}</p>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeSection === 'appearance' && (
                            <>
                                <h3 className="font-semibold mb-2">Appearance</h3>
                                <div className="bg-card ring-1 ring-foreground/10 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Theme</p>
                                        <Button variant="ghost" className="gap-2 rounded-md" onClick={toggleTheme}>
                                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                            {theme === 'dark' ? 'Dark' : 'Light'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
