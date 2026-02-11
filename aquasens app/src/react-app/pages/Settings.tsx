import { useState, useEffect } from 'react';
import { Card } from '@/react-app/components/ui/card';
import { Switch } from '@/react-app/components/ui/switch';
import { Label } from '@/react-app/components/ui/label';
import { Settings as SettingsIcon, Moon, Sun, Bell, Droplet, Info, Mail } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoTest, setAutoTest] = useState(false);

  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950 pb-24 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-20 right-20 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shadow-lg shadow-slate-500/50">
            <SettingsIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">Customize your experience</p>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Appearance</h2>
          <Card className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex items-center gap-3 cursor-pointer">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-600" />
                )}
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-xs text-muted-foreground">
                    {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                  </div>
                </div>
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Notifications</h2>
          <Card className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex items-center gap-3 cursor-pointer">
                <Bell className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-xs text-muted-foreground">
                    Get alerts for water quality changes
                  </div>
                </div>
              </Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </Card>
        </div>

        {/* Testing */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Testing</h2>
          <Card className="p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-test" className="flex items-center gap-3 cursor-pointer">
                <Droplet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <div>
                  <div className="font-medium">Auto-Test</div>
                  <div className="text-xs text-muted-foreground">
                    Automatically test water every hour
                  </div>
                </div>
              </Label>
              <Switch
                id="auto-test"
                checked={autoTest}
                onCheckedChange={setAutoTest}
              />
            </div>
          </Card>
        </div>

        {/* App Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">About</h2>
          <Card className="p-5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-cyan-200 dark:border-cyan-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  AquaSens
                </div>
                <div className="text-sm text-muted-foreground">Version 1.0.0</div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-cyan-200 dark:border-cyan-800">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Smart Water Purity Monitoring App with ESP32 connectivity for real-time water quality analysis and community reporting.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2">
                <Info className="w-4 h-4" />
                Help & Support
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Mail className="w-4 h-4" />
                Contact Us
              </Button>
            </div>
          </Card>
        </div>

        {/* Credits */}
        <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5 backdrop-blur-md border-cyan-300 dark:border-cyan-700">
          <div className="text-center text-sm text-cyan-800 dark:text-cyan-200">
            <p className="font-medium">Built with 💧 for clean water monitoring</p>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
              © 2024 AquaSens. All rights reserved.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
