import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  completed: boolean;
  description: string;
}

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);

  // State for user profile to allow updates
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    return null;
  });

  const [userName, setUserName] = useState(() => {
    const userEmail = localStorage.getItem('userEmail') || "User";
    return userEmail.split('@')[0];
  });

  const userInitial = userName.charAt(0).toUpperCase();

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sidebarMenuItems');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { 
        path: "/", 
        label: "Dashboard", 
        icon: "📊", 
        completed: true,
        description: "Overview and analytics"
      },
      { 
        path: "/add-record", 
        label: "Add Record", 
        icon: "➕", 
        completed: false,
        description: "Create new maintenance record"
      },
      { 
        path: "/view-records", 
        label: "View Records", 
        icon: "📋", 
        completed: true,
        description: "Browse all records"
      },
    ];
  });

  // Function to update user profile data
  const updateUserProfile = () => {
    const savedProfile = localStorage.getItem('userProfile');
    const userEmail = localStorage.getItem('userEmail') || "User";
    
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      // Use the name from profile if available, otherwise fall back to email
      setUserName(profile.name || userEmail.split('@')[0]);
    } else {
      setUserProfile(null);
      setUserName(userEmail.split('@')[0]);
    }
  };

  // Listen for profile updates
  useEffect(() => {
    // Initial load
    updateUserProfile();

    // Listen for storage events (when profile is updated from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProfile' || e.key === 'userEmail') {
        updateUserProfile();
      }
    };

    // Listen for custom event when profile is saved
    const handleProfileSaved = () => {
      updateUserProfile();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileSaved', handleProfileSaved);

    // Poll for changes (fallback for same-tab updates)
    const interval = setInterval(updateUserProfile, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileSaved', handleProfileSaved);
      clearInterval(interval);
    };
  }, []);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('sidebarMenuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    const handleOpenSidebar = () => {
      setIsOpen(true);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('openSidebar', handleOpenSidebar);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('openSidebar', handleOpenSidebar);
    };
  }, []);

  // Improved drag and drop handlers
  const handleDragStart = (e: React.DragEvent, path: string) => {
    setDraggingId(path);
    setDropPosition(null);
    e.dataTransfer.effectAllowed = 'move';
    // Add a slight delay to prevent immediate re-renders
    setTimeout(() => {}, 0);
  };

  const handleDragOver = (e: React.DragEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggingId || draggingId === path) {
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const targetMiddle = rect.top + rect.height / 2;
    
    // Determine if drop should be above or below based on mouse position
    const position = mouseY < targetMiddle ? 'above' : 'below';
    
    setDragOverId(path);
    setDropPosition(position);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the entire draggable area, not just moving between children
    const relatedTarget = e.relatedTarget as Node;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverId(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggingId || draggingId === dropPath) {
      resetDragState();
      return;
    }

    const draggedIndex = menuItems.findIndex(item => item.path === draggingId);
    const dropIndex = menuItems.findIndex(item => item.path === dropPath);

    if (draggedIndex === -1 || dropIndex === -1) {
      resetDragState();
      return;
    }

    let newIndex = dropIndex;
    
    // Adjust the insertion index based on drop position
    if (dropPosition === 'below' && draggedIndex < dropIndex) {
      newIndex = dropIndex;
    } else if (dropPosition === 'below' && draggedIndex > dropIndex) {
      newIndex = dropIndex + 1;
    } else if (dropPosition === 'above' && draggedIndex > dropIndex) {
      newIndex = dropIndex;
    } else if (dropPosition === 'above' && draggedIndex < dropIndex) {
      newIndex = dropIndex - 1;
    }

    // Ensure newIndex is within bounds
    newIndex = Math.max(0, Math.min(newIndex, menuItems.length));

    const newItems = [...menuItems];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(newIndex, 0, draggedItem);

    setMenuItems(newItems);
    resetDragState();
  };

  const handleDragEnd = () => {
    resetDragState();
  };

  const resetDragState = () => {
    setDraggingId(null);
    setDragOverId(null);
    setDropPosition(null);
  };

  const supportItems = [
    { 
      path: "/edit-profile", 
      label: "Edit Profile", 
      icon: "👤", 
      completed: true,
      description: "Manage your profile"
    }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed lg:static z-40
        bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-xl backdrop-saturate-150
        shadow-2xl border-r border-white/40
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-72'}
        h-auto min-h-screen
        rounded-r-3xl lg:rounded-3xl lg:mx-4 lg:my-4 lg:h-[calc(100vh-2rem)]
        overflow-visible
      `}>
        <div className="relative">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-6 z-50 w-6 h-6 bg-gradient-to-br from-[#bfa14a] to-amber-600 text-white rounded-full shadow-lg items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-2 border-white"
          >
            <svg 
              className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {!isCollapsed && (
            <div className="p-6 border-b border-white/40 bg-gradient-to-r from-white/50 to-amber-50/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#bfa14a] to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{userInitial}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-800 truncate">{userName}</h2>
                  <p className="text-sm text-gray-600 truncate">
                    {userProfile?.position || userProfile?.company || "Car Maintenance"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="p-4 border-b border-white/40 flex justify-center">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#bfa14a] to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">{userInitial}</span>
                </div>
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/90 backdrop-blur-md text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50">
                  {userName}
                  <div className="text-xs text-gray-300 mt-0.5">
                    {userProfile?.position || userProfile?.company || "Car Maintenance"}
                  </div>
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="p-4 py-4 space-y-2">
          {menuItems.map((item, index) => {
            const isDragging = draggingId === item.path;
            const isDragOver = dragOverId === item.path;
            
            return (
              <div
                key={item.path}
                draggable
                onDragStart={(e) => handleDragStart(e, item.path)}
                onDragOver={(e) => handleDragOver(e, item.path)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item.path)}
                onDragEnd={handleDragEnd}
                className={`transition-all duration-200 ${
                  isDragging ? 'opacity-50 cursor-grabbing scale-95' : 'cursor-grab'
                }`}
              >
                {/* Drop indicator above - only show when dragging over this item with 'above' position */}
                {isDragOver && dropPosition === 'above' && (
                  <div className="relative mb-2">
                    <div className="w-full h-1 bg-amber-400 rounded-full shadow-sm"></div>
                  </div>
                )}

                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center rounded-2xl transition-all duration-300 group relative 
                    backdrop-blur-sm border
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-700 border-amber-200/80 shadow-lg'
                        : 'text-gray-700 hover:bg-white/80 hover:shadow-md hover:border-white/50 border-transparent'
                    } ${isCollapsed ? 'justify-center p-4' : 'space-x-4 px-4 py-3'}
                    ${isDragOver && !isDragging ? 'bg-amber-50/50 border-amber-200/50' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`relative transition-all duration-300 ${
                    isCollapsed ? 'scale-110' : 'scale-100'
                  }`}>
                    <span className="text-xl filter drop-shadow-sm">{item.icon}</span>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-800 block truncate">{item.label}</span>
                      <span className="text-xs text-gray-500 mt-0.5 block truncate">{item.description}</span>
                    </div>
                  )}
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/90 backdrop-blur-md text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50">
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs text-gray-300 mt-0.5">{item.description}</div>
                      <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45"></div>
                    </div>
                  )}

                  {/* Removed the active indicator dot */}
                </NavLink>

                {/* Drop indicator below - only show when dragging over this item with 'below' position */}
                {isDragOver && dropPosition === 'below' && (
                  <div className="relative mt-2">
                    <div className="w-full h-1 bg-amber-400 rounded-full shadow-sm"></div>
                  </div>
                )}
              </div>
            );
          })}

          {!isCollapsed && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-200/50"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs font-semibold text-amber-600 backdrop-blur-sm rounded-full">
                  Profile
                </span>
              </div>
            </div>
          )}

          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-4 px-3 backdrop-blur-sm py-2 rounded-xl">
                Profile
              </h3>
            )}
            {supportItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center rounded-2xl transition-all duration-300 group relative 
                  backdrop-blur-sm border
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-700 border-amber-200/80 shadow-lg'
                      : 'text-gray-700 hover:bg-white/80 hover:shadow-md hover:border-white/50 border-transparent'
                  } ${isCollapsed ? 'justify-center p-4' : 'space-x-4 px-4 py-3'}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`relative transition-all duration-300 ${
                  isCollapsed ? 'scale-110' : 'scale-100'
                }`}>
                  <span className="text-xl filter drop-shadow-sm">{item.icon}</span>
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-800 block truncate">{item.label}</span>
                    <span className="text-xs text-gray-500 mt-0.5 block truncate">{item.description}</span>
                  </div>
                )}
                
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900/90 backdrop-blur-md text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs text-gray-300 mt-0.5">{item.description}</div>
                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45"></div>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/40 bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#bfa14a] to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                <span className="text-white text-sm">🚗</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Car Maintenance</p>
              <p className="text-xs text-gray-500 mt-1">Track & Manage</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;