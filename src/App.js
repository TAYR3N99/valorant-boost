import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';

const RANK_EMOJIS = {
  iron: '<:Iron:1234567890>',
  bronze: '<:Bronze:1234567891>',
  silver: '<:Silver:1234567892>',
  gold: '<:Gold:1234567893>',
  platinum: '<:Platinum:1234567894>',
  diamond: '<:Diamond:1234567895>',
  ascendant: '<:Ascendant:1234567896>',
  immortal: '<:Immortal:1234567897>',
  radiant: '<:Radiant:1234567898>'
};

function App() {
  const [accounts, setAccounts] = useState(() => {
    const savedAccounts = localStorage.getItem('valorantAccounts');
    return savedAccounts ? JSON.parse(savedAccounts) : [];
  });
  const [account, setAccount] = useState({
    username: '',
    password: '',
    currentRank: '',
    targetRank: '',
    region: '',
    price: ''
  });
  const [stats, setStats] = useState({
    completedBoosts: 0,
    activeBoosts: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    // Calculate stats
    const completedBoosts = accounts.filter(acc => acc.status === 'Completed').length;
    const activeBoosts = accounts.filter(acc => acc.status === 'In Progress').length;
    setStats({ completedBoosts, activeBoosts });
  }, [accounts]);

  useEffect(() => {
    // Save accounts to localStorage whenever they change
    localStorage.setItem('valorantAccounts', JSON.stringify(accounts));
  }, [accounts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAccounts([...accounts, { 
      ...account, 
      id: Date.now(), 
      status: 'Available',
      assignedTo: '',
      startDate: '',
      estimatedCompletion: '',
      progress: 0
    }]);
    setAccount({
      username: '',
      password: '',
      currentRank: '',
      targetRank: '',
      region: '',
      price: ''
    });
    setShowForm(false);
  };

  const deleteAccount = (id) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  const assignBooster = (id, booster) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { 
        ...acc, 
        status: 'In Progress',
        assignedTo: booster,
        startDate: new Date().toLocaleDateString(),
        progress: 0
      } : acc
    ));
  };

  const updateProgress = (id, progress) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { 
        ...acc, 
        progress,
        status: progress >= 100 ? 'Completed' : acc.status
      } : acc
    ));
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewAccountDetails = (account) => {
    setSelectedAccountDetails(account);
    setShowDetails(true);
  };

  const handleEdit = (account) => {
    setEditingAccount({...account});
    setShowEdit(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setAccounts(accounts.map(acc => 
      acc.id === editingAccount.id ? editingAccount : acc
    ));
    setShowEdit(false);
    setEditingAccount(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary animate-pulse"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-xl font-bold">🎮 Valorant Boost Manager</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <div className="text-sm bg-muted/50 px-3 py-1 rounded-full">
                <span className="text-muted-foreground">⚡ Active:</span>
                <span className="ml-2 font-medium">{stats.activeBoosts}</span>
              </div>
              <div className="text-sm bg-muted/50 px-3 py-1 rounded-full">
                <span className="text-muted-foreground">✅ Completed:</span>
                <span className="ml-2 font-medium">{stats.completedBoosts}</span>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="transition-all duration-200 hover:scale-105"
            >
              {showForm ? '❌ Close Form' : '➕ Add Account'}
            </Button>
          </div>
        </div>
      </header>

      <div className="container grid gap-8 p-8 md:grid-cols-[350px_1fr]">
        {/* Form Sidebar */}
        <div className={cn(
          "space-y-6 transition-all duration-300",
          showForm ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full absolute"
        )}>
          <div className="rounded-lg border bg-card p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">📝 Add New Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">👤 Username</label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={account.username}
                  onChange={(e) => setAccount({...account, username: e.target.value})}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">🔑 Password</label>
                <input
                  type="password"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={account.password}
                  onChange={(e) => setAccount({...account, password: e.target.value})}
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">🌍 Region</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={account.region}
                  onChange={(e) => setAccount({...account, region: e.target.value})}
                >
                  <option value="">Select Region</option>
                  <option value="NA">🇺🇸 North America</option>
                  <option value="EU">🇪🇺 Europe</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">📊 Current Rank</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={account.currentRank}
                  onChange={(e) => setAccount({...account, currentRank: e.target.value})}
                >
                  <option value="">Select Current Rank</option>
                  <option value="iron">⚔️ Iron</option>
                  <option value="bronze">🥉 Bronze</option>
                  <option value="silver">🥈 Silver</option>
                  <option value="gold">🥇 Gold</option>
                  <option value="platinum">💎 Platinum</option>
                  <option value="diamond">💠 Diamond</option>
                  <option value="ascendant">⭐ Ascendant</option>
                  <option value="immortal">👑 Immortal</option>
                  <option value="radiant">🌟 Radiant</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">🎯 Target Rank</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={account.targetRank}
                  onChange={(e) => setAccount({...account, targetRank: e.target.value})}
                >
                  <option value="">Select Target Rank</option>
                  <option value="iron">⚔️ Iron</option>
                  <option value="bronze">🥉 Bronze</option>
                  <option value="silver">🥈 Silver</option>
                  <option value="gold">🥇 Gold</option>
                  <option value="platinum">💎 Platinum</option>
                  <option value="diamond">💠 Diamond</option>
                  <option value="ascendant">⭐ Ascendant</option>
                  <option value="immortal">👑 Immortal</option>
                  <option value="radiant">🌟 Radiant</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">💰 Price ($)</label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={account.price}
                  onChange={(e) => setAccount({...account, price: e.target.value})}
                  placeholder="Enter price"
                />
              </div>
              <Button className="w-full transition-all duration-200 hover:scale-[1.02]">➕ Add Account</Button>
            </form>
          </div>
        </div>

        {/* Account List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">📋 Account List</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="🔍 Search accounts..."
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                <option value="all">📊 All Status</option>
                <option value="available">🟢 Available</option>
                <option value="in-progress">🟡 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
              <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                <option value="all">🌍 All Regions</option>
                <option value="NA">🇺🇸 North America</option>
                <option value="EU">🇪🇺 Europe</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredAccounts.map((acc) => (
              <div 
                key={acc.id} 
                className={cn(
                  "rounded-lg border bg-card p-6 transition-all duration-200 hover:shadow-lg",
                  selectedAccount?.id === acc.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedAccount(acc)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">👤 {acc.username}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {acc.region === 'NA' ? '🇺🇸' : 
                         acc.region === 'EU' ? '🇪🇺' : acc.region}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">📊 Current:</span> {acc.currentRank}
                      </div>
                      <div>
                        <span className="font-medium">🎯 Target:</span> {acc.targetRank}
                      </div>
                      <div>
                        <span className="font-medium">💰 Price:</span> ${acc.price}
                      </div>
                    </div>
                    {acc.status === 'In Progress' && (
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <div>👥 Assigned to: {acc.assignedTo}</div>
                          <div>📅 Started: {acc.startDate}</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${acc.progress}%` }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateProgress(acc.id, Math.max(0, acc.progress - 10));
                            }}
                          >
                            -10%
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateProgress(acc.id, Math.min(100, acc.progress + 10));
                            }}
                          >
                            +10%
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewAccountDetails(acc);
                      }}
                    >
                      👁️ View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(acc);
                      }}
                    >
                      ✏️ Edit
                    </Button>
                    {acc.status === 'Available' && (
                      <select
                        className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                        onChange={(e) => assignBooster(acc.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">👥 Assign Booster</option>
                        <option value="Booster1">👤 Booster 1</option>
                        <option value="Booster2">👤 Booster 2</option>
                        <option value="Booster3">👤 Booster 3</option>
                      </select>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAccount(acc.id);
                      }}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    acc.status === "Completed" ? "bg-green-500" :
                    acc.status === "In Progress" ? "bg-yellow-500" :
                    "bg-blue-500"
                  )} />
                  <span className="text-sm text-muted-foreground">
                    {acc.status === "Completed" ? "✅ Completed" :
                     acc.status === "In Progress" ? "🟡 In Progress" :
                     "🟢 Available"}
                  </span>
                </div>
              </div>
            ))}
            {filteredAccounts.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">📭 No accounts found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Details Modal */}
      {showDetails && selectedAccountDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">📋 Account Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                ❌
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">👤 Username</div>
                  <div className="font-medium">{selectedAccountDetails.username}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">🔑 Password</div>
                  <div className="font-medium">{selectedAccountDetails.password}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">🌍 Region</div>
                  <div className="font-medium">
                    {selectedAccountDetails.region === 'NA' ? '🇺🇸 North America' : 
                     selectedAccountDetails.region === 'EU' ? '🇪🇺 Europe' : selectedAccountDetails.region}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">💰 Price</div>
                  <div className="font-medium">${selectedAccountDetails.price}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">📊 Current Rank</div>
                  <div className="font-medium">{selectedAccountDetails.currentRank}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">🎯 Target Rank</div>
                  <div className="font-medium">{selectedAccountDetails.targetRank}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">📊 Status</div>
                  <div className="font-medium">
                    {selectedAccountDetails.status === "Completed" ? "✅ Completed" :
                     selectedAccountDetails.status === "In Progress" ? "🟡 In Progress" :
                     "🟢 Available"}
                  </div>
                </div>
                {selectedAccountDetails.status === 'In Progress' && (
                  <>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">👥 Assigned Booster</div>
                      <div className="font-medium">{selectedAccountDetails.assignedTo}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">📅 Start Date</div>
                      <div className="font-medium">{selectedAccountDetails.startDate}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">📈 Progress</div>
                      <div className="font-medium">{selectedAccountDetails.progress}%</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && editingAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">✏️ Edit Account</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEdit(false);
                  setEditingAccount(null);
                }}
              >
                ❌
              </Button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">👤 Username</label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={editingAccount.username}
                    onChange={(e) => setEditingAccount({...editingAccount, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">🔑 Password</label>
                  <input
                    type="password"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={editingAccount.password}
                    onChange={(e) => setEditingAccount({...editingAccount, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">🌍 Region</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={editingAccount.region}
                    onChange={(e) => setEditingAccount({...editingAccount, region: e.target.value})}
                  >
                    <option value="">Select Region</option>
                    <option value="NA">🇺🇸 North America</option>
                    <option value="EU">🇪🇺 Europe</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">💰 Price ($)</label>
                  <input
                    type="number"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={editingAccount.price}
                    onChange={(e) => setEditingAccount({...editingAccount, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">📊 Current Rank</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={editingAccount.currentRank}
                    onChange={(e) => setEditingAccount({...editingAccount, currentRank: e.target.value})}
                  >
                    <option value="">Select Current Rank</option>
                    <option value="iron">⚔️ Iron</option>
                    <option value="bronze">🥉 Bronze</option>
                    <option value="silver">🥈 Silver</option>
                    <option value="gold">🥇 Gold</option>
                    <option value="platinum">💎 Platinum</option>
                    <option value="diamond">💠 Diamond</option>
                    <option value="ascendant">⭐ Ascendant</option>
                    <option value="immortal">👑 Immortal</option>
                    <option value="radiant">🌟 Radiant</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">🎯 Target Rank</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={editingAccount.targetRank}
                    onChange={(e) => setEditingAccount({...editingAccount, targetRank: e.target.value})}
                  >
                    <option value="">Select Target Rank</option>
                    <option value="iron">⚔️ Iron</option>
                    <option value="bronze">🥉 Bronze</option>
                    <option value="silver">🥈 Silver</option>
                    <option value="gold">🥇 Gold</option>
                    <option value="platinum">💎 Platinum</option>
                    <option value="diamond">💠 Diamond</option>
                    <option value="ascendant">⭐ Ascendant</option>
                    <option value="immortal">👑 Immortal</option>
                    <option value="radiant">🌟 Radiant</option>
                  </select>
                </div>
                {editingAccount.status === 'In Progress' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">👥 Assigned Booster</label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={editingAccount.assignedTo}
                        onChange={(e) => setEditingAccount({...editingAccount, assignedTo: e.target.value})}
                      >
                        <option value="">Select Booster</option>
                        <option value="Booster1">👤 Booster 1</option>
                        <option value="Booster2">👤 Booster 2</option>
                        <option value="Booster3">👤 Booster 3</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">📈 Progress</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={editingAccount.progress}
                        onChange={(e) => setEditingAccount({...editingAccount, progress: e.target.value})}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEdit(false);
                    setEditingAccount(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 