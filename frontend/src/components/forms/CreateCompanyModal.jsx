import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const CreateCompanyModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { addCompany } = useData();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [gstin, setGstin] = useState('');
  const [category, setCategory] = useState('Heavy Machinery & Engineering');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !adminEmail.trim()) {
      addToast({
        title: 'Validation Error',
        message: 'Company name and admin email are mandatory.',
        type: 'error',
      });
      return;
    }

    const newCompany = addCompany(
      {
        name,
        code: code.toUpperCase() || name.substring(0, 4).toUpperCase(),
        shortName: name.split(' ')[0],
        gstin,
        category,
        adminName,
        adminEmail,
        address,
        phone,
      },
      currentUser
    );

    addToast({
      title: 'Company Authorized',
      message: `${newCompany.name} has been enrolled into the multi-company network.`,
      type: 'success',
    });

    onClose();
    setName('');
    setCode('');
    setGstin('');
    setAdminName('');
    setAdminEmail('');
    setAddress('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Authorized Enterprise"
      subtitle="Register an independent corporate entity with dedicated ledger separation"
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            Enroll Company
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Official Registered Company Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hindustan Heavy Dynamics Ltd"
            required
            className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company Code / Acronym
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. HHDL"
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs uppercase font-mono focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              GSTIN Identification
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value)}
              placeholder="27AAACH1234K1Z0"
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs font-mono focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Procurement Sector / Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Heavy Engineering & Defense Supplies"
            className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Designated Admin Name *
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Admin Official Email *
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@enterprise.in"
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Registered Headquarters Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Plot / Street / City / State"
            className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
          />
        </div>
      </form>
    </Modal>
  );
};
