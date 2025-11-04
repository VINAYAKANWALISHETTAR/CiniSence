import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Camera, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Profile() {
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Load avatar from localStorage on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem(`avatar_${user?.id}`);
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    } else {
      // Generate default avatar based on user's name
      const defaultAvatar = user?.name 
        ? `https://via.placeholder.com/150/1e293b/94a3b8?text=${user.name.charAt(0).toUpperCase()}`
        : "https://via.placeholder.com/150/1e293b/94a3b8?text=U";
      setAvatarUrl(defaultAvatar);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    if (avatarPreview && user?.id) {
      // Save to localStorage (in a real app, this would be saved to a database)
      localStorage.setItem(`avatar_${user.id}`, avatarPreview);
      setAvatarUrl(avatarPreview);
      setAvatarPreview(null);
    }
  };

  const currentAvatar = avatarPreview || avatarUrl;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-primary/10 p-4 rounded-lg">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile image</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <img 
                        src={currentAvatar || "https://via.placeholder.com/150/1e293b/94a3b8?text=U"} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                      />
                      <label className="absolute bottom-2 right-2 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="h-4 w-4 text-primary-foreground" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      JPG, GIF or PNG. Max size of 5MB
                    </p>
                    {avatarPreview && (
                      <Button className="w-full" onClick={handleSaveAvatar}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile Image
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={user?.name || ""}
                      disabled
                    />
                    <p className="text-sm text-muted-foreground">
                      Name cannot be changed. Contact support if you need to update this information.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new movies and recommendations
                        </p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Privacy Settings</h3>
                        <p className="text-sm text-muted-foreground">
                          Control who can see your activity
                        </p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}