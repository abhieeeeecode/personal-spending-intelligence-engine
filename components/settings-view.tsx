'use client';

import { useState } from 'react';
import { 
  User, Bell, Shield, Palette, HelpCircle, LogOut,
  ChevronRight, Moon, Sun, Smartphone, Mail, Lock,
  CreditCard, Trash2, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon, label, description, action, onClick, danger }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 p-4 transition-colors min-h-[60px]',
        'hover:bg-secondary/50',
        danger && 'text-danger'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
        danger ? 'bg-danger/10' : 'bg-secondary'
      )}>
        {icon}
      </div>
      
      <div className="flex-1 text-left">
        <p className={cn('text-sm font-medium', danger ? 'text-danger' : 'text-foreground')}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      
      {action || <ChevronRight className="w-5 h-5 text-muted-foreground" />}
    </button>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        'w-12 h-7 rounded-full transition-colors relative',
        enabled ? 'bg-savings' : 'bg-secondary'
      )}
    >
      <div
        className={cn(
          'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}

export function SettingsView() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your preferences</p>
      </div>
      
      {/* Profile Section */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
            A
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">Alex Johnson</h2>
            <p className="text-sm text-muted-foreground">alex@example.com</p>
          </div>
          <button className="px-4 py-2 bg-secondary rounded-xl text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors min-h-[44px]">
            Edit
          </button>
        </div>
      </div>
      
      {/* Preferences */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Preferences
          </h3>
        </div>
        
        <SettingItem
          icon={<Bell className="w-5 h-5 text-muted-foreground" />}
          label="Push Notifications"
          description="Get deal alerts and reminders"
          action={<ToggleSwitch enabled={notifications} onChange={() => setNotifications(!notifications)} />}
        />
        
        <SettingItem
          icon={<Moon className="w-5 h-5 text-muted-foreground" />}
          label="Dark Mode"
          description="Use dark theme"
          action={<ToggleSwitch enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />}
        />
        
        <SettingItem
          icon={<CreditCard className="w-5 h-5 text-muted-foreground" />}
          label="Price Alerts"
          description="Notify when prices drop"
          action={<ToggleSwitch enabled={priceAlerts} onChange={() => setPriceAlerts(!priceAlerts)} />}
        />
      </div>
      
      {/* Account */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Account
          </h3>
        </div>
        
        <SettingItem
          icon={<Lock className="w-5 h-5 text-muted-foreground" />}
          label="Change Password"
          description="Update your password"
        />
        
        <SettingItem
          icon={<Shield className="w-5 h-5 text-muted-foreground" />}
          label="Privacy"
          description="Manage your data"
        />
        
        <SettingItem
          icon={<Smartphone className="w-5 h-5 text-muted-foreground" />}
          label="Connected Accounts"
          description="Manage linked platforms"
        />
      </div>
      
      {/* Support */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Support
          </h3>
        </div>
        
        <SettingItem
          icon={<HelpCircle className="w-5 h-5 text-muted-foreground" />}
          label="Help Center"
          description="FAQs and guides"
          action={<ExternalLink className="w-5 h-5 text-muted-foreground" />}
        />
        
        <SettingItem
          icon={<Mail className="w-5 h-5 text-muted-foreground" />}
          label="Contact Support"
          description="Get help from our team"
        />
      </div>
      
      {/* Danger Zone */}
      <div className="bg-card border border-danger/20 rounded-2xl overflow-hidden">
        <SettingItem
          icon={<Trash2 className="w-5 h-5" />}
          label="Delete Account"
          description="Permanently delete your data"
          danger
        />
        
        <SettingItem
          icon={<LogOut className="w-5 h-5" />}
          label="Sign Out"
          danger
        />
      </div>
      
      {/* Version */}
      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">PSIE v1.0.0</p>
        <p className="text-xs text-muted-foreground">Made with care for smarter spending</p>
      </div>
    </div>
  );
}
