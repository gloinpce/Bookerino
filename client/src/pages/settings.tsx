import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Settings as SettingsIcon, Plug, Key, Save, Trash2 } from "lucide-react";
import type { Integration } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();
  const [bookingComConfig, setBookingComConfig] = useState({
    apiKey: "",
    apiSecret: "",
    propertyId: "",
    isActive: false,
  });

  const [googleAdsConfig, setGoogleAdsConfig] = useState({
    apiKey: "",
    apiSecret: "",
    propertyId: "",
    isActive: false,
  });

  const { data: integrations = [] } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const bookingComIntegration = integrations.find(i => i.platform === "booking.com");
  const googleAdsIntegration = integrations.find(i => i.platform === "google-ads");

  useEffect(() => {
    if (bookingComIntegration) {
      setBookingComConfig({
        apiKey: bookingComIntegration.apiKey || "",
        apiSecret: bookingComIntegration.apiSecret || "",
        propertyId: bookingComIntegration.propertyId || "",
        isActive: bookingComIntegration.isActive === 1,
      });
    }
  }, [bookingComIntegration]);

  useEffect(() => {
    if (googleAdsIntegration) {
      setGoogleAdsConfig({
        apiKey: googleAdsIntegration.apiKey || "",
        apiSecret: googleAdsIntegration.apiSecret || "",
        propertyId: googleAdsIntegration.propertyId || "",
        isActive: googleAdsIntegration.isActive === 1,
      });
    }
  }, [googleAdsIntegration]);

  const saveIntegrationMutation = useMutation({
    mutationFn: async (data: { platform: string; apiKey: string; apiSecret: string; propertyId: string; isActive: number; existingId?: string }) => {
      if (data.existingId) {
        const { existingId, ...updateData } = data;
        return await apiRequest("PATCH", `/api/integrations/${existingId}`, updateData);
      } else {
        const { existingId, ...createData } = data;
        return await apiRequest("POST", "/api/integrations", createData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Salvat cu succes",
        description: "Setările integrării au fost actualizate.",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-au putut salva setările integrării.",
        variant: "destructive",
      });
    },
  });

  const deleteIntegrationMutation = useMutation({
    mutationFn: async (data: { id: string; platform: string }) => {
      return await apiRequest("DELETE", `/api/integrations/${data.id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      if (variables.platform === "booking.com") {
        setBookingComConfig({
          apiKey: "",
          apiSecret: "",
          propertyId: "",
          isActive: false,
        });
      } else if (variables.platform === "google-ads") {
        setGoogleAdsConfig({
          apiKey: "",
          apiSecret: "",
          propertyId: "",
          isActive: false,
        });
      }
      toast({
        title: "Șters cu succes",
        description: "Integrarea a fost eliminată.",
      });
    },
  });

  const handleSave = () => {
    if (!bookingComConfig.apiKey || !bookingComConfig.propertyId) {
      toast({
        title: "Eroare de validare",
        description: "API Key și Property ID sunt obligatorii.",
        variant: "destructive",
      });
      return;
    }

    saveIntegrationMutation.mutate({
      platform: "booking.com",
      apiKey: bookingComConfig.apiKey,
      apiSecret: bookingComConfig.apiSecret,
      propertyId: bookingComConfig.propertyId,
      isActive: bookingComConfig.isActive ? 1 : 0,
      existingId: bookingComIntegration?.id,
    });
  };

  const handleSaveGoogleAds = () => {
    if (!googleAdsConfig.apiKey || !googleAdsConfig.propertyId) {
      toast({
        title: "Eroare de validare",
        description: "Developer Token și Customer ID sunt obligatorii.",
        variant: "destructive",
      });
      return;
    }

    saveIntegrationMutation.mutate({
      platform: "google-ads",
      apiKey: googleAdsConfig.apiKey,
      apiSecret: googleAdsConfig.apiSecret,
      propertyId: googleAdsConfig.propertyId,
      isActive: googleAdsConfig.isActive ? 1 : 0,
      existingId: googleAdsIntegration?.id,
    });
  };

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Settings</h1>
        </div>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Manage your hotel settings and external integrations
        </p>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList data-testid="tabs-settings">
          <TabsTrigger value="integrations" data-testid="tab-integrations">
            <Plug className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="general" data-testid="tab-general">
            <SettingsIcon className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl" data-testid="text-integration-title">Booking.com Integration</CardTitle>
                  <CardDescription data-testid="text-integration-description">
                    Connect your Booking.com account to sync rooms and manage reservations automatically
                  </CardDescription>
                </div>
                {bookingComIntegration && (
                  <Badge 
                    variant={bookingComIntegration.isActive ? "default" : "secondary"}
                    data-testid="badge-integration-status"
                  >
                    {bookingComIntegration.isActive ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey" data-testid="label-api-key">
                    <Key className="w-4 h-4 inline mr-2" />
                    API Key
                  </Label>
                  <Input
                    id="apiKey"
                    data-testid="input-api-key"
                    type="password"
                    placeholder="Enter your Booking.com API Key"
                    value={bookingComConfig.apiKey}
                    onChange={(e) => setBookingComConfig({ ...bookingComConfig, apiKey: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground" data-testid="text-api-key-help">
                    Get your API key from Booking.com Connectivity settings
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiSecret" data-testid="label-api-secret">API Secret (Optional)</Label>
                  <Input
                    id="apiSecret"
                    data-testid="input-api-secret"
                    type="password"
                    placeholder="Enter API Secret if required"
                    value={bookingComConfig.apiSecret}
                    onChange={(e) => setBookingComConfig({ ...bookingComConfig, apiSecret: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyId" data-testid="label-property-id">Property ID</Label>
                  <Input
                    id="propertyId"
                    data-testid="input-property-id"
                    placeholder="Enter your Property ID"
                    value={bookingComConfig.propertyId}
                    onChange={(e) => setBookingComConfig({ ...bookingComConfig, propertyId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground" data-testid="text-property-id-help">
                    Find your Property ID in your Booking.com extranet dashboard
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive" data-testid="label-integration-active">Enable Integration</Label>
                    <p className="text-sm text-muted-foreground" data-testid="text-integration-active-help">
                      Activate automatic sync with Booking.com
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    data-testid="switch-integration-active"
                    checked={bookingComConfig.isActive}
                    onCheckedChange={(checked) => setBookingComConfig({ ...bookingComConfig, isActive: checked })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button
                  data-testid="button-save-integration"
                  onClick={handleSave}
                  disabled={saveIntegrationMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveIntegrationMutation.isPending ? "Saving..." : "Save Integration"}
                </Button>
                
                {bookingComIntegration && (
                  <Button
                    data-testid="button-delete-integration"
                    variant="destructive"
                    onClick={() => deleteIntegrationMutation.mutate({ id: bookingComIntegration.id, platform: "booking.com" })}
                    disabled={deleteIntegrationMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleteIntegrationMutation.isPending ? "Se șterge..." : "Șterge integrarea"}
                  </Button>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200" data-testid="text-integration-note">
                  <strong>Note:</strong> This integration is currently prepared for future use. 
                  Once you obtain API access from Booking.com, you can configure it here for automatic room sync and booking management.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl" data-testid="text-googleads-title">Integrare Google Ads</CardTitle>
                  <CardDescription data-testid="text-googleads-description">
                    Conectează-te la Google Ads pentru monitorizarea statisticilor campaniilor de publicitate
                  </CardDescription>
                </div>
                {googleAdsIntegration && (
                  <Badge 
                    variant={googleAdsIntegration.isActive ? "default" : "secondary"}
                    data-testid="badge-googleads-status"
                  >
                    {googleAdsIntegration.isActive ? "Activ" : "Inactiv"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAdsDeveloperToken" data-testid="label-googleads-developer-token">
                    <Key className="w-4 h-4 inline mr-2" />
                    Developer Token
                  </Label>
                  <Input
                    id="googleAdsDeveloperToken"
                    data-testid="input-googleads-developer-token"
                    type="password"
                    placeholder="Introdu Developer Token-ul tău"
                    value={googleAdsConfig.apiKey}
                    onChange={(e) => setGoogleAdsConfig({ ...googleAdsConfig, apiKey: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground" data-testid="text-googleads-developer-token-help">
                    Obține Developer Token din Google Ads API Center
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleAdsClientId" data-testid="label-googleads-client-id">Client ID</Label>
                  <Input
                    id="googleAdsClientId"
                    data-testid="input-googleads-client-id"
                    type="text"
                    placeholder="Introdu Client ID"
                    value={googleAdsConfig.apiSecret}
                    onChange={(e) => setGoogleAdsConfig({ ...googleAdsConfig, apiSecret: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground" data-testid="text-googleads-client-id-help">
                    Client ID din Google Cloud Console
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleAdsCustomerId" data-testid="label-googleads-customer-id">Customer ID</Label>
                  <Input
                    id="googleAdsCustomerId"
                    data-testid="input-googleads-customer-id"
                    placeholder="Introdu Customer ID (ex: 123-456-7890)"
                    value={googleAdsConfig.propertyId}
                    onChange={(e) => setGoogleAdsConfig({ ...googleAdsConfig, propertyId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground" data-testid="text-googleads-customer-id-help">
                    Găsești Customer ID în contul tău Google Ads (în formatul 123-456-7890)
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-md">
                  <div className="space-y-0.5">
                    <Label htmlFor="googleAdsActive" data-testid="label-googleads-active">Activează integrarea</Label>
                    <p className="text-sm text-muted-foreground" data-testid="text-googleads-active-help">
                      Activează monitorizarea automată a statisticilor din Google Ads
                    </p>
                  </div>
                  <Switch
                    id="googleAdsActive"
                    data-testid="switch-googleads-active"
                    checked={googleAdsConfig.isActive}
                    onCheckedChange={(checked) => setGoogleAdsConfig({ ...googleAdsConfig, isActive: checked })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button
                  data-testid="button-save-googleads"
                  onClick={handleSaveGoogleAds}
                  disabled={saveIntegrationMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveIntegrationMutation.isPending ? "Se salvează..." : "Salvează integrarea"}
                </Button>
                
                {googleAdsIntegration && (
                  <Button
                    data-testid="button-delete-googleads"
                    variant="destructive"
                    onClick={() => deleteIntegrationMutation.mutate({ id: googleAdsIntegration.id, platform: "google-ads" })}
                    disabled={deleteIntegrationMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleteIntegrationMutation.isPending ? "Se șterge..." : "Șterge integrarea"}
                  </Button>
                )}
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-md p-4">
                <p className="text-sm text-green-800 dark:text-green-200" data-testid="text-googleads-note">
                  <strong>Notă:</strong> După configurarea integrării Google Ads, vei putea urmări 
                  performanța campaniilor tale de publicitate direct din dashboard. Monitorizează 
                  clicuri, conversii și ROI în timp real.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-general-title">General Settings</CardTitle>
              <CardDescription data-testid="text-general-description">
                Manage your hotel's basic configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground" data-testid="text-general-placeholder">
                General settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
