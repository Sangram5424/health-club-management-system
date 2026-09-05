/*
 * File Path: src/views/MembersView.jsx
 * Description: Members management view allowing admins to view, create, edit, update, and delete member profiles with full entity field support.
 * Props: role ('admin' | 'trainer'), dashboard (object returned by useClubDashboard hook).
 * Backend Integration: Executes CRUD operations via /api/members (GET, POST, PUT, DELETE).
 */
import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';

const emptyMember = {
  name: '',
  email: '',
  phone: '',
  plan: 'Monthly Gym',
  trainer: 'Not Assigned',
  renewal: '2026-08-31',
  status: 'Active',
  healthGoal: '',
  gender: '',
  dateOfBirth: '',
  address: '',
  emergencyContact: ''
};

export default function MembersView({ role, dashboard }) {
  const [form, setForm] = useState(emptyMember);
  const [editingId, setEditingId] = useState(null);
  const list = role === 'trainer' ? dashboard.members.filter((member) => member.trainer === dashboard.trainerProfile.name) : dashboard.members;

  const save = (event) => {
    event.preventDefault();
    if (editingId) dashboard.updateMember(editingId, form);
    else dashboard.addMember(form);
    setForm(emptyMember);
    setEditingId(null);
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      plan: member.plan || 'Monthly Gym',
      trainer: member.trainer || 'Not Assigned',
      renewal: member.renewal || '2026-08-31',
      status: member.status || 'Active',
      healthGoal: member.healthGoal || '',
      gender: member.gender || '',
      dateOfBirth: member.dateOfBirth || '',
      address: member.address || '',
      emergencyContact: member.emergencyContact || ''
    });
  };

  return (
    <>
      <SectionHeader eyebrow={role === 'admin' ? 'Admin Panel' : 'Trainer Workspace'} title={role === 'admin' ? 'View & Manage Members' : 'Assigned Clients'} />
      {role === 'admin' && (
        <form onSubmit={save} className="panel mb-6 space-y-3">
          <h2 className="text-sm font-bold text-ink-900">{editingId ? 'Edit Member Details' : 'Add New Member'}</h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Full Name</label>
              <input className="field mt-0.5 text-xs py-1.5" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
              <input className="field mt-0.5 text-xs py-1.5" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Phone Number</label>
              <input className="field mt-0.5 text-xs py-1.5" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Fitness Goal</label>
              <input className="field mt-0.5 text-xs py-1.5" placeholder="e.g. Weight Loss" value={form.healthGoal} onChange={(e) => setForm({ ...form, healthGoal: e.target.value })} />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Gender</label>
              <select className="field mt-0.5 text-xs py-1.5" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Date of Birth</label>
              <input className="field mt-0.5 text-xs py-1.5" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Plan</label>
              <input className="field mt-0.5 text-xs py-1.5" placeholder="Plan name" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Trainer</label>
              <input className="field mt-0.5 text-xs py-1.5" placeholder="Trainer name" value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })} />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Renewal Date</label>
              <input className="field mt-0.5 text-xs py-1.5" type="date" value={form.renewal} onChange={(e) => setForm({ ...form, renewal: e.target.value })} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Status</label>
              <select className="field mt-0.5 text-xs py-1.5" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Renewal Due">Renewal Due</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Emergency Contact</label>
              <input className="field mt-0.5 text-xs py-1.5" placeholder="Emergency contact" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Address</label>
              <input className="field mt-0.5 text-xs py-1.5" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            {editingId && (
              <button type="button" className="btn-soft text-xs py-1.5 px-4" onClick={() => { setEditingId(null); setForm(emptyMember); }}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary text-xs py-1.5 px-6">
              {editingId ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      )}

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-xs">
          <thead className="text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5">Member Details</th>
              <th>Fitness Goal</th>
              <th>Gender & DOB</th>
              <th>Plan & Status</th>
              <th>Trainer</th>
              <th>Emergency Contact</th>
              {role === 'admin' && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/60 transition">
                <td className="py-3">
                  <div className="font-bold text-ink-900">{member.name}</div>
                  <div className="text-[11px] text-slate-500">{member.email} · {member.phone}</div>
                  {member.address && <div className="text-[10px] text-slate-400">{member.address}</div>}
                </td>
                <td>
                  <span className="font-semibold text-slate-700">{member.healthGoal || 'General Fitness'}</span>
                </td>
                <td>
                  <div>{member.gender || '—'}</div>
                  <div className="text-[11px] text-slate-500">{member.dateOfBirth || '—'}</div>
                </td>
                <td>
                  <div className="font-bold text-teal-800">{member.plan}</div>
                  <div className="mt-0.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      member.status === 'Active' ? 'bg-mint-100 text-mint-800' :
                      member.status === 'Renewal Due' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {member.status}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">Due: {member.renewal}</span>
                  </div>
                </td>
                <td className="font-semibold text-slate-700">{member.trainer}</td>
                <td className="text-slate-600">{member.emergencyContact || '—'}</td>
                {role === 'admin' && (
                  <td className="text-right py-2">
                    <div className="flex justify-end gap-1.5">
                      <button className="btn-soft py-1 px-2.5 text-[11px]" onClick={() => startEdit(member)}>Edit</button>
                      <button className="btn-danger py-1 px-2.5 text-[11px]" onClick={() => dashboard.deleteMember(member.id)}>Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
