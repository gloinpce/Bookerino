import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { User, Mail, Lock, Image, Trash2, CreditCard, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { stackAuth } from "../lib/stackAuth";

const Account = () => {
  const navigate = useNavigate();
  // @ts-ignore - getCurrentUser is available
  const user = stackAuth.getCurrentUser();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string>("");

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profilul a fost actualizat cu succes!");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.newPassword !== profileData.confirmPassword) {
      alert("Parolele nu se potrivesc!");
      return;
    }
    alert("Parola a fost schimbată cu succes!");
    setProfileData({ ...profileData, currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleCancelSubscription = () => {
    alert("Abonamentul tău a fost anulat. Vei avea acces până la sfârșitul perioadei de facturare.");
  };

  const handleDeleteAccount = () => {
    alert("Contul tău a fost șters definitiv.");
    stackAuth.logout();
    navigate("/");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Setările Contului</h1>
          <p className="text-muted-foreground">Gestionează informațiile contului și preferințele tale</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="subscription">Abonament</TabsTrigger>
            <TabsTrigger value="security">Securitate</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informații Profil</CardTitle>
                <CardDescription>
                  Actualizează informațiile tale personale și poza de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Image className="h-4 w-4" />
                        Schimbă Poza de Profil
                      </div>
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG sau GIF. Maxim 2MB.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <User className="h-4 w-4 inline mr-2" />
                      Nume
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Numele tău"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Salvează Modificările
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <div className="space-y-6">
              {/* Active Subscriptions */}
              {(user.subscriptions?.professional?.active || user.subscriptions?.enterprise?.active) && (
                <div className="space-y-4">
                  {user.subscriptions?.professional?.active && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          {user.subscriptions.professional.plan}
                        </CardTitle>
                        <CardDescription>Abonament activ</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Preț</p>
                            <p className="font-semibold">{user.subscriptions.professional.price}/{user.subscriptions.professional.billingPeriod}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Următoarea Factură</p>
                            <p className="font-semibold">{user.subscriptions.professional.nextBilling}</p>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                              Anulează Abonamentul
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Vei pierde accesul la toate funcționalitățile după sfârșitul perioadei de facturare. Această acțiune nu poate fi anulată.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Renunță</AlertDialogCancel>
                              <AlertDialogAction onClick={handleCancelSubscription}>
                                Confirmă Anularea
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardContent>
                    </Card>
                  )}

                  {user.subscriptions?.enterprise?.active && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          {user.subscriptions.enterprise.plan}
                        </CardTitle>
                        <CardDescription>Abonament activ</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Preț</p>
                            <p className="font-semibold">{user.subscriptions.enterprise.price}/{user.subscriptions.enterprise.billingPeriod}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Următoarea Factură</p>
                            <p className="font-semibold">{user.subscriptions.enterprise.nextBilling}</p>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                              Anulează Abonamentul
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Vei pierde accesul la toate funcționalitățile după sfârșitul perioadei de facturare. Această acțiune nu poate fi anulată.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Renunță</AlertDialogCancel>
                              <AlertDialogAction onClick={handleCancelSubscription}>
                                Confirmă Anularea
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* No Active Subscription */}
              {!user.subscriptions?.professional?.active && !user.subscriptions?.enterprise?.active && (
                <Card>
                  <CardHeader>
                    <CardTitle>Niciun Abonament Activ</CardTitle>
                    <CardDescription>
                      Alege un plan pentru a accesa toate funcționalitățile Bookerino
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => navigate("/pricing")}>
                      Vezi Planurile Disponibile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle>Schimbă Parola</CardTitle>
                  <CardDescription>
                    Actualizează parola contului tău pentru o securitate mai bună
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        <Lock className="h-4 w-4 inline mr-2" />
                        Parola Curentă
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Parola Nouă</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmă Parola Nouă</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Schimbă Parola
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Delete Account */}
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Zona Periculoasă</CardTitle>
                  <CardDescription>
                    Acțiuni ireversibile pentru contul tău
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Șterge Contul Definitiv
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Această acțiune nu poate fi anulată. Toate datele tale vor fi șterse permanent, inclusiv:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Informațiile contului</li>
                            <li>Abonamentele active</li>
                            <li>Istoricul rezervărilor</li>
                            <li>Toate datele asociate</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Renunță</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Da, Șterge Contul Meu
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;

