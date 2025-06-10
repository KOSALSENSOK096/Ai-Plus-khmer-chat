// Code Complete Review: 20240815120000
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES, USER_SETTINGS_KEY } from '../../constants'; // Removed APP_NAME
import { SettingsModal } from '@/components/Common/SettingsModal'; 
import { UserSettings, UserPlan, StoredConversation, ConversationSettingsSnapshot, StartNewChatOptions } from '../../types'; // Corrected import for StartNewChatOptions
import { useAuth } from '../../hooks/useAuth'; 
import Input from '../Common/Input';
import Button from '../Common/Button';
import AppLogo from '../Common/AppLogo';
import { useTranslation } from '../../hooks/useTranslation'; // Import useTranslation

// --- SVG Icons for Sidebar ---
const MenuIcon = () => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <title>Open Sidebar Menu</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const ChevronLeftIcon = () => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <title>Close Sidebar</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const PencilIcon = ({ className = "w-4 h-4" }: {className?: string}) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Edit</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }: {className?: string}) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Delete</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <title>New Chat</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const CogIcon = ({ className = "w-5 h-5" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Settings</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PowerIcon = ({ className = "w-5 h-5" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Logout</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
    </svg>
);

const ArrowDownTrayIcon = ({ className = "w-5 h-5" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Export All History</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ArrowUpOnSquareIcon = ({ className = "w-5 h-5" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Import History</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
    </svg>
);


const ExclamationTriangleIcon = ({ className = "w-5 h-5" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Warning</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const MagnifyingGlassIcon = ({ className = "w-4 h-4 text-slate-400" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Search</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <title>Confirm</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const XMarkIcon = ({ className = "w-4 h-4" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <title>Cancel</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: (options?: StartNewChatOptions) => void;
  onLogout: () => void;
  userName: string;
  conversations: StoredConversation[];
  activeConversationId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onClearAllChatHistory: () => void;
  onExportAllChatHistory: () => void;
  onImportHistoryRequest: () => void; 
}

type TimeGroup = 'Today' | 'Yesterday' | 'Previous 7 Days' | 'Older';

const getConversationTimeGroup = (timestamp: number, t: Function): TimeGroup => {
  const now = new Date();
  const date = new Date(timestamp);

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const sevenDaysAgoStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

  if (date >= todayStart) return t('chatSidebar.timeGroup.today') as TimeGroup;
  if (date >= yesterdayStart) return t('chatSidebar.timeGroup.yesterday') as TimeGroup;
  if (date >= sevenDaysAgoStart) return t('chatSidebar.timeGroup.previous7Days') as TimeGroup;
  return t('chatSidebar.timeGroup.older') as TimeGroup;
};

// Helper for formatting timestamp in ChatSidebar
const formatSidebarTimestamp = (timestamp: number, t: Function): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  if (date >= todayStart) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., "10:30 AM"
  }
  if (date >= yesterdayStart) {
    return t('chatSidebar.timeGroup.yesterday');
  }
  // For older than yesterday, show date like "Aug 10"
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }); // e.g., "Aug 10"
};


export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onToggle,
  onNewChat,
  onLogout,
  userName,
  conversations,
  activeConversationId,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onClearAllChatHistory,
  onExportAllChatHistory,
  onImportHistoryRequest,
}) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { t } = useTranslation();
  const hasConversations = conversations.length > 0;

  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;
    return conversations.filter(conv =>
      conv.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [renamingId]);

  const handleRenameStart = (id: string, currentTitle: string) => {
    setRenamingId(id);
    setRenameValue(currentTitle);
  };

  const handleRenameConfirm = () => {
    if (renamingId && renameValue.trim()) {
      onRenameChat(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const handleRenameCancel = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const handleSettingsAppliedRequiringRestart = () => {
    onNewChat({ trigger: 'settings_change_global_defaults' }); 
  };
  
  const userPlanText = user?.plan === UserPlan.PREMIUM ? 'Premium' : user?.plan === UserPlan.PREMIUM_ULTRA2 ? 'Premium Ultra2' : 'Free';


  const renderGroupedConversations = () => {
    if (filteredConversations.length === 0 && !searchTerm) {
        return <p className="text-center text-sm text-slate-400 py-4">{t('chatSidebar.noHistory')}</p>;
    }
    if (filteredConversations.length === 0 && searchTerm) {
        return <p className="text-center text-sm text-slate-400 py-4">{t('chatSidebar.noSearchResults')}</p>;
    }

    const groupedElements: JSX.Element[] = [];
    let lastGroup: TimeGroup | null = null;

    filteredConversations.forEach(conv => {
      const currentGroup = getConversationTimeGroup(conv.lastUpdatedAt, t);
      if (currentGroup !== lastGroup) {
        groupedElements.push(
          <div key={`header-${currentGroup}`} className="px-2.5 pt-3 pb-1.5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{currentGroup}</p>
          </div>
        );
        lastGroup = currentGroup;
      }
      groupedElements.push(
        <div
          key={conv.id}
          className={`group relative p-2.5 rounded-md cursor-pointer transition-colors mx-1 ${
            activeConversationId === conv.id
              ? 'bg-primary text-white shadow-md'
              : 'hover:bg-slate-700 text-slate-300'
          }`}
          onClick={() => (renamingId !== conv.id ? onSelectChat(conv.id) : {})}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && (renamingId !== conv.id ? onSelectChat(conv.id) : {})}
          aria-current={activeConversationId === conv.id ? 'page' : undefined}
        >
          <div className="flex items-center justify-between">
            {renamingId === conv.id ? (
              <div className="flex-grow flex items-center">
                <Input
                  ref={renameInputRef}
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleRenameConfirm} 
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleRenameConfirm(); }
                    if (e.key === 'Escape') { e.preventDefault(); handleRenameCancel(); }
                  }}
                  className={`!py-1 !text-sm w-full ${activeConversationId === conv.id ? '!text-slate-800 !bg-blue-100' : '!text-slate-100 !bg-slate-600'}`}
                />
                <button onClick={handleRenameConfirm} className={`p-1 ml-1 rounded ${activeConversationId === conv.id ? 'text-blue-600 hover:text-blue-800' : 'text-green-400 hover:text-green-300'}`} title={t('chatSidebar.rename.save')}><CheckIcon /></button>
                <button onClick={handleRenameCancel} className={`p-1 rounded ${activeConversationId === conv.id ? 'text-blue-600 hover:text-blue-800' : 'text-red-400 hover:text-red-300'}`} title={t('chatSidebar.rename.cancel')}><XMarkIcon /></button>
              </div>
            ) : (
              <div className="flex-grow min-w-0"> {/* Ensure div can shrink */}
                 <span className="block truncate text-sm font-medium">{conv.title}</span>
                 <span className={`block text-xs mt-0.5 ${activeConversationId === conv.id ? 'text-blue-200' : 'text-slate-400'}`}>
                    {formatSidebarTimestamp(conv.lastUpdatedAt, t)}
                 </span>
              </div>
            )}

            {renamingId !== conv.id && (
              <div className={`flex-shrink-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${activeConversationId === conv.id ? '!opacity-100' : ''}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRenameStart(conv.id, conv.title); }}
                  className={`p-1.5 rounded-md ${activeConversationId === conv.id ? 'hover:bg-blue-600' : 'hover:bg-slate-600'}`}
                  aria-label={t('chatSidebar.actions.rename')} title={t('chatSidebar.actions.rename')}
                > <PencilIcon className="w-4 h-4" /> </button>
                <button
                  onClick={(e) => { 
                      e.stopPropagation(); 
                      onDeleteChat(conv.id);
                  }}
                  className={`p-1.5 rounded-md ${activeConversationId === conv.id ? 'hover:bg-blue-600' : 'hover:bg-slate-600'}`}
                  aria-label={t('chatSidebar.actions.delete')} title={t('chatSidebar.actions.delete')}
                > <TrashIcon className="w-4 h-4" /> </button>
              </div>
            )}
          </div>
        </div>
      );
    });
    return groupedElements;
  };

  return (
    <>
      <div
        className={`bg-slate-800 text-slate-300 flex flex-col h-full transition-all duration-300 ease-in-out ${
          isOpen ? 'w-72 md:w-80' : 'w-0'
        } overflow-hidden flex-shrink-0 border-r border-slate-700`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between h-16">
          <Link to={APP_ROUTES.HOME} className="flex items-center space-x-2 min-w-0">
            <AppLogo className="h-8 w-auto flex-shrink-0" />
            <span className="text-lg font-bold text-slate-100 truncate">{t('app.name')}</span>
          </Link>
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label="Close sidebar"
          >
            <ChevronLeftIcon />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={() => onNewChat({ trigger: 'user_action' })}
            variant="primary"
            className="w-full" 
            leftIcon={<PlusIcon />}
          >
            {t('chatSidebar.newChat')}
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-slate-700">
          <Input
            type="search"
            placeholder={t('chatSidebar.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<MagnifyingGlassIcon />}
            className="!py-2 !text-sm"
            aria-label={t('chatSidebar.searchPlaceholder')}
          />
        </div>

        {/* Conversation List */}
        <div className="flex-grow overflow-y-auto space-y-0.5 py-1">
          {renderGroupedConversations()}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-3 border-t border-slate-700 space-y-2">
           <Button
            onClick={onImportHistoryRequest} 
            variant="outline"
            size="sm"
            className="w-full"
            leftIcon={<ArrowUpOnSquareIcon />}
            title={t('chatSidebar.importHistory')}
          >
            {t('chatSidebar.importHistory')}
          </Button>
           <Button
            onClick={onExportAllChatHistory}
            variant="outline"
            size="sm"
            className="w-full"
            leftIcon={<ArrowDownTrayIcon />}
            title={t('chatSidebar.exportHistory')}
            disabled={!hasConversations}
          >
            {t('chatSidebar.exportHistory')}
          </Button>
           <Button
            onClick={onClearAllChatHistory}
            variant="outline"
            size="sm"
            className="w-full !text-red-400 !border-red-400/50 hover:!bg-red-900/30 hover:!border-red-400"
            leftIcon={<ExclamationTriangleIcon className="text-red-400" />}
            title={t('chatSidebar.clearHistory')}
            disabled={!hasConversations}
          >
            {t('chatSidebar.clearHistory')}
          </Button>
        </div>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="truncate">
                <p className="text-sm font-semibold text-slate-100 truncate">{userName}</p>
                <p className="text-xs text-slate-400 truncate">{t('chatSidebar.userPlanLabel', {plan: userPlanText})}</p>
            </div>
             {user?.profilePictureUrl && (
                <img src={user.profilePictureUrl} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-slate-600" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsSettingsModalOpen(true)}
              variant="ghost"
              size="sm"
              className="flex-1 !justify-start !px-2 !text-slate-300 hover:!bg-slate-700"
              leftIcon={<CogIcon />}
            >
              {t('chatSidebar.settings')}
            </Button>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="flex-1 !justify-start !px-2 !text-red-400 hover:!bg-red-900/30"
              leftIcon={<PowerIcon />}
            >
              {t('chatSidebar.logout')}
            </Button>
          </div>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)}
        onSettingsAppliedRequiringRestart={handleSettingsAppliedRequiringRestart}
      />
    </>
  );
};