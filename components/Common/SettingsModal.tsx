// Code Complete Review: 20240815120000
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Button from './Button';
import { USER_SETTINGS_KEY, GEMINI_CHAT_MODEL, APP_ROUTES } from '../../constants';
import { UserSettings, ThemeSetting, UserPlan, InteractionStyle } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Input from './Input';
import { isGeminiClientInitialized } from '../../services/geminiService';
import { useTranslation } from '../../hooks/useTranslation'; // Import useTranslation

// --- SVG Icons ---

const UserCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>User Account</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PaletteIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Appearance</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.712c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
  </svg>
);

const MicrophoneIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Speech Settings</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5h0v-6A6 6 0 0112 6v0a6 6 0 016 6v1.5m-6 7.5h0v-6a6 6 0 00-6-6v0a6 6 0 006 6v6zm0-13.5v-1.5A2.25 2.25 0 0114.25 3h1.5A2.25 2.25 0 0118 5.25v1.5m-6 0h0m-6 0H6A2.25 2.25 0 003.75 7.5H3A2.25 2.25 0 00.75 9.75v1.5A2.25 2.25 0 003 13.5h.75A2.25 2.25 0 006 11.25v-1.5A2.25 2.25 0 003.75 7.5H3v0" />
  </svg>
);

const ChatBubbleLeftRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Chat Preferences</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a.75.75 0 01-1.06 0l-3.72-3.72C5.081 17.385 4.5 16.374 4.5 15.25V6.75A2.25 2.25 0 016.75 4.5h3.879a2.25 2.25 0 011.697.734L15.375 8.25m0 0L17.25 10.5M15.375 8.25c-.098-.087-.215-.159-.338-.216m2.162 4.334c.228.059.46.097.702.123a2.25 2.25 0 011.99 2.193v1.731a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-1.731a2.25 2.25 0 011.99-2.193c.242-.026.474-.064.702-.123m5.604-2.069l-1.875-1.875M10.5 17.25h3M10.5 13.5h.008v.008H10.5v-.008z" />
  </svg>
);

// Renamed to avoid collision with ChatPage.tsx definition
const SettingsModalCpuChipIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>AI Model Information</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5M12 12h.008v.008H12V12zm0 0H8.25m3.75 0h3.75M12 12v3.75m0-7.5V8.25m0 7.5h3.75m-7.5 0H8.25m7.5 0v3.75m0-7.5V8.25m0 7.5h3.75M3.75 12h4.5m3.75 0h4.5m-4.5 3.75h4.5m-4.5-7.5h4.5m-1.5-1.5h-1.5v-1.5h1.5v1.5zm1.5 0v-1.5m0 3h-1.5v-1.5h1.5v1.5zm1.5 0v-1.5M9 9.75h1.5v1.5H9v-1.5zm-1.5 0v1.5m0-3h1.5v1.5H7.5v-1.5zm-1.5 0v1.5m3-1.5H7.5M9 12.75h1.5v1.5H9v-1.5zm-1.5 0v1.5m0-3h1.5v1.5H7.5v-1.5zm-1.5 0v1.5m3-1.5H7.5" />
  </svg>
);

const ArrowUpTrayIcon = ({ className = "w-4 h-4 mr-1.5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Upload</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4 mr-1.5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Remove</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const AcademicCapIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Language & Tone</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <title>Saved</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const QuestionMarkCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Help & Support</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

const InformationCircleIconSolid = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <title>Information</title>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const CheckCircleIconSolid = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <title>Success</title>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const ExclamationTriangleIconSolid = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <title>Warning</title>
    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const BoltIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Fast Response</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);


const defaultSettings: UserSettings = {
  defaultSpeechLanguage: 'en-US',
  theme: 'system',
  confirmClearChat: true,
  useTechnicalVocabulary: false,
  isGoogleSearchEnabled: false,
  interactionStyle: InteractionStyle.DEFAULT,
  prioritizeFastResponse: false, // Added default for fast response
};

const INTERACTION_STYLE_OPTIONS_MODAL = [
  { value: InteractionStyle.DEFAULT, label: "Default Assistant" },
  { value: InteractionStyle.AGENT, label: "Agent (Proactive)" },
  { value: InteractionStyle.ASK_ASK, label: "Ask Ask (Inquisitive)" },
  { value: InteractionStyle.MANUAL, label: "Manual (Step-by-step)" },
  { value: InteractionStyle.SC_ARCHITECT, label: "SCArchitect (Solution Architect)" },
];


interface TabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}
const Tab: React.FC<TabProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                ${isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
    role="tab"
    aria-selected={isActive}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}
const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-600 pb-2 mb-3">
      {title}
    </h3>
    {children}
  </div>
);

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  disabled?: boolean;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, description, disabled = false }) => (
    <div className="py-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${disabled ? 'text-slate-500 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>{label}</span>
        <button
          type="button"
          onClick={() => !disabled && onChange(!checked)}
          className={`${
            checked ? 'bg-primary' : 'bg-slate-500 dark:bg-slate-600'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
        >
          <span
            className={`${
              checked ? 'translate-x-5' : 'translate-x-0'
            } inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-100 shadow ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>
      {description && <p className={`text-xs mt-1 ${disabled ? 'text-slate-600 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>}
    </div>
  );

interface SelectProps<T extends string> extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    description?: string;
}

const Select = <T extends string>({ label, options, value, onChange, description, ...props }: SelectProps<T>) => (
    <div className="py-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="block w-full py-2 px-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-slate-900 dark:text-slate-100"
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {description && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
);

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsAppliedRequiringRestart?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose: propsOnClose, onSettingsAppliedRequiringRestart }) => {
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'speech' | 'chat' | 'model' | 'help'>('account');
  const { user, updateUserProfilePicture, updateUserProfileInfo } = useAuth();
  const { themeSetting, setThemePreference } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currentSettings, setCurrentSettings] = useState<UserSettings>(defaultSettings);
  const [initialSettings, setInitialSettings] = useState<UserSettings>(defaultSettings);

  const [modalSuccessMessage, setModalSuccessMessage] = useState<string | null>(null);
  const [showGoogleSearchPremiumInfo, setShowGoogleSearchPremiumInfo] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(user?.profilePictureUrl || null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modalSuccessTimeoutRef = useRef<number | null>(null);

  const hasUnsavedGeneralSettings = JSON.stringify(currentSettings) !== JSON.stringify(initialSettings);
  const hasUnsavedProfileInfo = (user && (editName !== user.name || editEmail !== user.email)) || profilePicFile !== null;


  useEffect(() => {
    if (isOpen) {
      const storedSettingsRaw = localStorage.getItem(USER_SETTINGS_KEY);
      const loadedSettings = storedSettingsRaw ? { ...defaultSettings, ...JSON.parse(storedSettingsRaw) } : defaultSettings;
      setCurrentSettings(loadedSettings);
      setInitialSettings(loadedSettings);

      if (user) {
        setEditName(user.name);
        setEditEmail(user.email);
        setProfilePicPreview(user.profilePictureUrl || null);
      }
      setProfileError(null);
      setModalSuccessMessage(null);
      setProfilePicFile(null);
      setShowGoogleSearchPremiumInfo(false);
    } else {
        if (modalSuccessTimeoutRef.current) {
            clearTimeout(modalSuccessTimeoutRef.current);
            modalSuccessTimeoutRef.current = null;
        }
    }
  }, [isOpen, user]);

  useEffect(() => {
    return () => {
      if (modalSuccessTimeoutRef.current) clearTimeout(modalSuccessTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (modalSuccessMessage) {
      if (modalSuccessTimeoutRef.current) clearTimeout(modalSuccessTimeoutRef.current);

      modalSuccessTimeoutRef.current = window.setTimeout(() => {
        setModalSuccessMessage(null); // Just clear the message, don't close the modal
        modalSuccessTimeoutRef.current = null;
      }, 3000); // Use a consistent 3 seconds for the message
    }
    return () => {
      if (modalSuccessTimeoutRef.current) clearTimeout(modalSuccessTimeoutRef.current);
    };
  }, [modalSuccessMessage]);

  useEffect(() => {
    // Clear account-specific errors when navigating away from the account tab
    if (activeTab !== 'account') {
      setProfileError(null);
    }
  }, [activeTab]);


  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setCurrentSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    setIsSavingProfile(true); 
    const oldInitialSettings = { ...initialSettings };
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(currentSettings));
    setThemePreference(currentSettings.theme);
    setInitialSettings(currentSettings);

    const requiresRestart =
        currentSettings.useTechnicalVocabulary !== oldInitialSettings.useTechnicalVocabulary ||
        currentSettings.isGoogleSearchEnabled !== oldInitialSettings.isGoogleSearchEnabled ||
        currentSettings.interactionStyle !== oldInitialSettings.interactionStyle ||
        currentSettings.prioritizeFastResponse !== oldInitialSettings.prioritizeFastResponse;


    setModalSuccessMessage("General settings saved successfully!");
    
    if (requiresRestart && onSettingsAppliedRequiringRestart) {
        onSettingsAppliedRequiringRestart();
    }
    // Reset isSavingProfile after a short delay to allow modalSuccessMessage to display
    setTimeout(() => setIsSavingProfile(false), 500);
  };


  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileError("Image too large. Max 2MB.");
        setProfilePicFile(null);
        setProfilePicPreview(user?.profilePictureUrl || null);
        return;
      }
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProfileError(null);
      setModalSuccessMessage(null);
    }
  };

  const handleRemoveProfilePic = async () => {
    setIsSavingProfile(true);
    setProfileError(null);
    setModalSuccessMessage(null);
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        updateUserProfilePicture(null);
        setProfilePicFile(null);
        setProfilePicPreview(null);
        setModalSuccessMessage("Profile picture removed.");
    } catch (e) {
        setProfileError("Failed to remove picture.");
    } finally {
        setIsSavingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
        setProfileError("User not found.");
        return;
    }
    setIsSavingProfile(true);
    setProfileError(null);
    setModalSuccessMessage(null);

    try {
        if (editName !== user.name || editEmail !== user.email) {
            await updateUserProfileInfo(editName, editEmail);
        }
        if (profilePicFile) {
            updateUserProfilePicture(profilePicPreview);
        }
        setModalSuccessMessage("Profile updated successfully!");
        setProfilePicFile(null);
    } catch (error: any) {
        setProfileError(error.message || "Failed to update profile.");
    } finally {
        setIsSavingProfile(false);
    }
  };

  const handleAttemptClose = () => {
    if (modalSuccessMessage || isSavingProfile) { // Allow close if success message is showing or saving in progress (though buttons usually disabled)
      propsOnClose();
      return;
    }

    if (activeTab === 'account' && hasUnsavedProfileInfo) {
      if (window.confirm("You have unsaved profile changes. Are you sure you want to close without saving?")) {
        propsOnClose();
      }
    } else if (['appearance', 'speech', 'chat'].includes(activeTab) && hasUnsavedGeneralSettings) {
      if (window.confirm("You have unsaved general settings. Are you sure you want to close without saving?")) {
        propsOnClose();
      }
    } else {
      propsOnClose();
    }
  };

  const handleGoogleSearchToggleChange = (checked: boolean) => {
    if (checked && user?.plan !== UserPlan.PREMIUM && user?.plan !== UserPlan.PREMIUM_ULTRA2) { // Check for Ultra2 as well
      setShowGoogleSearchPremiumInfo(true);
      // Do not change the setting if user is free and tries to enable it
      // Keep currentSettings.isGoogleSearchEnabled as is or false
      // To prevent it from "sticking" if they toggle off the info message
      // and the underlying state was already true from a previous premium session.
      // So, we only update if they are NOT free OR if they are turning it OFF.
      if (user?.plan !== UserPlan.FREE) {
         handleSettingChange('isGoogleSearchEnabled', checked);
      } else {
        // If they are Free and trying to enable, we show info, but don't change the setting.
        // If they are Free and trying to disable (was somehow true), allow disable.
        if (!checked) {
            handleSettingChange('isGoogleSearchEnabled', false);
        }
      }
    } else {
      setShowGoogleSearchPremiumInfo(false);
      handleSettingChange('isGoogleSearchEnabled', checked);
    }
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <SettingsSection title={t('settingsModal.account')}>
            {profileError && <p 
                                className="text-xs text-red-600 dark:text-red-400 p-2 bg-red-100 dark:bg-red-900/30 rounded-md"
                                role="alert" 
                                aria-live="assertive"
                             >{profileError}</p>}

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={profilePicPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&color=fff`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover bg-slate-300 dark:bg-slate-600"
              />
              <div className="space-y-1">
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} leftIcon={<ArrowUpTrayIcon />} disabled={isSavingProfile}>
                  Upload New
                </Button>
                <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleProfilePicChange} className="hidden" />
                {profilePicPreview && <Button size="sm" variant="danger" onClick={handleRemoveProfilePic} leftIcon={<TrashIcon />} disabled={isSavingProfile}>Remove</Button>}
              </div>
            </div>

            <Input label="Full Name" value={editName} onChange={e => setEditName(e.target.value)} disabled={isSavingProfile} />
            <Input label="Email Address" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} disabled={isSavingProfile} />

            <div className="mt-4 pt-3 border-t border-slate-300 dark:border-slate-600">
                <Button onClick={handleSaveProfile} isLoading={isSavingProfile} disabled={!hasUnsavedProfileInfo || isSavingProfile}>{t('settingsModal.saveProfile')}</Button>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Plan: <span className="font-bold text-primary dark:text-blue-400">{user?.plan}</span></p>
              {user?.plan !== UserPlan.PREMIUM_ULTRA2 && user?.plan !== UserPlan.PREMIUM && (
                <Link to={APP_ROUTES.PRICING} onClick={propsOnClose}>
                  <Button variant="secondary" size="sm" className="mt-2">Upgrade Plan</Button>
                </Link>
              )}
            </div>
          </SettingsSection>
        );
      case 'appearance':
        return (
          <SettingsSection title={t('settingsModal.appearance')}>
            <Select<ThemeSetting>
                label="Theme"
                options={[
                    { value: 'light', label: 'Light Mode' },
                    { value: 'dark', label: 'Dark Mode' },
                    { value: 'system', label: 'System Default' },
                ]}
                value={currentSettings.theme}
                onChange={e => handleSettingChange('theme', e.target.value as ThemeSetting)}
                description="Choose your preferred interface theme."
            />
          </SettingsSection>
        );
      case 'speech':
        return (
          <SettingsSection title={t('settingsModal.speech')}>
            <Select<'en-US' | 'km-KH'>
                label="Default Speech Language"
                options={[
                    { value: 'en-US', label: 'English (United States)' },
                    { value: 'km-KH', label: 'Khmer (Cambodia)' },
                ]}
                value={currentSettings.defaultSpeechLanguage}
                onChange={e => handleSettingChange('defaultSpeechLanguage', e.target.value as 'en-US' | 'km-KH')}
                description="Select the default language for voice input."
            />
          </SettingsSection>
        );
      case 'chat':
        return (
          <SettingsSection title={t('settingsModal.chat')}>
            <Select<InteractionStyle>
              label="Default Interaction Style"
              options={INTERACTION_STYLE_OPTIONS_MODAL}
              value={currentSettings.interactionStyle || InteractionStyle.DEFAULT}
              onChange={e => handleSettingChange('interactionStyle', e.target.value as InteractionStyle)}
              description="Set the AI's default personality for new chats."
            />
            <ToggleSwitch
                label="Default: Use Technical Vocabulary"
                checked={currentSettings.useTechnicalVocabulary}
                onChange={checked => handleSettingChange('useTechnicalVocabulary', checked)}
                description="New chats will default to using more technical language."
            />
            <ToggleSwitch
                label="Default: Enable Google Search (Premium Feature)"
                checked={currentSettings.isGoogleSearchEnabled ?? false}
                onChange={handleGoogleSearchToggleChange}
                description="New chats will default to using Google Search if your plan allows."
                disabled={(user?.plan === UserPlan.FREE && (currentSettings.isGoogleSearchEnabled ?? false)) || (user?.plan === UserPlan.FREE && showGoogleSearchPremiumInfo) }
            />
             {showGoogleSearchPremiumInfo && (
                <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-md text-xs text-yellow-700 dark:text-yellow-300">
                    Google Search is a Premium feature. Upgrade your plan to enable this by default for new chats.
                    <Link to={APP_ROUTES.PRICING} onClick={propsOnClose} className="ml-1 font-semibold hover:underline">View Plans</Link>
                </div>
            )}
            <ToggleSwitch
                label="Default: Prioritize Fast Response (Flash Model Only)"
                checked={currentSettings.prioritizeFastResponse ?? false}
                onChange={checked => handleSettingChange('prioritizeFastResponse', checked)}
                description="New chats with the Flash model will default to prioritizing speed over detailed responses. Does not apply if Google Search is also defaulted to on."
            />
            <ToggleSwitch
                label="Confirm Before Clearing Chat History"
                checked={currentSettings.confirmClearChat}
                onChange={checked => handleSettingChange('confirmClearChat', checked)}
                description="Show a confirmation dialog before deleting individual chats or clearing all history."
            />
          </SettingsSection>
        );
      case 'model':
          const isGeminiLive = isGeminiClientInitialized();
          return (
            <SettingsSection title={t('settingsModal.modelInfo')}>
                <div className="p-3 bg-slate-100 dark:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-600">
                    <h4 className="text-md font-semibold text-slate-800 dark:text-slate-100 mb-1.5">Primary Chat Model</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        <strong>Model Name:</strong> {GEMINI_CHAT_MODEL}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        <strong>Status:</strong> 
                        {isGeminiLive 
                            ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"><CheckCircleIconSolid className="w-3.5 h-3.5 mr-1"/>Active</span>
                            : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"><ExclamationTriangleIconSolid className="w-3.5 h-3.5 mr-1"/>Unavailable</span>
                        }
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        This is the core AI model powering your chat conversations. 
                        It's designed for a balance of speed, capability, and contextual understanding.
                        If unavailable, please check your API Key configuration and network.
                    </p>
                </div>
                <div className="mt-3 p-2 text-xs text-slate-500 dark:text-slate-400">
                    Model settings like temperature, Top-P, Top-K are managed internally by the application for optimal performance across various interaction styles. Advanced model configuration may be available in future updates.
                </div>
            </SettingsSection>
          );
      case 'help':
        return (
          <SettingsSection title={t('settingsModal.help')}>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              For assistance, please visit our FAQ section or contact support (details below).
              If you encounter issues with the AI, try rephrasing your prompt or starting a new chat.
            </p>
            <div className="mt-4 space-y-2">
                <Button variant="outline" size="sm" onClick={() => {navigate(APP_ROUTES.HOME); propsOnClose(); /* TODO: Link to specific FAQ section */}}>View FAQ</Button>
                <p className="text-xs text-slate-500 dark:text-slate-400">Support Email: support@aipkchat.example.com (Mock)</p>
            </div>
          </SettingsSection>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleAttemptClose} title={t('settingsModal.title')} size="xl">
      <div className="flex flex-col sm:flex-row min-h-[450px] max-h-[80vh] sm:max-h-[70vh]">
        {/* Sidebar for Tabs */}
        <div className="w-full sm:w-1/4 p-3 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 space-y-1.5 flex-shrink-0">
          <Tab icon={<UserCircleIcon />} label={t('settingsModal.account')} isActive={activeTab === 'account'} onClick={() => setActiveTab('account')} />
          <Tab icon={<PaletteIcon />} label={t('settingsModal.appearance')} isActive={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
          <Tab icon={<MicrophoneIcon />} label={t('settingsModal.speech')} isActive={activeTab === 'speech'} onClick={() => setActiveTab('speech')} />
          <Tab icon={<ChatBubbleLeftRightIcon />} label={t('settingsModal.chat')} isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <Tab icon={<SettingsModalCpuChipIcon />} label={t('settingsModal.modelInfo')} isActive={activeTab === 'model'} onClick={() => setActiveTab('model')} />
          <Tab icon={<QuestionMarkCircleIcon />} label={t('settingsModal.help')} isActive={activeTab === 'help'} onClick={() => setActiveTab('help')} />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {modalSuccessMessage && (
            <div 
                className="mb-4 p-2.5 bg-green-100 dark:bg-green-800/40 border border-green-300 dark:border-green-600 rounded-md text-sm text-green-700 dark:text-green-200 flex items-center"
                role="status"
                aria-live="polite"
            >
                <CheckIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-300"/> 
                {modalSuccessMessage}
            </div>
          )}
          {renderContent()}
        </div>
      </div>
      
      {/* Footer can be outside the flex-row if content area handles its own save buttons */}
      {/* Or, if a global save is needed for non-account tabs */}
      {activeTab !== 'account' && activeTab !== 'model' && activeTab !== 'help' && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            disabled={!hasUnsavedGeneralSettings || isSavingProfile} 
            isLoading={isSavingProfile}
            leftIcon={isSavingProfile ? undefined : <CheckIcon />}
          >
            {isSavingProfile ? "Saving..." : t('settingsModal.saveGeneralSettings')}
          </Button>
        </div>
      )}
    </Modal>
  );
};