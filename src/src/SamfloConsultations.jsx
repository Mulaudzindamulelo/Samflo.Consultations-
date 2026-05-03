import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, TrendingUp, Settings, Users, FileText, Target, Calendar } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SamfloConsultations() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'General',
    amount: '',
    type: 'expense',
    taxCategory: 'Standard',
    clientId: '',
    invoiceNumber: ''
  });

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: '',
    clientId: '',
    amount: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'pending',
    description: ''
  });

  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    taxNumber: ''
  });

  const [budgetForm, setBudgetForm] = useState({
    category: 'General',
    monthlyLimit: '',
    alertThreshold: '80'
  });

  const [recurringForm, setRecurringForm] = useState({
    description: '',
    category: 'General',
    amount: '',
    type: 'expense',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    taxCategory: 'Standard'
  });

  const categories = ['General', 'Salary', 'Utilities', 'Supplies', 'Marketing', 'Travel', 'Client Services', 'Rent', 'Insurance', 'Professional Fees', 'Other Income', 'Other Expense'];
  const taxCategories = ['Standard (15%)', 'Reduced (10%)', 'Exempt', 'Zero Rated'];

  useEffect(() => {
  const loadData = async () => {
        const [txResult, invResult, clientResult, budgetResult, recurResult] = await Promise.all([
          window.storage?.get?.('samflo-transactions') || Promise.resolve(null),
          window.storage?.get?.('samflo-invoices') || Promise.resolve(null),
          window.storage?.get?.('samflo-clients') || Promise.resolve(null),
          window.storage?.get?.('samflo-budgets') || Promise.resolve(null),
          window.storage?.get?.('samflo-recurring') || Promise.resolve(null)
        ]);
        
        if (txResult?.value) setTransactions(JSON.parse(txResult.value));
        if (invResult?.value) setInvoices(JSON.parse(invResult.value));
        if (clientResult?.value) setClients(JSON.parse(clientResult.value));
        if (budgetResult?.value) setBudgets(JSON.parse(budgetResult.value));
        if (recurResult?.value) setRecurring(JSON.parse(recurResult.value));
      } catch (error) {
        console.log('Starting fresh');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        if (transactions.length > 0 && window.storage?.set) {
          await window.storage.set('samflo-transactions', JSON.stringify(transactions));
        }
        if (invoices.length > 0 && window.storage?.set) {
          await window.storage.set('samflo-invoices', JSON.stringify(invoices));
        }
        if (clients.length > 0 && window.storage?.set) {
          await window.storage.set('samflo-clients', JSON.stringify(clients));
        }
        if (budgets.length > 0 && window.storage?.set) {
          await window.storage.set('samflo-budgets', JSON.stringify(budgets));
        }
        if (recurring.length > 0 && window.storage?.set) {
          await window.storage.set('samflo-recurring', JSON.stringify(recurring));
        }
      } catch (error) {
        console.error('Error saving:', error);
      }
    };
    saveData();
  }, [transactions, invoices, clients, budgets, recurring]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;

    const newTransaction = {
      id: Date.now(),
      date: form.date,
      description: form.description,
      category: form.category,
      amount: parseFloat(form.amount),
      type: form.type,
      taxCategory: form.taxCategory,
      clientId: form.clientId || null,
      invoiceNumber: form.invoiceNumber || null
    };

    setTransactions([...transactions, newTransaction]);
    setForm({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'General',
      amount: '',
      type: 'expense',
      taxCategory: 'Standard',
      clientId: '',
      invoiceNumber: ''
    });
  };

  const handleAddInvoice = (e) => {
    e.preventDefault();
    if (!invoiceForm.invoiceNumber || !invoiceForm.amount) return;

    const newInvoice = {
      id: Date.now(),
      ...invoiceForm,
      amount: parseFloat(invoiceForm.amount),
      createdDate: new Date().toISOString().split('T')[0]
    };

    setInvoices([...invoices, newInvoice]);
    setInvoiceForm({
      invoiceNumber: '',
      clientId: '',
      amount: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'pending',
      description: ''
    });
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!clientForm.name) return;

    const newClient = {
      id: Date.now(),
      ...clientForm
    };

    setClients([...clients, newClient]);
    setClientForm({ name: '', email: '', phone: '', taxNumber: '' });
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!budgetForm.category || !budgetForm.monthlyLimit) return;

    const existingIndex = budgets.findIndex(b => b.category === budgetForm.category);
    if (existingIndex >= 0) {
      const updated = [...budgets];
      updated[existingIndex] = { ...budgetForm, monthlyLimit: parseFloat(budgetForm.monthlyLimit), alertThreshold: parseInt(budgetForm.alertThreshold) };
      setBudgets(updated);
    } else {
      setBudgets([...budgets, { ...budgetForm, monthlyLimit: parseFloat(budgetForm.monthlyLimit), alertThreshold: parseInt(budgetForm.alertThreshold) }]);
    }
    setBudgetForm({ category: 'General', monthlyLimit: '', alertThreshold: '80' });
  };

  const handleAddRecurring = (e) => {
    e.preventDefault();
    if (!recurringForm.description || !recurringForm.amount) return;

    const newRecurring = {
      id: Date.now(),
      ...recurringForm,
      amount: parseFloat(recurringForm.amount)
    };

    setRecurring([...recurring, newRecurring]);
    setRecurringForm({
      description: '',
      category: 'General',
      amount: '',
      type: 'expense',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      taxCategory: 'Standard'
    });
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleDeleteInvoice = (id) => {
    setInvoices(invoices.filter(i => i.id !== id));
  };

  const handleDeleteClient = (id) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const handleDeleteBudget = (category) => {
    setBudgets(budgets.filter(b => b.category !== category));
  };

  const handleDeleteRecurring = (id) => {
    setRecurring(recurring.filter(r => r.id !== id));
  };

  const monthlyTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));
  const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;

  const totalTransactions = transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
  const pendingInvoices = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const paidInvoices = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  const taxBreakdown = monthlyTransactions.reduce((acc, t) => {
    const taxCat = t.taxCategory || 'Standard (15%)';
    const existing = acc.find(item => item.category === taxCat);
    if (existing) {
      existing.amount += t.amount;
    } else {
      acc.push({ category: taxCat, amount: t.amount });
    }
    return acc;
  }, []);

  const calculateTaxLiability = (amount, taxCat) => {
    const rates = { 'Standard (15%)': 0.15, 'Reduced (10%)': 0.10, 'Exempt': 0, 'Zero Rated': 0 };
    return amount * (rates[taxCat] || 0);
  };

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedMonth.split('-')[0], i, 1).toISOString().slice(0, 7);
    const monthTrans = transactions.filter(t => t.date.startsWith(date));
    const inc = monthTrans.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = monthTrans.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return {
      month: new Date(date + '-01').toLocaleDateString('en-US', { month: 'short' }),
      income: inc,
      expense: exp,
      balance: inc - exp
    };
  });

  const categoryData = monthlyTransactions.reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.value += t.amount;
    } else {
      acc.push({ name: t.category, value: t.amount });
    }
    return acc;
  }, []);

  const budgetAlerts = budgets.map(budget => {
    const spent = monthlyTransactions
      .filter(t => t.category === budget.category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const percentage = (spent / budget.monthlyLimit) * 100;
    return {
      ...budget,
      spent,
      percentage,
      alert: percentage >= budget.alertThreshold
    };
  });

  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316'];

  const exportToCSV = (data, filename) => {
    const csv = [Object.keys(data[0]).join(',')]
      .concat(data.map(row => Object.values(row).map(v => `"${v}"`).join(',')))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      color: '#e2e8f0',
      padding: '1.5rem',
      fontFamily: "'Outfit', sans-serif"
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Merriweather:wght@400;700&display=swap');
        
        body { font-family: 'Outfit', sans-serif; }
        h1, h2, h3 { font-family: 'Merriweather', serif; }
        
        input, select, textarea {
          font-family: 'Outfit', sans-serif;
          background: #1a1f3a;
          border: 1px solid #475569;
          color: #e2e8f0;
          padding: 0.75rem;
          border-radius: 8px;
          transition: all 0.3s;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
        }
        
        button {
          font-family: 'Outfit', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          border-radius: 8px;
          font-weight: 600;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          color: white;
          padding: 0.75rem 1.5rem;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(167, 139, 250, 0.3); }
        
        .btn-secondary {
          background: #334155;
          color: #e2e8f0;
          padding: 0.5rem 1rem;
        }
        .btn-secondary:hover { background: #475569; }
        
        .btn-danger {
          background: #ef4444;
          color: white;
          padding: 0.5rem 1rem;
        }
        .btn-danger:hover { background: #dc2626; }
        
        .card {
          background: rgba(26, 31, 58, 0.8);
          border: 1px solid #475569;
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }
        
        .stat-box {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(59, 130, 246, 0.1));
          border: 1px solid #475569;
          border-radius: 12px;
          transition: all 0.3s;
        }
        .stat-box:hover { transform: translateY(-4px); border-color: #a78bfa; }
        
        .tab-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #334155;
          flex-wrap: wrap;
        }
        
        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: #94a3b8;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .tab-btn.active {
          color: #a78bfa;
          border-bottom-color: #a78bfa;
        }
        
        .tab-btn:hover { color: #e2e8f0; }
        
        .transaction-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #334155;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .transaction-row:hover { background: rgba(167, 139, 250, 0.05); }
        
        .alert-box {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1));
          border: 1px solid #dc2626;
          border-radius: 8px;
          padding: 1rem;
          margin: 0.5rem 0;
        }
        
        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        
        .badge-success { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .badge-warning { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .badge-danger { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
      `}</style>

      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header with Logo */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', backgroundColor: 'rgba(26, 31, 58, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>Samflo Consultations</h1>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Professional Financial Management System</p>
            </div>
          </div>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '0.75rem 1rem', width: '180px' }}
          />
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} /> Dashboard
          </button>
          <button className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Transactions
          </button>
          <button className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Invoices
          </button>
          <button className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} /> Clients
          </button>
          <button className={`tab-btn ${activeTab === 'budgets' ? 'active' : ''}`} onClick={() => setActiveTab('budgets')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} /> Budgets
          </button>
          <button className={`tab-btn ${activeTab === 'recurring' ? 'active' : ''}`} onClick={() => setActiveTab('recurring')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> Recurring
          </button>
          <button className={`tab-btn ${activeTab === 'taxes' ? 'active' : ''}`} onClick={() => setActiveTab('taxes')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} /> Taxes
          </button>
          <button className={`tab-btn ${activeTab === 'balance' ? 'active' : ''}`} onClick={() => setActiveTab('balance')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} /> Balance Sheet
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="stat-box">
                <div style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Monthly Income</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>R{income.toFixed(2)}</div>
              </div>
              <div className="stat-box">
                <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Monthly Expenses</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>R{expenses.toFixed(2)}</div>
              </div>
              <div className="stat-box">
                <div style={{ color: '#3b82f6', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Monthly Balance</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: balance >= 0 ? '#3b82f6' : '#f59e0b' }}>R{balance.toFixed(2)}</div>
              </div>
              <div className="stat-box">
                <div style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Pending Invoices</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>R{pendingInvoices.toFixed(2)}</div>
              </div>
              <div className="stat-box">
                <div style={{ color: '#a78bfa', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Paid Invoices</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#a78bfa' }}>R{paidInvoices.toFixed(2)}</div>
              </div>
              <div className="stat-box">
                <div style={{ color: '#ec4899', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Total Balance</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ec4899' }}>R{totalTransactions.toFixed(2)}</div>
              </div>
            </div>
          </>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'transactions' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Add Transaction</h3>
              <form onSubmit={handleAddTransaction} style={{ display: 'grid', gap: '1rem' }}>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select value={form.taxCategory} onChange={(e) => setForm({ ...form, taxCategory: e.target.value })}>
                  {taxCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="number" placeholder="Amount" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Plus size={20} /> Add Transaction
                </button>
              </form>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f1f5f9' }}>Monthly Transactions</h3>
                {monthlyTransactions.length > 0 && (
                  <button onClick={() => exportToCSV(monthlyTransactions, 'transactions')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={16} /> Export
                  </button>
                )}
              </div>
              {monthlyTransactions.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No transactions</p>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {monthlyTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(tx => {
                    const client = clients.find(c => c.id.toString() === tx.clientId);
                    return (
                      <div key={tx.id} className="transaction-row">
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{tx.description}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                            {tx.category} {tx.taxCategory && `• ${tx.taxCategory}`} {client && `• ${client.name}`}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(tx.date).toLocaleDateString()}</div>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: tx.type === 'income' ? '#10b981' : '#ef4444', marginRight: '1rem' }}>
                          {tx.type === 'income' ? '+' : '-'} R{tx.amount.toFixed(2)}
                        </div>
                        <button onClick={() => handleDeleteTransaction(tx.id)} className="btn-danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Create Invoice</h3>
              <form onSubmit={handleAddInvoice} style={{ display: 'grid', gap: '1rem' }}>
                <input type="text" placeholder="Invoice Number" value={invoiceForm.invoiceNumber} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })} />
                <input type="number" placeholder="Amount" step="0.01" value={invoiceForm.amount} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })} />
                <input type="date" value={invoiceForm.issueDate} onChange={(e) => setInvoiceForm({ ...invoiceForm, issueDate: e.target.value })} />
                <input type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} placeholder="Due Date" />
                <textarea placeholder="Description" value={invoiceForm.description} onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })} style={{ minHeight: '80px' }} />
                <select value={invoiceForm.status} onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Plus size={20} /> Create Invoice
                </button>
              </form>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f1f5f9' }}>All Invoices</h3>
                {invoices.length > 0 && (
                  <button onClick={() => exportToCSV(invoices, 'invoices')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={16} /> Export
                  </button>
                )}
              </div>
              {invoices.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No invoices</p>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {invoices.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate)).map(inv => {
                    const client = clients.find(c => c.id.toString() === inv.clientId);
                    const statusColor = inv.status === 'paid' ? '#10b981' : inv.status === 'pending' ? '#f59e0b' : '#ef4444';
                    return (
                      <div key={inv.id} className="transaction-row">
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#f1f5f9' }}>Invoice {inv.invoiceNumber}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{client?.name || 'Unknown Client'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Issued: {new Date(inv.issueDate).toLocaleDateString()} | Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#3b82f6', marginBottom: '0.5rem' }}>R{inv.amount.toFixed(2)}</div>
                          <span className="badge" style={{ background: `rgba(${statusColor === '#10b981' ? '16, 185, 129' : statusColor === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.2)`, color: statusColor }}>
                            {inv.status.toUpperCase()}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteInvoice(inv.id)} className="btn-danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLIENTS TAB */}
        {activeTab === 'clients' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Add Client</h3>
              <form onSubmit={handleAddClient} style={{ display: 'grid', gap: '1rem' }}>
                <input type="text" placeholder="Client Name" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} />
                <input type="email" placeholder="Email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} />
                <input type="tel" placeholder="Phone" value={clientForm.phone} onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })} />
                <input type="text" placeholder="Tax Number (e.g., VAT)" value={clientForm.taxNumber} onChange={(e) => setClientForm({ ...clientForm, taxNumber: e.target.value })} />
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Plus size={20} /> Add Client
                </button>
              </form>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#f1f5f9' }}>Client Directory</h3>
                {clients.length > 0 && (
                  <button onClick={() => exportToCSV(clients, 'clients')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={16} /> Export
                  </button>
                )}
              </div>
              {clients.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No clients</p>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {clients.map(client => {
                    const clientInvoices = invoices.filter(i => i.clientId.toString() === client.id.toString());
                    const totalInvoiced = clientInvoices.reduce((sum, i) => sum + i.amount, 0);
                    return (
                      <div key={client.id} className="transaction-row">
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{client.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{client.email}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{client.phone} • {client.taxNumber}</div>
                          <div style={{ fontSize: '0.8rem', color: '#a78bfa', marginTop: '0.25rem' }}>Total Invoiced: R{totalInvoiced.toFixed(2)}</div>
                        </div>
                        <button onClick={() => handleDeleteClient(client.id)} className="btn-danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BUDGETS TAB */}
        {activeTab === 'budgets' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Set Budget</h3>
              <form onSubmit={handleAddBudget} style={{ display: 'grid', gap: '1rem' }}>
                <select value={budgetForm.category} onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="number" placeholder="Monthly Limit" step="0.01" value={budgetForm.monthlyLimit} onChange={(e) => setBudgetForm({ ...budgetForm, monthlyLimit: e.target.value })} />
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>Alert Threshold: {budgetForm.alertThreshold}%</label>
                  <input type="range" min="0" max="100" value={budgetForm.alertThreshold} onChange={(e) => setBudgetForm({ ...budgetForm, alertThreshold: e.target.value })} style={{ width: '100%' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Plus size={20} /> Set Budget
                </button>
              </form>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Budget Overview</h3>
              {budgets.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No budgets set</p>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {budgets.map(budget => {
                    const spent = monthlyTransactions.filter(t => t.category === budget.category && t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
                    const percentage = (spent / budget.monthlyLimit) * 100;
                    const remaining = budget.monthlyLimit - spent;
                    return (
                      <div key={budget.category} style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{budget.category}</span>
                          <span className="badge" style={{ background: percentage >= budget.alertThreshold ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: percentage >= budget.alertThreshold ? '#ef4444' : '#10b981' }}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div style={{ background: '#334155', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                          <div style={{ background: percentage >= budget.alertThreshold ? '#ef4444' : '#10b981', height: '100%', width: `${Math.min(percentage, 100)}%`, transition: 'width 0.3s' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                          <div>Spent: R{spent.toFixed(2)}</div>
                          <div>Limit: R{budget.monthlyLimit.toFixed(2)}</div>
                          <div style={{ color: remaining < 0 ? '#ef4444' : '#10b981' }}>Remaining: R{remaining.toFixed(2)}</div>
                        </div>
                        <button onClick={() => handleDeleteBudget(budget.category)} className="btn-danger" style={{ marginTop: '0.75rem', width: '100%' }}>
                          <Trash2 size={14} style={{ marginRight: '0.5rem' }} /> Delete Budget
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* RECURRING TAB */}
        {activeTab === 'recurring' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Add Recurring</h3>
              <form onSubmit={handleAddRecurring} style={{ display: 'grid', gap: '1rem' }}>
                <input type="text" placeholder="Description" value={recurringForm.description} onChange={(e) => setRecurringForm({ ...recurringForm, description: e.target.value })} />
                <select value={recurringForm.type} onChange={(e) => setRecurringForm({ ...recurringForm, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select value={recurringForm.category} onChange={(e) => setRecurringForm({ ...recurringForm, category: e.target.value })}>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="number" placeholder="Amount" step="0.01" value={recurringForm.amount} onChange={(e) => setRecurringForm({ ...recurringForm, amount: e.target.value })} />
                <select value={recurringForm.frequency} onChange={(e) => setRecurringForm({ ...recurringForm, frequency: e.target.value })}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <input type="date" value={recurringForm.startDate} onChange={(e) => setRecurringForm({ ...recurringForm, startDate: e.target.value })} />
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Plus size={20} /> Add Recurring
                </button>
              </form>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Recurring Transactions</h3>
              {recurring.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No recurring transactions</p>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {recurring.map(rec => (
                    <div key={rec.id} className="transaction-row">
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#f1f5f9' }}>{rec.description}</div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{rec.category} • {rec.frequency.toUpperCase()}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Starts: {new Date(rec.startDate).toLocaleDateString()}</div>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: rec.type === 'income' ? '#10b981' : '#ef4444', marginRight: '1rem' }}>
                        {rec.type === 'income' ? '+' : '-'} R{rec.amount.toFixed(2)}
                      </div>
                      <button onClick={() => handleDeleteRecurring(rec.id)} className="btn-danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAXES TAB */}
        {activeTab === 'taxes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Tax By Category</h3>
              {taxBreakdown.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No transactions</p>
              ) : (
                <div>
                  {taxBreakdown.map(item => {
                    const tax = calculateTaxLiability(item.amount, item.category);
                    return (
                      <div key={item.category} style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
                        <div style={{ fontWeight: '600', color: '#f1f5f9', marginBottom: '0.5rem' }}>{item.category}</div>
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Taxable Amount: R{item.amount.toFixed(2)}</div>
                        <div style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: '600' }}>Estimated Tax: R{tax.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#f1f5f9' }}>Total Tax Summary</h3>
              {monthlyTransactions.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No transactions</p>
              ) : (
                <div>
                  <div style={{ padding: '1rem', background: 'rgba(167, 139, 250, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Total Tax Liability</div>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#a78bfa' }}>
                      R{taxBreakdown.reduce((sum, item) => sum + calculateTaxLiability(item.amount, item.category), 0).toFixed(2)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                    <strong>Note:</strong> This is an estimate based on selected tax categories. Please consult with a tax professional for accurate calculations.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BALANCE SHEET TAB */}
        {activeTab === 'balance' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#10b981' }}>Assets</h3>
              <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Accounts Receivable (Pending Invoices)</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>R{pendingInvoices.toFixed(2)}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Cash (Cumulative Income)</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>R{transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#ef4444' }}>Liabilities</h3>
              <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Tax Liability</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>R{taxBreakdown.reduce((sum, item) => sum + calculateTaxLiability(item.amount, item.category), 0).toFixed(2)}</div>
              </div>
              <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Total Expenses</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ef4444' }}>R{transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', color: '#3b82f6' }}>Equity</h3>
              <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Net Balance (Total Assets - Liabilities)</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: totalTransactions >= 0 ? '#3b82f6' : '#f59e0b' }}>R{totalTransactions.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
         }
