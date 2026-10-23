
import {ChartNoAxesCombined, LayoutDashboard, ArrowLeftRight, Wallet, ChartPie, Target,
  Settings,
  Bell,
  Search,
} from 'lucide-react'
import './App.css'
import { useState, useEffect } from 'react';

function App() {


const [isFormOpen, setIsFormOpen] = useState(false);
const [editingTransaction, setEditingTransaction] = useState(null);

/*Load Saved Transactions */

const [transactions, setTransactions] = useState(() =>{
  const savedTransactions = localStorage.getItem("fintrack-transactions");

  return savedTransactions ? JSON.parse(savedTransactions) : [];
});


  function handleAddTransaction(){
    setIsFormOpen(true)
    
  }

  /*synchronize react with local storage and persistently save transactions*/
  useEffect(() => {
    localStorage.setItem("fintrack-transactions", JSON.stringify(transactions));
  }, [transactions])


  function handleSaveTransaction(transaction){

    /*update transactions(array) without mutating the existing data */
    setTransactions(previousTransactions => {

      if(editingTransaction){
        return previousTransactions.map(item => item.id === transaction.id ? transaction : item)
      }

      return [...previousTransactions, transaction]
    });
  }


   function handleDeleteTransaction(id){
      setTransactions(previousTransactions => 
        previousTransactions.filter(transaction => transaction.id !== id)
      )
  }

  function handleEditTransaction(transaction){
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  }

  const totalIncome = transactions.filter(transaction => transaction.type === "income").reduce((total, transaction) => total + transaction.amount, 0)
  

 const totalExpenses = transactions.filter(transaction => transaction.type === "expense").reduce((total, transaction) => total + transaction.amount, 0)

 const totalBalance = totalIncome - totalExpenses

   const stats = [
    {title: "Total Balance", amount : totalBalance, change: 8.2},
    {title: "Income", amount : totalIncome, change: 5.4},
    {title: "Expenses", amount : totalExpenses, change: -2.4},
    {title: "Savings", amount : 20000, change: 3.1}
  ]
  

  return (
    <div className="app-layout">
      
      <Sidebar/>

      <main className="main-area">

        <Header/>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">YOUR FINANCES</p>
              <h1>Dashboard</h1>
              <p className="page-description">
                Welcome back! Here's your financial overview.
              </p>
            </div>

            <button className="primary-button" onClick={handleAddTransaction}>
              + Add Transaction
            </button>

          </div>

          {isFormOpen && (
            <div className="form-container">
              <TransactionForm key={editingTransaction?.id ?? "new"} onCancel={() => {setIsFormOpen(false); setEditingTransaction(null)}} onSave={handleSaveTransaction} transactionToEdit={editingTransaction}/>
            </div>
          )}

          <div className="welcome-panel">
            <h2>Your money, clearly understood.</h2>
            <p>
              Track your income, manage expenses, and build better
              financial habits with FinTrack.
            </p>
          </div>
          
        </section>


        <section className="stats-grid">

          {stats.map(stat => (
            <div>
              <StatCard key={stat.title} title={stat.title} amount={stat.amount} change={stat.change}/>

            </div>
          ))}
        </section>

        <section>
          <h2>Recent Transactions</h2>

<div className="transactions-list">
  {transactions.length === 0 ? (
    <div className="empty-state">
      <h3>No transactions yet</h3>
      <p>Add your first transaction to get started.</p>
    </div>
  ) : (
    transactions.map(transaction => (
      <div key={transaction.id} className="transaction-item">
        <div className="transaction-info">
          <h4>{transaction.description}</h4>
          <p>{transaction.type}</p>
          <span className="transaction-category">
              {transaction.category ?? "Other"}
          </span>
        </div>

        <p
          className={
            transaction.type === "income"
              ? "transaction-income"
              : "transaction-expense"
          }
        >
          {transaction.type === "income" ? "+" : "-"}
          KSh {transaction.amount.toLocaleString("en-KE")}
        </p>

        <button
          type="button"
          className="delete-transaction-btn"
          onClick={() => handleDeleteTransaction(transaction.id)}
        >
          Delete
        </button>

        <button onClick={() => handleEditTransaction(transaction)}>Edit</button>
      </div>
    ))
  )}
</div>
        </section>

      </main>
    </div>
  )

}

/*HEADER */
function Header(){
  return(
    <div>

              <header className="topbar">
          <div className="breadcrumb">
            <span>Pages</span>
            <span>/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="header-actions">
            <button className="icon-button" aria-label="Search">
              <Search size={19} />
            </button>

            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>

            <div className="avatar">P</div>
          </div>
        </header>
    </div>
  )
}

/*SIDEBAR */
function Sidebar(){

  return(
    <div>

           <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ChartNoAxesCombined size={22} />
          </div>
          <span>FinTrack</span>
        </div>

        <p className="nav-label">MENU</p>

        <nav className="navigation">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>

          <a href="#" className="nav-item">
            <ArrowLeftRight size={19} />
            <span>Transactions</span>
          </a>

          <a href="#" className="nav-item">
            <Wallet size={19} />
            <span>Wallets</span>
          </a>

          <a href="#" className="nav-item">
            <ChartPie size={19} />
            <span>Budgets</span>
          </a>

          <a href="#" className="nav-item">
            <ChartNoAxesCombined size={19} />
            <span>Analytics</span>
          </a>

          <a href="#" className="nav-item">
            <Target size={19} />
            <span>Goals</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a href="#" className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </a>

          <div className="profile">
            <div className="avatar">P</div>
            <div>
              <p className="profile-name">Your Profile</p>
              <p className="profile-role">Personal Account</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

/**STATCARD (reusable) */
function StatCard({title, amount, change}){

  return(
      <div className="stat-card">
        <p>{title}</p>
        <h2>{amount.toLocaleString("en-KE")}</h2>
        <p className={change >= 0 ? "positive-change" : "negative-change"}>{change}%</p>

      </div>
  )
}

/**TRANSACTION FORM */
function TransactionForm({onCancel, onSave, transactionToEdit}){

  const [description, setDescription] = useState(transactionToEdit?.description ?? "");
  const [amount, setAmount] = useState(transactionToEdit?.amount ?? "");
  const [type, setType] = useState(transactionToEdit?.type ?? "expense");
  const [category, setCategory] = useState(transactionToEdit?.category ?? "Other");

  function handleSubmit(event){
    event.preventDefault();

    if(description === ""){
      alert("Please enter a transaction description");
      return;
    }

    if(amount === "" || Number(amount) <= 0){
      alert("Please enter a valid amount greater than zero");
      return;
    }

    const transaction = {
      id: transactionToEdit?.id ?? crypto.randomUUID(),
      description: description.trim(),
      amount: Number(amount),
      type,
    category}
   
    onSave(transaction);
    onCancel();
    
  }

console.log("Selected categories:", categories[type]);


  return(
    <form  className='transaction-form' onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>

      <label htmlFor="description">Description</label>
      <input type="text" id='description' placeholder='e.g. Groceries' value={description} onChange={(event) => setDescription(event.target.value)}/>

      <label htmlFor="amount">Amount (Kshs)</label>
      <input type="number" placeholder='e.g. 1500' id='amount' value={amount} onChange={(event) => setAmount(event.target.value)} />
      
      <label htmlFor="transaction-type">Transaction Type</label>
      <select id='transaction-type' value={type} onChange={(event => setType(event.target.value))}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <div className="form-group">
        <label htmlFor="category">Category</label>

        <select id="category"
          value={category} onChange={(event) => { setCategory(event.target.value) }}>

            {categories[type].map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
      </div>

<div className="form-actions">
  <button type="submit">Save Transaction</button>
  <button type="button" onClick={onCancel}>Cancel</button>
</div>

    </form>
  )
}

const categories = {
  expense: [
    "Food & Drinks",
    "Transport",
    "Shopping",
    "Bills",
    "Education",
    "Entertainment",
    "Other"
  ],
  income: [
    "Allowance",
    "Freelancing",
    "Salary",
    "Business",
    "Other"
  ]
};

export default App
