import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ui/theme-provider";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Moon, Sun, Lock, Mail } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [clientMessages, setClientMessages] = useState(true);

  const saveNotificationSettings = () => {
    toast({
      title: "Settings updated",
      description: "Your notification settings have been saved.",
    });
  };

  return (
    <AppShell>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your general application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-mode">Dark Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Switch 
                      id="theme-mode" 
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Language</Label>
                    <div className="text-sm text-muted-foreground">
                      Choose your preferred language
                    </div>
                  </div>
                  <select className="border rounded p-2">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="pt">Portuguese</option>
                    <option value="de">German</option>
                  </select>
                </div>
                
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </div>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="project-updates">Project Updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified when projects are updated
                    </div>
                  </div>
                  <Switch 
                    id="project-updates" 
                    checked={projectUpdates}
                    onCheckedChange={setProjectUpdates}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-reminders">Task Reminders</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive reminders for upcoming task deadlines
                    </div>
                  </div>
                  <Switch 
                    id="task-reminders" 
                    checked={taskReminders}
                    onCheckedChange={setTaskReminders}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="client-messages">Client Messages</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified when clients send messages
                    </div>
                  </div>
                  <Switch 
                    id="client-messages" 
                    checked={clientMessages}
                    onCheckedChange={setClientMessages}
                  />
                </div>
                
                <Button onClick={saveNotificationSettings}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Change Password</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    It's a good idea to use a strong password that you're not using elsewhere
                  </p>
                  <Button variant="outline">Change Password</Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium">Login Notifications</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get notified when someone logs into your account
                  </p>
                  <div className="flex items-center space-x-2">
                    <Switch id="login-notifications" />
                    <Label htmlFor="login-notifications">Enable login alerts</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}