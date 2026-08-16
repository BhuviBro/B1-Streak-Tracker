import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { User, Moon, Sun, Tag, Bell, Database, Info, LogOut, Plus, Trash2, ChevronRight } from 'lucide-react';

function ProfileSection() {
  const { profile: user, updateData } = useData();
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    updateData({ profile: { ...user, name, email } });
    setShowEdit(false);
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #238636, #2ea043)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', fontWeight: 700, color: '#fff', flexShrink: 0
        }}>
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.email}</p>
        </div>
      </div>
      <Button variant="secondary" fullWidth icon={User} onClick={() => setShowEdit(true)}>
        Edit Profile
      </Button>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Display Name</label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Email Address</label>
            <input className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <Button variant="primary" fullWidth onClick={handleSave}>Save Profile</Button>
        </div>
      </Modal>
    </Card>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  return (
    <Card>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Appearance</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { id: 'light', label: '☀️ Light', Icon: Sun },
          { id: 'dark', label: '🌙 Dark', Icon: Moon },
        ].map(({ id, label }) => (
          <button
            key={id}
            id={`theme-btn-${id}`}
            onClick={() => setTheme(id)}
            style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius-sm)',
              border: `2px solid ${theme === id ? 'var(--accent-green-400)' : 'var(--border-color)'}`,
              backgroundColor: theme === id ? 'rgba(46,160,67,0.1)' : 'var(--bg-primary)',
              color: theme === id ? 'var(--accent-green-400)' : 'var(--text-secondary)',
              fontWeight: theme === id ? 700 : 400, fontSize: '14px', cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function CategoriesSection() {
  const { categories, addCategory } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#2ea043');

  const presetColors = ['#2ea043', '#58a6ff', '#f85149', '#d29922', '#a371f7', '#f0883e', '#39d353'];

  const handleAdd = () => {
    if (!catName.trim()) return;
    addCategory(catName, catColor);
    setCatName('');
    setShowAdd(false);
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Categories</h3>
        <Button id="btn-add-category-open" variant="ghost" size="sm" icon={Plus} onClick={() => setShowAdd(true)}>Add</Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: 'var(--radius-full)', backgroundColor: `${cat.color}20`, border: `1px solid ${cat.color}40` }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: cat.color, fontWeight: 600 }}>{cat.name}</span>
          </div>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Category">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Category Name</label>
            <input className="input-field" placeholder="e.g. Reading, Side Project" value={catName} onChange={e => setCatName(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Choose Color</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {presetColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCatColor(c)}
                  style={{
                    width: '30px', height: '30px', borderRadius: '50%', backgroundColor: c, border: `2px solid ${catColor === c ? '#fff' : 'transparent'}`,
                    cursor: 'pointer', outline: catColor === c ? `2px solid ${c}` : 'none'
                  }}
                />
              ))}
            </div>
          </div>
          <Button variant="primary" fullWidth disabled={!catName.trim()} onClick={handleAdd}>Save Category</Button>
        </div>
      </Modal>
    </Card>
  );
}

function DailyTimeSection() {
  const { timeCommitments: commitments, addTimeCommitment: addCommitment, deleteTimeCommitment } = useData();
  const [showAdd, setShowAdd] = useState(false);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [name, setName] = useState('');
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [type, setType] = useState('fixed');

  // Calculate available time for Tuesday
  const todayDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const totalUsed = commitments
    .filter(c => c.days.some(d => todayDays.includes(d)))
    .reduce((sum, c) => sum + c.durationMinutes, 0);
  const availableMinutes = Math.max(0, 24 * 60 - totalUsed);
  const availableHours = Math.floor(availableMinutes / 60);
  const availableMins = availableMinutes % 60;

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const emojis = { Sleep: '😴', Work: '💼', Gym: '🏋️', Travel: '🚗' };

  const toggleDay = (d) => {
    setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleAddCommitment = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const dur = (parseInt(hours, 10) || 0) * 60 + (parseInt(minutes, 10) || 0);
    addCommitment({
      name: trimmed,
      durationMinutes: dur > 0 ? dur : 60,
      days: selectedDays.length > 0 ? selectedDays : dayNames,
      type,
    });
    setName('');
    setHours(1);
    setMinutes(0);
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setShowAdd(false);
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Daily Time</h3>
        <Button id="btn-add-commitment-open" variant="ghost" size="sm" icon={Plus} onClick={() => setShowAdd(true)}>Add</Button>
      </div>

      {/* Available time summary */}
      <div style={{ padding: '10px 14px', backgroundColor: 'rgba(46,160,67,0.1)', borderRadius: 'var(--radius-sm)', marginBottom: '12px', border: '1px solid rgba(46,160,67,0.3)' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px' }}>Estimated available today</p>
        <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-green-400)' }}>{availableHours}h {availableMins}m</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {commitments.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '18px' }}>{emojis[c.name] || '⏰'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</p>
                <Badge color={c.type === 'fixed' ? '#58a6ff' : '#d29922'}>{c.type}</Badge>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {formatDuration(c.durationMinutes)} · {c.days.length === 7 ? 'Every day' : c.days.join(', ')}
              </p>
            </div>
            <button
              onClick={() => deleteTimeCommitment(c.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}
              title="Delete commitment"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Time Commitment">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Name *</label>
            <input
              id="input-commitment-name"
              className="input-field"
              placeholder="e.g. Work, Gym, Travel"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Hours</label>
              <input className="input-field" type="number" min="0" max="24" value={hours} onChange={e => setHours(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Minutes</label>
              <input className="input-field" type="number" min="0" max="59" value={minutes} onChange={e => setMinutes(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Days</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {dayNames.map(d => {
                const active = selectedDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    style={{
                      padding: '4px 10px', borderRadius: 'var(--radius-full)',
                      border: `1px solid ${active ? 'var(--accent-green-400)' : 'var(--border-color)'}`,
                      backgroundColor: active ? 'rgba(46,160,67,0.2)' : 'var(--bg-tertiary)',
                      color: active ? 'var(--accent-green-400)' : 'var(--text-secondary)',
                      fontSize: '12px', fontWeight: active ? 600 : 400, cursor: 'pointer'
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Type</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['fixed', 'flexible'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  style={{
                    flex: 1, padding: '8px',
                    border: `1px solid ${type === t ? 'var(--accent-green-400)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: type === t ? 'rgba(46,160,67,0.15)' : 'var(--bg-tertiary)',
                    color: type === t ? 'var(--accent-green-400)' : 'var(--text-secondary)',
                    fontSize: '13px', fontWeight: type === t ? 600 : 400, cursor: 'pointer', textTransform: 'capitalize'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button
            id="btn-submit-commitment"
            variant="primary"
            fullWidth
            disabled={!name.trim()}
            onClick={handleAddCommitment}
          >
            Add Commitment
          </Button>
        </div>
      </Modal>
    </Card>
  );
}

export function SettingsScreen() {
  const { logout } = useAuth();
  const [modalContent, setModalContent] = useState(null);

  const sections = [
    { icon: Bell, label: 'Reminders', sub: 'Default: 7:00 PM', action: () => setModalContent({ title: 'Reminders', text: 'Configured for daily check-in reminders at 7:00 PM.' }) },
    { icon: Database, label: 'Backup & Sync', sub: 'Firebase Ready', action: () => setModalContent({ title: 'Backup & Sync', text: 'Cloud Firestore synchronization structure configured in Phase 4.' }) },
    { icon: Info, label: 'About', sub: 'Task & Routine Streak Tracker v1.0', action: () => setModalContent({ title: 'About', text: 'GitHub-inspired productivity & habit streak tracker built with React, Vite & Firebase.' }) },
    { icon: LogOut, label: 'Logout', sub: 'Sign out of your account', danger: true, action: async () => {
      if (confirm('Are you sure you want to sign out?')) {
        try {
          await logout();
          window.location.reload();
        } catch (e) {
          console.error(e);
        }
      }
    }},
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ paddingTop: '8px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>Settings</h1>
      </div>

      <ProfileSection />
      <AppearanceSection />
      <CategoriesSection />
      <DailyTimeSection />

      {/* Other Settings */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {sections.map(({ icon: Icon, label, sub, danger, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: label !== 'Logout' ? '1px solid var(--border-muted)' : 'none',
                width: '100%', textAlign: 'left'
              }}
            >
              <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', backgroundColor: danger ? 'rgba(248,81,73,0.1)' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={danger ? 'var(--status-danger)' : 'var(--text-secondary)'} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: danger ? 'var(--status-danger)' : 'var(--text-primary)' }}>{label}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{sub}</p>
              </div>
              <ChevronRight size={14} color="var(--text-tertiary)" />
            </button>
          ))}
        </div>
      </Card>

      {/* Info Modal */}
      <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {modalContent?.text}
          </p>
          <Button variant="primary" fullWidth onClick={() => setModalContent(null)}>Close</Button>
        </div>
      </Modal>

      <div style={{ height: '8px' }} />
    </div>
  );
}
