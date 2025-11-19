import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { User, Lock, CreditCard, Trash2, Settings } from "lucide-react";
import { stackAuth } from "../lib/stackAuth";
import { toast } from "sonner";

interface AccountSheetProps {
  children?: React.ReactNode;
}

const AccountSheet = ({ children }: AccountSheetProps) => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userData = stackAuth.getUser();
    if (userData) {
      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
    }
  }, [open]);

  const handleUpdateProfile = () => {
    toast.success("Profil actualizat cu succes!");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Parolele nu coincid!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Parola trebuie să aibă minim 8 caractere!");
      return;
    }
    toast.success("Parola a fost schimbată cu succes!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCancelSubscription = (plan: string) => {
    toast.success(`Abonamentul ${plan} a fost anulat!`);
  };

  const handleDeleteAccount = () => {
    toast.success("Contul a fost șters permanent!");
    stackAuth.logout();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children ? (
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
            <Settings className="mr-2 h-4 w-4" />
            Setări Cont
          </button>
        </SheetTrigger>
      )}
      <SheetContent side="left" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Setări Cont</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <CreditCard className="mr-2 h-4 w-4" />
              Abonament
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" />
              Securitate
            </TabsTrigger>
          </TabsList>

          {/* Profil Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informații Profil</CardTitle>
                <CardDescription>
                  Actualizează informațiile tale personale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Schimbă Fotografia
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG sau GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nume Complet</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ion Popescu"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ion.popescu@exemplu.com"
                    />
                  </div>

                  <Button onClick={handleUpdateProfile} className="w-full">
                    Salvează Modificările
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Abonament Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Abonamentul Tău</CardTitle>
                <CardDescription>
                  Gestionează abonamentele tale active
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Professional</h4>
                      <Badge variant="default">Activ</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      €45/lună
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Următoarea facturare: 16 Decembrie 2025
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          Anulează Abonamentul
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Ești sigur că vrei să anulezi abonamentul?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Vei pierde accesul la toate funcționalitățile premium
                            la sfârșitul perioadei de facturare curente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Renunță</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancelSubscription("Professional")}
                          >
                            Anulează Abonamentul
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="p-4 border rounded-lg bg-card opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Enterprise</h4>
                      <Badge variant="outline">Inactiv</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      €450/an
                    </p>
                    <Button variant="default" size="sm" className="w-full">
                      Upgrade la Enterprise
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Securitate Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schimbă Parola</CardTitle>
                <CardDescription>
                  Asigură-te că contul tău folosește o parolă sigură
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Parola Curentă</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="new-password">Parolă Nouă</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirmă Parola Nouă</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button onClick={handleChangePassword} className="w-full">
                  Actualizează Parola
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Zona Periculoasă</CardTitle>
                <CardDescription>
                  Acțiuni ireversibile asupra contului tău
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Șterge Contul Permanent
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Ești absolut sigur?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Această acțiune nu poate fi anulată. Toate datele tale vor
                        fi șterse permanent și nu vor putea fi recuperate.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Renunță</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Da, șterge contul definitiv
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default AccountSheet;

