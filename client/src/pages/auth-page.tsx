import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const loginFormSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Redirect if already logged in
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-black via-black to-purple-950">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4 py-10">
        {/* Left Column - Auth Forms */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-purple-300 to-purple-500 text-transparent bg-clip-text">
            Discord Bot Admin
          </h1>
          <p className="text-gray-300 mb-10">
            Control your Discord bot from a simple, intuitive dashboard.
          </p>

          <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-base">Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="bg-black/40 border border-purple-800/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Login to Dashboard</CardTitle>
                  <CardDescription>
                    Enter your credentials to access the admin dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Log in"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="bg-black/40 border border-purple-800/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>About this Admin Dashboard</CardTitle>
                  <CardDescription>
                    Information about the Discord bot management system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Features</h3>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
                      <li>Configure bot status and activity</li>
                      <li>Manage economy settings</li>
                      <li>Control leveling system</li>
                      <li>Customize music player options</li>
                      <li>Set up anime guessing game</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Development Credits</h3>
                    <p className="mt-2 text-gray-300">
                      Special thanks to <span className="font-semibold text-purple-400">Jahceere</span> for the idea and contributions to this Discord bot project.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                    onClick={() => setActiveTab("login")}
                  >
                    Back to Login
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Hero Information */}
        <div className="hidden md:flex flex-col justify-center relative">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-purple-800 rounded-full filter blur-3xl opacity-20"></div>
          
          <div className="relative z-10 bg-black/40 border border-purple-800/30 backdrop-blur-sm rounded-xl p-10">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-purple-500 text-transparent bg-clip-text">
              Powerful Discord Bot Management
            </h2>
            <p className="text-gray-300 mb-6">
              Control every aspect of your Discord bot from this intuitive dashboard. 
              Configure commands, manage economy systems, and update activities with ease.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Real-time Analytics</h3>
                  <p className="text-gray-300">Monitor your bot's performance and activity</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Easy Configuration</h3>
                  <p className="text-gray-300">Change bot settings without coding knowledge</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-purple-600 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white">Custom Commands</h3>
                  <p className="text-gray-300">Create and edit bot commands with ease</p>
                </div>
              </div>
            </div>
            
            <Button className="mt-8 w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Add Bot to Discord Server
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}