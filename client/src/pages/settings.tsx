import { useState } from "react";
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

  const { data: integrations = [] } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const bookingComIntegration = integrations.find(i => i.platform === "booking.com");

  const saveIntegrationMutation = useMutation({
    mutationFn: async (data: { platform: string; apiKey: string; apiSecret: string; propertyId: string; isActive: number }) => {
      if (bookingComIntegration) {
        return await apiRequest("PATCH", `/api/integrations/${bookingComIntegration.id}`, data);
      } else {
        return await apiRequest("POST", "/api/integrations", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      toast({
        title: "Saved successfully",
        description: "Integration settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save integration settings.",
        variant: "destructive",
      });
    },
  });

  const deleteIntegrationMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/integrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      setBookingComConfig({
        apiKey: "",
        apiSecret: "",
        propertyId: "",
        isActive: false,
      });
      toast({
        title: "Deleted successfully",
        description: "Integration has been removed.",
      });
    },
  });

  const handleSave = () => {
    if (!bookingComConfig.apiKey || !bookingComConfig.propertyId) {
      toast({
        title: "Validation error",
        description: "API Key and Property ID are required.",
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
                    onClick={() => deleteIntegrationMutation.mutate(bookingComIntegration.id)}
                    disabled={deleteIntegrationMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleteIntegrationMutation.isPending ? "Removing..." : "Remove Integration"}
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
