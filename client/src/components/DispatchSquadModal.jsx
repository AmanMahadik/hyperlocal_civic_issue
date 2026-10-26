import React, { useState } from 'react';
import { Truck, X, ShieldAlert, Phone, User, Calendar, FileText, CheckCircle2 } from 'lucide-react';

export default function DispatchSquadModal({ isOpen, onClose, onConfirm, issue, loading = false }) {
  const department = issue?.category?.department || 'Departmental Field Unit';
  const wardName = issue?.ward?.name || 'Ward Area';

  // Smart suggestions based on department
  const getSuggestedSquads = () => {
    if (department.includes('Road') || department.includes('Civil')) {
      return [
        `PCMC Road Pothole Rapid Action Unit (${wardName})`,
        `Civil Infrastructure Quick Patching Team #2`,
        `Emergency Heavy Trench Maintenance Squad`
      ];
    }
    if (department.includes('Waste') || department.includes('Sanitation')) {
      return [
        `PCMC Solid Waste & Sanitation Rapid Squad (${wardName})`,
        `Sanitation Compactor Truck Crew #4`,
        `Community Cleanliness & Health Task Force`
      ];
    }
    if (department.includes('Water') || department.includes('Drainage')) {
      return [
        `PCMC Drainage Jetting & Sucker Machine Squad #1`,
        `Pipeline Burst Emergency Repair Unit (${wardName})`,
        `Monsoon Waterlogging Dewatering Squad`
      ];
    }
    return [
      `PCMC Ward Field Operations Squad (${wardName})`,
      `Rapid Civic Action Unit #3`
    ];
  };

  const suggestions = getSuggestedSquads();

  const [squadName, setSquadName] = useState(suggestions[0] || 'PCMC Field Response Squad');
  const [squadLead, setSquadLead] = useState('Sunil Gaikwad (Junior Engineer - Field)');
  const [leadContact, setLeadContact] = useState('+91 98224-87421');
  const [vehicleNumber, setVehicleNumber] = useState('MH-14-AZ-4920');
  const [instructions, setInstructions] = useState(
    `Inspect ground condition at ${issue?.address || 'reported site'} and initiate immediate resolution.`
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!squadName.trim()) {
      setError('Please specify the field squad name.');
      return;
    }
    setError('');
    onConfirm({
      squadName: squadName.trim(),
      squadLead: squadLead.trim(),
      leadContact: leadContact.trim(),
      vehicleNumber: vehicleNumber.trim(),
      instructions: instructions.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center text-purple-700 font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-2 text-purple-700">
              <Truck className="w-4 h-4" />
            </div>
            Dispatch Work Order to Field Squad
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Issuing an official municipal <strong>Work Order</strong> will notify the field team, allocate vehicles & equipment, and update the citizen with squad tracking info.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Squad Name with quick selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field Squad / Contracting Crew *
            </label>
            <select
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {suggestions.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
              <option value="Custom Squad">Custom / Contractor Crew</option>
            </select>
            {squadName === 'Custom Squad' && (
              <input
                type="text"
                placeholder="Enter squad name"
                onChange={(e) => setSquadName(e.target.value)}
                className="mt-2 w-full text-xs rounded-lg border border-slate-300 p-2"
                required
              />
            )}
          </div>

          {/* Supervisor & Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Field Supervisor / Lead
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={squadLead}
                  onChange={(e) => setSquadLead(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 pl-8 p-2.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supervisor Phone Contact
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 pl-8 p-2.5"
                />
              </div>
            </div>
          </div>

          {/* Machinery & Equipment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Machinery / Vehicle Number
            </label>
            <div className="relative">
              <Truck className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. PCMC Tipper MH-14-AZ-4920 / Jetting Machine #2"
                className="w-full text-xs rounded-lg border border-slate-300 pl-8 p-2.5"
              />
            </div>
          </div>

          {/* Work Order Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Order Directives & Scope *
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          {error && <p className="text-xs text-rose-600">{error}</p>}

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm disabled:opacity-50 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              {loading ? 'Generating Work Order...' : 'Dispatch Work Order & Notify Squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
