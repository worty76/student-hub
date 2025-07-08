'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  Save,
  RefreshCw,
  Shield,
  AlertTriangle,
  Database,
  Mail
} from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'StudentHub',
    siteDescription: 'Second-Hand Marketplace for Students',
    maxProductsPerUser: 50,
    allowedFileTypes: ['jpg', 'jpeg', 'png'],
    maxFileSize: 5, // MB
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    moderationEnabled: true,
    autoApproveProducts: false,
    reportThreshold: 3,
  });

  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Mock save - replace with actual API call
      setTimeout(() => {
        setLoading(false);
        alert('Settings saved successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      // Mock email test - replace with actual API call
      alert('Test email sent successfully!');
    } catch (error) {
      console.error('Error sending test email:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      // Mock cache clear - replace with actual API call
      alert('Cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxProducts">Max Products Per User</Label>
              <Input
                id="maxProducts"
                type="number"
                value={settings.maxProductsPerUser}
                onChange={(e) => setSettings(prev => ({ ...prev, maxProductsPerUser: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>File Upload Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Allowed File Types</Label>
              <div className="flex flex-wrap gap-2">
                {settings.allowedFileTypes.map((type, index) => (
                  <Badge key={index} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Moderation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security & Moderation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <Select
                  value={settings.maintenanceMode ? 'enabled' : 'disabled'}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, maintenanceMode: value === 'enabled' }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="registrationEnabled">User Registration</Label>
                <Select
                  value={settings.registrationEnabled ? 'enabled' : 'disabled'}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, registrationEnabled: value === 'enabled' }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="moderationEnabled">Content Moderation</Label>
                <Select
                  value={settings.moderationEnabled ? 'enabled' : 'disabled'}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, moderationEnabled: value === 'enabled' }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoApprove">Auto-approve Products</Label>
                <Select
                  value={settings.autoApproveProducts ? 'enabled' : 'disabled'}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, autoApproveProducts: value === 'enabled' }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportThreshold">Report Threshold</Label>
                <Input
                  id="reportThreshold"
                  type="number"
                  value={settings.reportThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, reportThreshold: parseInt(e.target.value) }))}
                  placeholder="Number of reports before action"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600">Send email notifications to users</p>
            </div>
            <Select
              value={settings.emailNotifications ? 'enabled' : 'disabled'}
              onValueChange={(value) => setSettings(prev => ({ ...prev, emailNotifications: value === 'enabled' }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div className="flex justify-start">
            <Button variant="outline" onClick={handleTestEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Send Test Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>System Maintenance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleClearCache}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <Button variant="outline" disabled>
              <Database className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Maintenance Actions</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  These actions may temporarily affect system performance. Use with caution during peak hours.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 