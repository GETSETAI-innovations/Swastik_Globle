import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const CreateEmployeeModal = ({ isOpen, onClose }) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { companies, addEmployee } = useData();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Mechanical Engineering');
  const [designation, setDesignation] = useState('');
  const [companyId, setCompanyId] = useState(currentUser?.companyId || 'comp-1');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !designation.trim()) {
      addToast({
        title: 'Validation Error',
        message: 'Name, official email, and designation are required.',
        type: 'error',
      });
      return;
    }

    const selectedComp = companies.find((c) => c.id === companyId);

    const newEmp = addEmployee(
      {
        name,
        email,
        phone,
        department,
        designation,
        companyId,
        companyName: selectedComp?.name || currentUser?.companyName,
      },
      currentUser
    );

    addToast({
      title: 'Employee Enrolled',
      message: `${newEmp.name} enrolled with ID ${newEmp.employeeId}.`,
      type: 'success',
    });

    onClose();
    setName('');
    setEmail('');
    setPhone('');
    setDesignation('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enroll New Employee"
      subtitle="Issue enterprise credentials & departmental assignment"
      maxWidth="max-w-lg"
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
            Enroll Employee
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {isSuperAdmin && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Company Assignment *
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Employee Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Kumar"
            required
            className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Official Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ramesh@company.gov.in"
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98200 00000"
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-300 px-3 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            >
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical Systems">Electrical Systems</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Procurement & Tenders">Procurement & Tenders</option>
              <option value="Field Operations">Field Operations</option>
              <option value="Network Infrastructure">Network Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Designation *
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Project Engineer"
              required
              className="w-full h-9 rounded-lg border border-slate-300 px-3 text-slate-800 text-xs focus:ring-1 focus:ring-teal-600 focus:border-teal-600 outline-hidden"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
